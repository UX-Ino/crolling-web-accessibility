import * as XLSX from 'xlsx';
import { AuditResult, AuditMetadata } from '../types/audit';
import { formatKWCAGGuideline, getKoreanDescription, getKoreanHelp, getKWCAGGuideline } from './kwcag-mapping';

interface ExcelRow {
  플랫폼: string;
  점검자: string;
  점검일: string;
  번호: number | string;
  지침명: string;
  판정: string;
  오류내용: string;
  해결방안: string;
}

/**
 * Excel 파일 생성기 (듀얼 모드)
 */
export class ExcelGenerator {
  /**
   * IA 형식 Excel 생성 (6컬럼)
   */
  static generateIAExcel(results: { url: string; title: string; depths: string[] }[]): ArrayBuffer {
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
  static generateAccessibilityExcel(
    results: AuditResult[],
    metadata: AuditMetadata
  ): ArrayBuffer {
    const rows: any[] = [];

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
      } else {
        // 위반이 있는 경우, 각 위반마다 행 생성
        page.violations.forEach((violation) => {
          const guideline = getKWCAGGuideline(violation.id);
          // 영향받는 요소들의 HTML 코드 추출
          const affectedElements = violation.nodes.map((node, idx) =>
            `[${idx + 1}] ${node.html}`
          ).join('\n\n');

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
            '번호': guideline.seq || '',  // KWCAG seq 번호 사용
            '지침명': formatKWCAGGuideline(violation.id),
            '판정': '부적합',
            '오류내용': getKoreanDescription(violation.id, violation.description),
            '영향받는 요소 개수': violation.nodes.length,
            '영향받는 요소 코드': affectedElements,
            '해결방안': `${getKoreanHelp(violation.id, violation.help)}\n참고: ${violation.helpUrl}`,
          });
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 6 },  // No
      { wch: 15 }, // 1뎁스
      { wch: 15 }, // 2뎁스
      { wch: 15 }, // 3뎁스
      { wch: 15 }, // 4뎁스
      { wch: 40 }, // 페이지명
      { wch: 60 }, // URL
      { wch: 10 }, // 플랫폼
      { wch: 15 }, // 점검자
      { wch: 12 }, // 점검일
      { wch: 8 },  // 번호
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
  static arrayBufferToBlob(buffer: ArrayBuffer): Blob {
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }
}

/**
 * 접근성 진단 결과에 대한 Excel 리포트 생성 (Node.js Buffer 반환)
 */
export async function generateExcelReport(
  results: AuditResult[],
  metadata: Partial<AuditMetadata>
): Promise<Buffer> {
  const fullMetadata: AuditMetadata = {
    platform: metadata.platform || 'PC',
    auditor: metadata.auditor || '자동진단시스템',
    date: metadata.date || new Date().toISOString().split('T')[0],
  };

  const arrayBuffer = ExcelGenerator.generateAccessibilityExcel(results, fullMetadata);
  return Buffer.from(arrayBuffer);
}

