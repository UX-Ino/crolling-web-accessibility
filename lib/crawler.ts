import { chromium, Browser, Page } from 'playwright';
import { URL } from 'url';
import { AccessibilityAuditor } from './accessibility-auditor';
import { AuditResult } from '@/types/audit';

export interface CrawlResult {
  url: string;
  title: string;
  depths: string[];
}

export interface CrawlOptions {
  baseUrl: string;
  useLogin: boolean;
  loginUrl?: string;
  gnbSelector?: string;
  onLog: (message: string) => void;
  enableAudit?: boolean; // 신규: 접근성 진단 활성화
}

export class WebCrawler {
  private visited = new Set<string>();
  private visitedData: Record<string, { title: string }> = {};
  private toVisit: string[] = [];
  private gnbMap: Record<string, string> = {};
  private domain: string;
  private options: CrawlOptions;

  constructor(options: CrawlOptions) {
    this.options = options;
    this.toVisit = [options.baseUrl];
    const parsed = new URL(options.baseUrl);
    this.domain = parsed.hostname;
  }

  private log(msg: string) {
    this.options.onLog(msg);
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isPdf = parsed.pathname.toLowerCase().endsWith('.pdf');
      return (
        parsed.hostname === this.domain &&
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        !isPdf
      );
    } catch {
      return false;
    }
  }

  private async parseGnb(page: Page) {
    const selectors = this.options.gnbSelector
      ? [this.options.gnbSelector]
      : ['nav', '.gnb', '#gnb', '.menu', '#menu', '.header', 'header'];

    if (
      this.options.gnbSelector &&
      !this.options.gnbSelector.startsWith('.') &&
      !this.options.gnbSelector.startsWith('#')
    ) {
      selectors.push(`.${this.options.gnbSelector}`);
    }

    if (!this.options.gnbSelector) {
      this.log("GNB 셀렉터가 지정되지 않았습니다. 기본 셀렉터들을 시도합니다.");
    }

    for (const selector of selectors) {
      try {
        let elements = await page.locator(`${selector} a`).all();

        if (elements.length === 0 && this.options.gnbSelector) {
          elements = await page.locator(selector).all();
        }

        if (elements.length > 0) {
          this.log(`GNB 후보 발견: ${selector} (링크 ${elements.length}개)`);

          for (const el of elements) {
            const text = (await el.innerText()).trim();
            const href = await el.getAttribute('href');

            if (text && href) {
              try {
                const fullUrl = new URL(href, this.options.baseUrl).toString();
                const parsed = new URL(fullUrl);
                if (parsed.hostname === this.domain) {
                  const path = parsed.pathname.replace(/\/$/, '');
                  this.gnbMap[path] = text;
                }
              } catch { }
            }
          }

          if (Object.keys(this.gnbMap).length > 0) {
            this.log(`GNB 매핑 완료: ${Object.keys(this.gnbMap).length}개 메뉴 발견`);
            break;
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }

  private async extractLinks(page: Page, currentUrl: string): Promise<string[]> {
    const links = new Set<string>();
    try {
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href);
      });

      for (const href of hrefs) {
        if (!href) continue;
        const normalized = new URL(href, currentUrl);
        normalized.hash = '';
        const normalizedUrl = normalized.toString();

        if (this.isValidUrl(normalizedUrl)) {
          links.add(normalizedUrl);
        }
      }
    } catch (e) {
      this.log(`링크 추출 중 오류: ${e}`);
    }
    return Array.from(links);
  }

  private getKoreanName(pathSegment: string, fullPathParts: string[], depthIndex: number): string {
    const currentPath = '/' + fullPathParts.slice(0, depthIndex + 1).join('/');
    if (this.gnbMap[currentPath]) {
      return this.gnbMap[currentPath];
    }
    return pathSegment;
  }

  /**
   * 기본 크롤링 (접근성 진단 없음)
   */
  public async crawl(): Promise<CrawlResult[]> {
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await this.handleLogin(page);
      await this.parseGnb(page);

      this.log(`크롤링 시작: ${this.options.baseUrl}`);

      while (this.toVisit.length > 0) {
        const currentUrl = this.toVisit.shift()!;
        if (this.visited.has(currentUrl)) continue;

        try {
          this.log(`방문 중: ${currentUrl}`);
          await page.goto(currentUrl, { timeout: 60000 });
          await page.waitForLoadState('domcontentloaded');

          const title = await page.title();
          const newLinks = await this.extractLinks(page, currentUrl);

          for (const link of newLinks) {
            if (!this.visited.has(link) && !this.toVisit.includes(link)) {
              this.toVisit.push(link);
            }
          }

          this.visited.add(currentUrl);
          this.visitedData[currentUrl] = { title };

          await page.waitForTimeout(500);
        } catch (e) {
          this.log(`방문 실패 (${currentUrl}): ${e}`);
        }
      }

      await browser.close();
      this.log("크롤링 완료!");

      return this.formatResults();
    } catch (e) {
      await browser.close();
      this.log(`치명적 오류 발생: ${e}`);
      return [];
    }
  }

  /**
   */
  public async crawlWithAudit(): Promise<AuditResult[]> {
    // 로그 콜백 주입: Auditor 내부 로그를 Crawler 로그로 전달
    const auditor = new AccessibilityAuditor((msg) => this.log(msg));
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await this.handleLogin(page);
      await this.parseGnb(page);

      this.log(`접근성 진단 크롤링 시작: ${this.options.baseUrl}`);

      const auditResults: Map<string, AuditResult> = new Map();

      while (this.toVisit.length > 0) {
        const currentUrl = this.toVisit.shift()!;
        if (this.visited.has(currentUrl)) continue;

        try {
          this.log(`[진단 중] ${currentUrl}`);
          await page.goto(currentUrl, { timeout: 60000 });
          await page.waitForLoadState('domcontentloaded');

          try {
            await page.waitForLoadState('networkidle', { timeout: 5000 });
          } catch (e) {
            this.log('네트워크 대기 타임아웃 (진단 계속 진행)');
          }

          const title = await page.title();

          // 접근성 진단 실행
          const violations = await auditor.runAudit(page);

          const parsed = new URL(currentUrl);
          const pathParts = parsed.pathname.split('/').filter(p => p);
          const depths = ['', '', '', ''];
          for (let i = 0; i < 4; i++) {
            if (pathParts[i]) {
              depths[i] = this.getKoreanName(pathParts[i], pathParts, i);
            }
          }

          auditResults.set(currentUrl, {
            url: currentUrl,
            title,
            depths,
            totalViolations: auditor.getTotalViolationCount(violations),
            violations,
          });

          // 링크 수집
          const newLinks = await this.extractLinks(page, currentUrl);
          for (const link of newLinks) {
            if (!this.visited.has(link) && !this.toVisit.includes(link)) {
              this.toVisit.push(link);
            }
          }

          this.visited.add(currentUrl);
          this.visitedData[currentUrl] = { title };

          await page.waitForTimeout(500);
        } catch (e) {
          this.log(`진단 실패 (${currentUrl}): ${e}`);
        }
      }

      await browser.close();
      this.log("접근성 진단 완료!");

      return Array.from(auditResults.values());
    } catch (e) {
      await browser.close();
      this.log(`치명적 오류 발생: ${e}`);
      return [];
    }
  }

  /**
   * 로그인 처리 (공통)
   */
  private async handleLogin(page: Page) {
    if (this.options.useLogin) {
      const loginUrl = this.options.loginUrl || this.options.baseUrl;
      this.log(`로그인 페이지로 이동합니다: ${loginUrl}`);
      await page.goto(loginUrl);

      this.log("\n*** 중요: 브라우저 창에서 로그인을 완료해주세요. ***");
      this.log("로그인을 완료하고 메인 페이지(설정한 시작 URL)로 이동해주세요. 이동이 감지되면 크롤링을 시작합니다.");

      const start = Date.now();
      while (Date.now() - start < 300000) {
        const current = page.url();
        if (current.startsWith(this.options.baseUrl) && current !== loginUrl) {
          this.log("메인 페이지 이동 감지! 크롤링을 시작합니다.");
          break;
        }
        if (current === this.options.baseUrl) {
          this.log("메인 페이지 이동 감지! 크롤링을 시작합니다.");
          break;
        }
        await page.waitForTimeout(2000);
      }
    } else {
      try {
        await page.goto(this.options.baseUrl, { timeout: 60000 });
        await page.waitForLoadState('domcontentloaded');
      } catch (e) {
        this.log(`초기 페이지 로드 에러: ${e}`);
      }
    }

    this.log("GNB(메뉴) 분석을 시작합니다...");
  }

  /**
   * 결과 포맷팅
   */
  private formatResults(): CrawlResult[] {
    const results: CrawlResult[] = [];
    for (const url of this.visited) {
      const title = this.visitedData[url]?.title || '';
      const parsed = new URL(url);
      const pathParts = parsed.pathname.split('/').filter(p => p);

      const depths = ['', '', '', ''];
      for (let i = 0; i < 4; i++) {
        if (pathParts[i]) {
          depths[i] = this.getKoreanName(pathParts[i], pathParts, i);
        }
      }

      results.push({ url, title, depths });
    }

    return results;
  }
}
