"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityAuditor = void 0;
const fs = __importStar(require("fs"));
class AccessibilityAuditor {
    constructor(onLog) {
        this.onLog = onLog;
    }
    log(message) {
        if (this.onLog) {
            this.onLog(message);
        }
        console.log(message);
    }
    /**
     * axe-core 스크립트를 파일 시스템에서 직접 읽어 주입
     */
    async injectAxeCore(page) {
        try {
            // 1. 로컬 node_modules에서 axe-core 소스 읽기
            // Electron 및 Playwright 환경에서 가장 확실한 방법은 소스 코드를 문자열로 읽어서 주입하는 것입니다.
            const axePath = require.resolve('axe-core/axe.min.js');
            const axeSource = fs.readFileSync(axePath, 'utf8');
            await page.addScriptTag({ content: axeSource });
        }
        catch (e) {
            this.log(`Local axe-core read failed, falling back to CDN: ${e}`);
            // 2. 실패 시 CDN 사용
            await page.addScriptTag({
                url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js',
            });
        }
        try {
            // 로드 확인
            await page.waitForFunction(() => typeof window.axe !== 'undefined', null, { timeout: 10000 });
        }
        catch (error) {
            this.log(`Failed to inject axe-core: ${error}`);
            throw error;
        }
    }
    /**
     * 접근성 진단 실행
     */
    async runAudit(page) {
        try {
            // axe-core 주입
            await this.injectAxeCore(page);
            // 진단 실행 (WCAG 2.1 AA)
            // this.log(`Running axe audit on page: ${page.url()}`);
            const results = await page.evaluate(async () => {
                if (!window.axe)
                    throw new Error('Axe not loaded');
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
        }
        catch (error) {
            this.log(`Accessibility audit failed: ${error}`);
            return [];
        }
    }
    /**
     * axe-core 결과를 우리 형식으로 변환
     */
    formatViolations(axeViolations) {
        return axeViolations.map((v) => ({
            id: v.id,
            impact: v.impact || 'minor',
            description: v.description || v.help,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map((node) => ({
                html: node.html,
                failureSummary: node.failureSummary || '',
                target: node.target,
            })),
        }));
    }
    /**
     * 위반 사항이 있는지 확인
     */
    hasViolations(violations) {
        return violations.length > 0;
    }
    /**
     * 총 위반 개수 (모든 노드 포함)
     */
    getTotalViolationCount(violations) {
        return violations.reduce((sum, v) => sum + v.nodes.length, 0);
    }
    /**
     * HTML 문자열 또는 URL에 대한 단일 검사 실행
     */
    async audit(html, url = 'about:blank') {
        const { chromium } = await Promise.resolve().then(() => __importStar(require('playwright')));
        const browser = await chromium.launch();
        const page = await browser.newPage();
        try {
            if (url && url !== 'about:blank') {
                await page.goto(url);
                if (html)
                    await page.setContent(html);
            }
            else {
                await page.setContent(html);
            }
            const results = await this.runAudit(page);
            return results;
        }
        finally {
            await browser.close();
        }
    }
}
exports.AccessibilityAuditor = AccessibilityAuditor;
