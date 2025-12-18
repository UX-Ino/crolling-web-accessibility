"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityAuditor = void 0;
class AccessibilityAuditor {
    /**
     * axe-core 스크립트를 CDN에서 주입
     */
    async injectAxeCore(page) {
        try {
            // CDN에서 axe-core 로드
            await page.addScriptTag({
                url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js',
            });
            // 로드 확인
            await page.waitForFunction(() => typeof window.axe !== 'undefined');
        }
        catch (error) {
            console.error('Failed to inject axe-core:', error);
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
            const results = await page.evaluate(async () => {
                return await window.axe.run({
                    runOnly: {
                        type: 'tag',
                        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
                    },
                    locale: {
                        // 한국어 메시지 일부 오버라이드
                        lang: 'ko',
                    },
                    resultTypes: ['violations'],
                });
            });
            // 결과 포맷팅
            return this.formatViolations(results.violations || []);
        }
        catch (error) {
            console.error('Accessibility audit failed:', error);
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
}
exports.AccessibilityAuditor = AccessibilityAuditor;
