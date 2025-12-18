import { Page } from 'playwright';
import { Violation } from '@/types/audit';
import * as fs from 'fs';
import * as path from 'path';

declare global {
  interface Window {
    axe: any;
  }
}


export interface LogCallback {
  (message: string): void;
}

export class AccessibilityAuditor {
  private onLog?: LogCallback;

  constructor(onLog?: LogCallback) {
    this.onLog = onLog;
  }

  private log(message: string) {
    if (this.onLog) {
      this.onLog(message);
    }
    console.log(message);
  }

  /**
   * axe-core 스크립트를 파일 시스템에서 직접 읽어 주입
   */
  async injectAxeCore(page: Page): Promise<void> {
    try {
      // 1. 로컬 node_modules에서 axe-core 소스 읽기
      let axePath: string;
      try {
        axePath = require.resolve('axe-core/axe.min.js');
        // Next.js 환경에서 [project] 접두사가 붙는 경우 처리
        if (axePath.startsWith('[project]')) {
          axePath = axePath.replace('[project]', process.cwd());
        }
      } catch (e) {
        // require.resolve 실패 시 수동 경로 시도
        axePath = path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js');
      }

      // 파일 존재 여부 확인 후 읽기 (없으면 catch 블록으로 이동하여 CDN 사용)
      if (fs.existsSync(axePath)) {
        const axeSource = fs.readFileSync(axePath, 'utf8');
        await page.addScriptTag({ content: axeSource });
      } else {
        // 마지막 시도: node_modules 직접 지정
        const manualPath = path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js');
        if (fs.existsSync(manualPath) && manualPath !== axePath) {
          const axeSource = fs.readFileSync(manualPath, 'utf8');
          await page.addScriptTag({ content: axeSource });
        } else {
          throw new Error(`axe-core not found at ${axePath}`);
        }
      }

    } catch (e) {
      this.log(`Local axe-core read failed, falling back to CDN: ${e}`);
      // 2. 실패 시 CDN 사용
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js',
      });
    }

    try {
      // 로드 확인
      await page.waitForFunction(() => typeof (window as any).axe !== 'undefined', null, { timeout: 10000 });
    } catch (error) {
      this.log(`Failed to inject axe-core: ${error}`);
      throw error;
    }
  }

  /**
   * 접근성 진단 실행
   */
  async runAudit(page: Page): Promise<Violation[]> {
    try {
      // axe-core 주입
      await this.injectAxeCore(page);

      // 진단 실행 (WCAG 2.1 AA)
      // this.log(`Running axe audit on page: ${page.url()}`);

      const results = await page.evaluate(async () => {
        if (!window.axe) throw new Error('Axe not loaded');
        // 브라우저 내 콘솔 로그는 터미널로 전달되지 않으므로, 반환값에 포함하거나 별도 처리가 필요하지만
        // 여기서는 중요 정보(버전 등)를 반환받아 출력하는 것이 좋습니다.
        // 일단 evaluate 내부의 console.log는 브라우저 컨텍스트라 Node 터미널에 안 찍힘.
        return await window.axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
          locale: {
            lang: 'ko',
          },
          resultTypes: ['violations'],
        });
      });

      // this.log(`Axe Version: ${results.toolOptions.axeVersion}`);
      // this.log(`Axe audit finished. Found ${results.violations?.length || 0} violations.`);

      // 결과 포맷팅
      // 결과 포맷팅
      return this.formatViolations(results.violations || []);
    } catch (error) {
      this.log(`Accessibility audit failed: ${error}`);
      return [];
    }
  }

  /**
   * axe-core 결과를 우리 형식으로 변환
   */
  private formatViolations(axeViolations: any[]): Violation[] {
    return axeViolations.map((v) => ({
      id: v.id,
      impact: v.impact || 'minor',
      description: v.description || v.help,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((node: any) => ({
        html: node.html,
        failureSummary: node.failureSummary || '',
        target: node.target,
      })),
    }));
  }

  /**
   * 위반 사항이 있는지 확인
   */
  hasViolations(violations: Violation[]): boolean {
    return violations.length > 0;
  }

  /**
   * 총 위반 개수 (모든 노드 포함)
   */
  getTotalViolationCount(violations: Violation[]): number {
    return violations.reduce((sum, v) => sum + v.nodes.length, 0);
  }

  /**
   * HTML 문자열 또는 URL에 대한 단일 검사 실행
   */
  async audit(html: string, url: string = 'about:blank'): Promise<Violation[]> {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage();
    try {
      if (url && url !== 'about:blank') {
        await page.goto(url);
        if (html) await page.setContent(html);
      } else {
        await page.setContent(html);
      }

      const results = await this.runAudit(page);
      return results;
    } finally {
      await browser.close();
    }
  }
}
