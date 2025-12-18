"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCrawler = void 0;
const playwright_1 = require("playwright");
const url_1 = require("url");
const accessibility_auditor_1 = require("./accessibility-auditor");
class WebCrawler {
    constructor(options) {
        this.visited = new Set();
        this.visitedData = {};
        this.toVisit = [];
        this.gnbMap = {};
        this.options = options;
        this.toVisit = [options.baseUrl];
        const parsed = new url_1.URL(options.baseUrl);
        this.domain = parsed.hostname;
    }
    log(msg) {
        this.options.onLog(msg);
    }
    isValidUrl(url) {
        try {
            const parsed = new url_1.URL(url);
            return (parsed.hostname === this.domain &&
                (parsed.protocol === 'http:' || parsed.protocol === 'https:'));
        }
        catch {
            return false;
        }
    }
    async parseGnb(page) {
        const selectors = this.options.gnbSelector
            ? [this.options.gnbSelector]
            : ['nav', '.gnb', '#gnb', '.menu', '#menu', '.header', 'header'];
        if (this.options.gnbSelector &&
            !this.options.gnbSelector.startsWith('.') &&
            !this.options.gnbSelector.startsWith('#')) {
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
                                const fullUrl = new url_1.URL(href, this.options.baseUrl).toString();
                                const parsed = new url_1.URL(fullUrl);
                                if (parsed.hostname === this.domain) {
                                    const path = parsed.pathname.replace(/\/$/, '');
                                    this.gnbMap[path] = text;
                                }
                            }
                            catch { }
                        }
                    }
                    if (Object.keys(this.gnbMap).length > 0) {
                        this.log(`GNB 매핑 완료: ${Object.keys(this.gnbMap).length}개 메뉴 발견`);
                        break;
                    }
                }
            }
            catch (e) {
                // Ignore errors
            }
        }
    }
    async extractLinks(page, currentUrl) {
        const links = new Set();
        try {
            const hrefs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a')).map(a => a.href);
            });
            for (const href of hrefs) {
                if (!href)
                    continue;
                const normalized = new url_1.URL(href, currentUrl);
                normalized.hash = '';
                const normalizedUrl = normalized.toString();
                if (this.isValidUrl(normalizedUrl)) {
                    links.add(normalizedUrl);
                }
            }
        }
        catch (e) {
            this.log(`링크 추출 중 오류: ${e}`);
        }
        return Array.from(links);
    }
    getKoreanName(pathSegment, fullPathParts, depthIndex) {
        const currentPath = '/' + fullPathParts.slice(0, depthIndex + 1).join('/');
        if (this.gnbMap[currentPath]) {
            return this.gnbMap[currentPath];
        }
        return pathSegment;
    }
    /**
     * 기본 크롤링 (접근성 진단 없음)
     */
    async crawl() {
        const browser = await playwright_1.chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
            await this.handleLogin(page);
            await this.parseGnb(page);
            this.log(`크롤링 시작: ${this.options.baseUrl}`);
            while (this.toVisit.length > 0) {
                const currentUrl = this.toVisit.shift();
                if (this.visited.has(currentUrl))
                    continue;
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
                }
                catch (e) {
                    this.log(`방문 실패 (${currentUrl}): ${e}`);
                }
            }
            await browser.close();
            this.log("크롤링 완료!");
            return this.formatResults();
        }
        catch (e) {
            await browser.close();
            this.log(`치명적 오류 발생: ${e}`);
            return [];
        }
    }
    /**
     * 접근성 진단 포함 크롤링
     */
    async crawlWithAudit() {
        const auditor = new accessibility_auditor_1.AccessibilityAuditor();
        const browser = await playwright_1.chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
            await this.handleLogin(page);
            await this.parseGnb(page);
            this.log(`접근성 진단 크롤링 시작: ${this.options.baseUrl}`);
            const auditResults = new Map();
            while (this.toVisit.length > 0) {
                const currentUrl = this.toVisit.shift();
                if (this.visited.has(currentUrl))
                    continue;
                try {
                    this.log(`[진단 중] ${currentUrl}`);
                    await page.goto(currentUrl, { timeout: 60000 });
                    await page.waitForLoadState('domcontentloaded');
                    const title = await page.title();
                    // 접근성 진단 실행
                    const violations = await auditor.runAudit(page);
                    const parsed = new url_1.URL(currentUrl);
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
                }
                catch (e) {
                    this.log(`진단 실패 (${currentUrl}): ${e}`);
                }
            }
            await browser.close();
            this.log("접근성 진단 완료!");
            return Array.from(auditResults.values());
        }
        catch (e) {
            await browser.close();
            this.log(`치명적 오류 발생: ${e}`);
            return [];
        }
    }
    /**
     * 로그인 처리 (공통)
     */
    async handleLogin(page) {
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
        }
        else {
            try {
                await page.goto(this.options.baseUrl, { timeout: 60000 });
                await page.waitForLoadState('domcontentloaded');
            }
            catch (e) {
                this.log(`초기 페이지 로드 에러: ${e}`);
            }
        }
        this.log("GNB(메뉴) 분석을 시작합니다...");
    }
    /**
     * 결과 포맷팅
     */
    formatResults() {
        const results = [];
        for (const url of this.visited) {
            const title = this.visitedData[url]?.title || '';
            const parsed = new url_1.URL(url);
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
exports.WebCrawler = WebCrawler;
