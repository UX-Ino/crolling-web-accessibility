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
exports.ExcelGenerator = void 0;
const XLSX = __importStar(require("xlsx"));
const kwcag_mapping_1 = require("./kwcag-mapping");
/**
 * Excel 파일 생성기 (듀얼 모드)
 */
class ExcelGenerator {
    /**
     * IA 형식 Excel 생성 (6컬럼)
     */
    static generateIAExcel(results) {
        const data = results.map((r) => ({
            '1뎁스': r.depths[0],
            '2뎁스': r.depths[1],
            '3뎁스': r.depths[2],
            '4뎁스': r.depths[3],
            '페이지명': r.title,
            'URL': r.url,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 60 },
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'IA Definition');
        return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    }
    /**
     * 접근성 진단 형식 Excel 생성 (15컬럼) - 한국어 번역 적용, seq 번호 사용
     */
    static generateAccessibilityExcel(results, metadata) {
        const rows = [];
        // 모든 페이지와 위반 사항을 펼쳐서 행으로 만들기
        results.forEach((page, pageIndex) => {
            if (page.violations.length === 0) {
                // 위반이 없는 페이지도 한 줄로 표시
                rows.push({
                    'No': pageIndex + 1,
                    '1뎁스': page.depths[0] || '',
                    '2뎁스': page.depths[1] || '',
                    '3뎁스': page.depths[2] || '',
                    '4뎁스': page.depths[3] || '',
                    '페이지명': page.title,
                    'URL': page.url,
                    '플랫폼': metadata.platform,
                    '점검자': metadata.auditor,
                    '점검일': metadata.date,
                    '번호': '',
                    '지침명': '',
                    '판정': '적합',
                    '오류내용': '',
                    '영향받는 요소 개수': '',
                    '영향받는 요소 코드': '',
                    '해결방안': '',
                });
            }
            else {
                // 위반이 있는 경우, 각 위반마다 행 생성
                page.violations.forEach((violation) => {
                    const guideline = (0, kwcag_mapping_1.getKWCAGGuideline)(violation.id);
                    // 영향받는 요소들의 HTML 코드 추출
                    const affectedElements = violation.nodes.map((node, idx) => `[${idx + 1}] ${node.html}`).join('\n\n');
                    rows.push({
                        'No': pageIndex + 1,
                        '1뎁스': page.depths[0] || '',
                        '2뎁스': page.depths[1] || '',
                        '3뎁스': page.depths[2] || '',
                        '4뎁스': page.depths[3] || '',
                        '페이지명': page.title,
                        'URL': page.url,
                        '플랫폼': metadata.platform,
                        '점검자': metadata.auditor,
                        '점검일': metadata.date,
                        '번호': guideline.seq || '', // KWCAG seq 번호 사용
                        '지침명': (0, kwcag_mapping_1.formatKWCAGGuideline)(violation.id),
                        '판정': '부적합',
                        '오류내용': (0, kwcag_mapping_1.getKoreanDescription)(violation.id, violation.description),
                        '영향받는 요소 개수': violation.nodes.length,
                        '영향받는 요소 코드': affectedElements,
                        '해결방안': `${(0, kwcag_mapping_1.getKoreanHelp)(violation.id, violation.help)}\n참고: ${violation.helpUrl}`,
                    });
                });
            }
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [
            { wch: 6 }, // No
            { wch: 15 }, // 1뎁스
            { wch: 15 }, // 2뎁스
            { wch: 15 }, // 3뎁스
            { wch: 15 }, // 4뎁스
            { wch: 40 }, // 페이지명
            { wch: 60 }, // URL
            { wch: 10 }, // 플랫폼
            { wch: 15 }, // 점검자
            { wch: 12 }, // 점검일
            { wch: 8 }, // 번호
            { wch: 35 }, // 지침명
            { wch: 10 }, // 판정
            { wch: 50 }, // 오류내용
            { wch: 12 }, // 영향받는 요소 개수
            { wch: 80 }, // 영향받는 요소 코드 (NEW)
            { wch: 70 }, // 해결방안
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '접근성 진단 결과');
        return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    }
    /**
     * ArrayBuffer를 Blob으로 변환 (클라이언트 다운로드용)
     */
    static arrayBufferToBlob(buffer) {
        return new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    }
}
exports.ExcelGenerator = ExcelGenerator;
