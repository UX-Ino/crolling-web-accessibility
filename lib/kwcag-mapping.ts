/**
 * KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침) 매핑 + 한국어 번역
 * 확장된 검사 항목: 33개 기본 + Best Practice 및 추가 WCAG 룰
 */

export type ImpactLevel = 'critical' | 'serious' | 'moderate' | 'minor';

export interface KWCAGGuideline {
  seq: number;  // 순번 (1-33, 0은 기타/Best Practice)
  code: string; // 예: "1.1.1", "1.3.3"
  name: string;
  isAutomatic: boolean; // 자동검사 가능 여부 (true: 완전 자동, false: 수동 또는 부분 자동)
  impact: ImpactLevel; // 심각도 (critical: 심각, serious: 중요, moderate: 보통, minor: 경미)
  certificationRequired: boolean; // 웹 접근성 인증 마크 획득을 위한 필수 항목 여부
  principle?: string; // KWCAG 원칙명 (예: "인식의 용이성", "운용의 용이성")
  koreanDescription?: string;
  koreanHelp?: string;
}

// Axe-core Rule ID를 KWCAG 2.2 검사 항목으로 변환하는 매핑 테이블
export const KWCAG_MAPPING: Record<string, KWCAGGuideline> = {
  // =======================================================
  // 1. [1번] 1.1.1 적절한 대체 텍스트 제공
  // =======================================================
  'image-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '이미지에 대체 텍스트(alt 속성)가 없습니다',
    koreanHelp: '모든 이미지 요소에 대체 텍스트를 제공하세요. 장식용 이미지는 alt=""를 사용하세요'
  },
  'input-image-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '이미지 버튼에 대체 텍스트가 없습니다',
    koreanHelp: 'type="image"인 input 요소에 alt 속성을 추가하세요'
  },
  'area-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '이미지 맵 영역에 대체 텍스트가 없습니다',
    koreanHelp: 'area 요소에 alt 속성을 추가하세요'
  },
  'object-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: 'object 요소에 대체 텍스트가 없습니다',
    koreanHelp: 'object 요소 내부에 대체 콘텐츠를 제공하세요'
  },
  'svg-img-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: 'SVG 이미지에 대체 텍스트가 없습니다',
    koreanHelp: 'SVG 요소에 title 또는 aria-label을 제공하세요'
  },
  'role-img-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: 'role="img"인 요소에 대체 텍스트가 없습니다',
    koreanHelp: 'role="img"인 요소에 aria-label 또는 aria-labelledby를 추가하세요'
  },
  'image-redundant-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공(중복)',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '인식의 용이성',
    koreanDescription: '이미지 대체 텍스트가 중복됩니다',
    koreanHelp: '이미지의 alt 텍스트가 주변 텍스트와 중복되지 않도록 수정하세요'
  },

  // =======================================================
  // 2. [2번] 1.2.1 자막 제공
  // =======================================================
  'video-caption': {
    seq: 2,
    code: '1.2.1',
    name: '자막 제공',
    isAutomatic: false, // 자막 내용의 정확성은 수동 검사 필요
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '동영상에 자막이 제공되지 않습니다',
    koreanHelp: '멀티미디어 콘텐츠에 자막 또는 대본을 제공하세요'
  },
  'audio-caption': {
    seq: 2,
    code: '1.2.1',
    name: '자막 제공',
    isAutomatic: false,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '오디오에 대본이 제공되지 않습니다',
    koreanHelp: '오디오 콘텐츠에 대본을 제공하세요'
  },

  // =======================================================
  // 3. [3번] 1.3.1 색에 무관한 콘텐츠 인식
  // =======================================================
  'link-in-text-block': {
    seq: 3,
    code: '1.3.1',
    name: '색에 무관한 콘텐츠 인식',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '텍스트 블록 내 링크가 주변 텍스트와 구분되지 않습니다',
    koreanHelp: '링크는 색상만이 아닌 밑줄 등 다른 시각적 요소로도 구분되어야 합니다'
  },

  // =======================================================
  // 5. [5번] 1.3.3 텍스트 콘텐츠의 명도 대비
  // =======================================================
  'color-contrast': {
    seq: 5,
    code: '1.3.3',
    name: '텍스트 콘텐츠의 명도 대비',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '텍스트와 배경의 명도 대비가 4.5:1 미만입니다',
    koreanHelp: '텍스트와 배경의 명도 대비를 4.5:1 이상으로 조정하세요. 큰 텍스트(18pt 이상)는 3:1 이상'
  },
  'color-contrast-enhanced': {
    seq: 5,
    code: '1.3.3',
    name: '텍스트 콘텐츠의 명도 대비(향상)',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '인식의 용이성',
    koreanDescription: '텍스트와 배경의 명도 대비가 7:1 미만입니다 (AAA 기준)',
    koreanHelp: '더 나은 접근성을 위해 텍스트와 배경의 명도 대비를 7:1 이상으로 조정하세요'
  },

  // =======================================================
  // 6. [6번] 1.3.4 자동 재생 금지
  // =======================================================
  'no-autoplay-audio': {
    seq: 6,
    code: '1.3.4',
    name: '자동 재생 금지',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '인식의 용이성',
    koreanDescription: '오디오/비디오가 자동으로 재생되며 제어 방법이 없습니다',
    koreanHelp: '3초 이상의 오디오/비디오는 자동 재생을 금지하거나 정지 기능을 제공하세요'
  },
  'meta-refresh': {
    seq: 6,
    code: '1.3.4',
    name: '자동 재생 금지(페이지 새로고침)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'meta refresh로 페이지가 자동으로 새로고침됩니다',
    koreanHelp: 'meta refresh를 사용하지 말고, 사용자가 직접 새로고침할 수 있도록 하세요'
  },

  // =======================================================
  // 8. [8번] 2.1.1 키보드 사용 보장
  // =======================================================
  'scrollable-region-focusable': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '스크롤 가능한 영역이 키보드로 접근할 수 없습니다',
    koreanHelp: '스크롤 가능한 영역에 tabindex="0"을 추가하여 키보드 접근을 보장하세요'
  },
  'accesskeys': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'accesskey 속성이 중복되거나 충돌합니다',
    koreanHelp: '각 accesskey는 페이지 내에서 고유해야 하며, 브라우저 단축키와 충돌하지 않아야 합니다'
  },
  'tabindex': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'tabindex가 0보다 큽니다',
    koreanHelp: '양수 tabindex는 예상치 못한 탭 순서를 만듭니다. tabindex="0" 또는 음수를 사용하세요'
  },
  'nested-interactive': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '인터랙티브 요소가 중첩되어 있습니다',
    koreanHelp: '인터랙티브 요소는 다른 인터랙티브 요소 안에 있으면 안 됩니다'
  },

  // =======================================================
  // 14. [14번] 2.4.1 반복 영역 건너뛰기
  // =======================================================
  'bypass': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '반복되는 콘텐츠를 건너뛸 수 있는 방법이 없습니다',
    koreanHelp: '페이지 상단에 "본문으로 건너뛰기" 링크를 추가하거나 ARIA 랜드마크를 사용하세요'
  },
  'skip-link': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '건너뛰기 링크가 제대로 작동하지 않습니다',
    koreanHelp: '건너뛰기 링크는 실제 존재하는 앵커로 연결되어야 합니다'
  },
  'landmark-one-main': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '페이지에 main 랜드마크가 없습니다',
    koreanHelp: '페이지에는 하나의 main 랜드마크가 있어야 합니다'
  },
  'landmark-unique': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '랜드마크가 고유하지 않습니다',
    koreanHelp: '동일한 역할의 랜드마크는 고유한 레이블이 있어야 합니다'
  },
  'region': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '콘텐츠가 랜드마크에 포함되지 않았습니다',
    koreanHelp: '모든 콘텐츠는 랜드마크 영역에 포함되어야 합니다'
  },

  // =======================================================
  // 15. [15번] 2.4.2 제목 제공
  // =======================================================
  'document-title': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '페이지에 title 요소가 없거나 비어있습니다',
    koreanHelp: 'head 태그 내에 의미있는 title 요소를 추가하세요'
  },
  'frame-title': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공(프레임)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'iframe에 title 속성이 없습니다',
    koreanHelp: '모든 iframe 요소에 내용을 설명하는 title 속성을 추가하세요'
  },
  'frame-title-unique': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공(중복 프레임)',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'iframe의 title이 중복됩니다',
    koreanHelp: '각 iframe의 title은 고유해야 합니다'
  },
  'page-has-heading-one': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '페이지에 h1 제목이 없습니다',
    koreanHelp: '페이지에는 최소 하나의 h1 요소가 있어야 합니다'
  },

  // =======================================================
  // 16. [16번] 2.4.3 적절한 링크 텍스트
  // =======================================================
  'link-name': {
    seq: 16,
    code: '2.4.3',
    name: '적절한 링크 텍스트',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: '링크에 접근 가능한 이름이 없습니다',
    koreanHelp: '링크에 텍스트 내용이나 aria-label을 추가하세요'
  },
  'identical-links-same-purpose': {
    seq: 16,
    code: '2.4.3',
    name: '적절한 링크 텍스트',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '동일한 텍스트의 링크가 다른 목적으로 사용됩니다',
    koreanHelp: '같은 텍스트의 링크는 같은 URL로 연결되어야 합니다'
  },

  // =======================================================
  // 18. [18번] 3.1.1 기본 언어 표시
  // =======================================================
  'html-has-lang': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'html 요소에 lang 속성이 없습니다',
    koreanHelp: 'html 태그에 lang="ko" 속성을 추가하세요'
  },
  'html-lang-valid': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시(유효성)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'html 요소의 lang 속성 값이 유효하지 않습니다',
    koreanHelp: '올바른 언어 코드를 사용하세요 (예: ko, en, ja)'
  },
  'html-xml-lang-mismatch': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시(불일치)',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'lang과 xml:lang 속성이 일치하지 않습니다',
    koreanHelp: 'lang과 xml:lang 속성 값을 동일하게 설정하세요'
  },
  'valid-lang': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'lang 속성값이 유효하지 않습니다',
    koreanHelp: '유효한 BCP 47 언어 코드를 사용하세요'
  },

  // =======================================================
  // 20. [20번] 3.3.1 콘텐츠의 선형화
  // =======================================================
  'list': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(리스트)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'ul, ol 요소가 li 요소만 포함해야 합니다',
    koreanHelp: '리스트 요소는 직접 자식으로 li만 가져야 합니다'
  },
  'listitem': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(리스트 아이템)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'li 요소가 ul, ol 내부에 없습니다',
    koreanHelp: 'li 요소는 ul 또는 ol의 직접 자식이어야 합니다'
  },
  'dlitem': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(정의 리스트)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'dl 요소 구조가 올바르지 않습니다',
    koreanHelp: 'dl은 dt와 dd 요소만 직접 자식으로 가져야 합니다'
  },
  'definition-list': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(정의 리스트)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '정의 목록이 올바르게 구성되지 않았습니다',
    koreanHelp: 'dl은 dt와 dd 그룹만 포함해야 합니다'
  },
  'heading-order': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(헤딩 순서)',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '제목(heading) 레벨이 순차적이지 않습니다',
    koreanHelp: '제목은 h1부터 시작하여 순차적으로 사용하세요 (h1 → h2 → h3)'
  },
  'empty-heading': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(빈 헤딩)',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '제목 요소가 비어있습니다',
    koreanHelp: '제목 요소에 텍스트 내용을 추가하세요'
  },

  // =======================================================
  // 21. [21번] 3.3.2 표의 구성
  // =======================================================
  'th-has-data-cells': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성(TH 셀)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '데이터 테이블의 제목 셀이 올바르게 연결되지 않았습니다',
    koreanHelp: 'th 요소가 td 요소와 올바르게 연결되도록 scope 또는 headers 속성을 사용하세요'
  },
  'td-headers-attr': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성(Headers 속성)',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'headers 속성이 올바르지 않습니다',
    koreanHelp: 'td의 headers 속성이 유효한 th의 id를 참조하도록 수정하세요'
  },
  'table-duplicate-name': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성(캡션 중복)',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '이해의 용이성',
    koreanDescription: '테이블 캡션과 요약이 중복됩니다',
    koreanHelp: 'caption과 summary가 동일한 내용을 반복하지 않도록 수정하세요'
  },
  'td-has-header': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '테이블 데이터 셀에 헤더가 연결되지 않았습니다',
    koreanHelp: '데이터 셀은 헤더와 연결되어야 합니다'
  },
  'scope-attr-valid': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'scope 속성이 올바르게 사용되지 않았습니다',
    koreanHelp: 'scope 속성은 유효한 값(row, col, rowgroup, colgroup)을 가져야 합니다'
  },

  // =======================================================
  // 22. [22번] 3.4.1 레이블 제공
  // =======================================================
  'label': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '폼 요소에 레이블이 없습니다',
    koreanHelp: '모든 input, select, textarea 요소에 label 또는 aria-label을 제공하세요'
  },
  'select-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(Select)',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'select 요소에 접근 가능한 이름이 없습니다',
    koreanHelp: 'select 요소에 label 또는 aria-label을 제공하세요'
  },
  'form-field-multiple-labels': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(중복)',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '이해의 용이성',
    koreanDescription: '폼 필드에 여러 개의 레이블이 연결되어 있습니다',
    koreanHelp: '각 폼 필드는 하나의 명확한 레이블만 가져야 합니다'
  },
  'button-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(버튼)',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '버튼에 접근 가능한 이름이 없습니다',
    koreanHelp: '버튼에 텍스트 내용, aria-label, 또는 aria-labelledby를 추가하세요'
  },
  'input-button-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(인풋)',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: 'input 버튼에 접근 가능한 이름이 없습니다',
    koreanHelp: 'input[type="button/submit/reset"]에 value 속성을 추가하세요'
  },
  'label-title-only': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '이해의 용이성',
    koreanDescription: '폼 요소에 보이는 레이블이 필요합니다',
    koreanHelp: 'title 속성만으로는 충분하지 않습니다. label 요소를 사용하세요'
  },
  'label-content-name-mismatch': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '이해의 용이성',
    koreanDescription: '레이블과 접근 가능한 이름이 일치하지 않습니다',
    koreanHelp: '보이는 레이블 텍스트는 접근 가능한 이름에 포함되어야 합니다'
  },

  // =======================================================
  // 24. [24번] 4.1.1 마크업 오류 방지
  // =======================================================
  'duplicate-id': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지(ID 중복)',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '페이지에 중복된 id 값이 있습니다',
    koreanHelp: '모든 id 속성 값은 페이지 내에서 고유해야 합니다'
  },
  'duplicate-id-active': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '상호작용 가능한 요소에 중복된 id가 있습니다',
    koreanHelp: '포커스 가능한 요소의 id는 반드시 고유해야 합니다'
  },
  'duplicate-id-aria': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'ARIA에서 참조하는 id가 중복되었습니다',
    koreanHelp: 'aria-labelledby, aria-describedby 등에서 참조하는 id는 고유해야 합니다'
  },

  // =======================================================
  // 25. [25번] 4.2.1 웹 애플리케이션 접근성 준수
  // =======================================================
  'aria-allowed-attr': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '해당 role에 허용되지 않는 ARIA 속성이 사용되었습니다',
    koreanHelp: '각 ARIA role에 맞는 속성만 사용하세요'
  },
  'aria-roles': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '유효하지 않은 ARIA role이 사용되었습니다',
    koreanHelp: '올바른 ARIA role 값을 사용하세요'
  },
  'aria-valid-attr-value': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'ARIA 속성의 값이 유효하지 않습니다',
    koreanHelp: 'ARIA 속성에 올바른 형식의 값을 설정하세요'
  },
  'aria-valid-attr': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '유효하지 않은 ARIA 속성이 사용되었습니다',
    koreanHelp: '올바른 ARIA 속성 이름을 사용하세요'
  },
  'aria-hidden-focus': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'aria-hidden 요소 내에 포커스 가능한 요소가 있습니다',
    koreanHelp: 'aria-hidden="true"인 요소 내부에는 포커스 가능한 요소를 배치하지 마세요'
  },
  'aria-input-field-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'ARIA 입력 필드에 접근 가능한 이름이 없습니다',
    koreanHelp: 'ARIA 입력 필드에 aria-label 또는 aria-labelledby를 추가하세요'
  },
  'presentation-role-conflict': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'role="presentation" 또는 role="none"과 충돌하는 속성이 있습니다',
    koreanHelp: 'presentation/none role 사용 시 의미론적 속성을 제거하세요'
  },
  'aria-allowed-role': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'ARIA role이 요소에 적합하지 않습니다',
    koreanHelp: '요소에 적절한 role만 사용해야 합니다'
  },
  'aria-command-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'ARIA 명령에 접근 가능한 이름이 필요합니다',
    koreanHelp: '버튼, 링크, 메뉴 항목에는 이름이 있어야 합니다'
  },
  'aria-dialog-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: '다이얼로그에 접근 가능한 이름이 필요합니다',
    koreanHelp: 'dialog와 alertdialog에는 이름이 있어야 합니다'
  },
  'aria-hidden-body': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'body에 aria-hidden을 사용하면 안 됩니다',
    koreanHelp: 'body 요소에 aria-hidden=true를 사용하면 안 됩니다'
  },
  'aria-meter-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'meter에 접근 가능한 이름이 필요합니다',
    koreanHelp: 'meter 역할 요소에는 이름이 있어야 합니다'
  },
  'aria-progressbar-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'progressbar에 접근 가능한 이름이 필요합니다',
    koreanHelp: 'progressbar 역할 요소에는 이름이 있어야 합니다'
  },
  'aria-required-attr': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '필수 ARIA 속성이 있어야 합니다',
    koreanHelp: '역할에 필요한 ARIA 속성이 있어야 합니다'
  },
  'aria-required-children': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '필수 자식 역할이 있어야 합니다',
    koreanHelp: '특정 역할은 필수 자식 역할을 가져야 합니다'
  },
  'aria-required-parent': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: '필수 부모 역할이 있어야 합니다',
    koreanHelp: '특정 역할은 필수 부모 역할을 가져야 합니다'
  },
  'aria-roledescription': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'aria-roledescription이 적절히 사용되어야 합니다',
    koreanHelp: '의미 있는 역할을 가진 요소에만 사용해야 합니다'
  },
  'aria-toggle-field-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: true,
    principle: '견고성',
    koreanDescription: 'ARIA 토글 필드에 접근 가능한 이름이 필요합니다',
    koreanHelp: '체크박스, 스위치 등에는 이름이 있어야 합니다'
  },
  'aria-tooltip-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'tooltip에 접근 가능한 이름이 필요합니다',
    koreanHelp: 'tooltip 역할 요소에는 텍스트가 있어야 합니다'
  },
  'aria-treeitem-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'treeitem에 접근 가능한 이름이 필요합니다',
    koreanHelp: 'treeitem 역할 요소에는 이름이 있어야 합니다'
  },

  // =======================================================
  // 31. [31번] 6.1.1 입력 목적 식별 (자동완성)
  // =======================================================
  'autocomplete-valid': {
    seq: 31,
    code: '6.1.1',
    name: '입력 목적 식별',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: true,
    principle: '운용의 용이성',
    koreanDescription: 'autocomplete 속성 값이 유효하지 않습니다',
    koreanHelp: '올바른 autocomplete 속성 값을 사용하세요 (예: name, email, tel)'
  },

  // =======================================================
  // Best Practice 및 추가 검사 항목 (seq: 0)
  // =======================================================
  'blink': {
    seq: 0,
    code: 'Best Practice',
    name: '깜빡임 금지',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: 'blink 요소를 사용하면 안 됩니다',
    koreanHelp: '깜빡이는 콘텐츠를 사용하지 마세요'
  },
  'marquee': {
    seq: 0,
    code: 'Best Practice',
    name: '스크롤 금지',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: 'marquee 요소를 사용하면 안 됩니다',
    koreanHelp: '자동으로 스크롤되는 콘텐츠를 사용하지 마세요'
  },
  'meta-viewport': {
    seq: 0,
    code: 'Best Practice',
    name: '확대/축소 허용',
    isAutomatic: true,
    impact: 'critical',
    certificationRequired: false,
    principle: '인식의 용이성',
    koreanDescription: '확대/축소가 비활성화되어 있습니다',
    koreanHelp: '사용자가 확대/축소할 수 있어야 합니다. user-scalable=no를 제거하세요'
  },
  'server-side-image-map': {
    seq: 0,
    code: 'Best Practice',
    name: '클라이언트측 이미지맵 사용',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '서버 측 이미지 맵을 사용하면 안 됩니다',
    koreanHelp: '클라이언트 측 이미지 맵(<map>)을 사용하세요'
  },
  'target-size': {
    seq: 0,
    code: 'Best Practice',
    name: '터치 대상 크기',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '터치 대상 크기가 충분하지 않습니다',
    koreanHelp: '터치 대상은 최소 24x24px 이상이어야 합니다'
  },
  'focusable-disabled': {
    seq: 0,
    code: 'Best Practice',
    name: '비활성화 요소 포커스 금지',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '비활성화된 요소는 포커스되면 안 됩니다',
    koreanHelp: 'disabled 속성이 있는 요소는 포커스 불가능해야 합니다'
  },
  'focusable-no-name': {
    seq: 0,
    code: 'Best Practice',
    name: '포커스 가능 요소 이름',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: '포커스 가능한 요소에 이름이 필요합니다',
    koreanHelp: '포커스 가능한 요소에는 접근 가능한 이름이 있어야 합니다'
  },
  'focus-order-semantics': {
    seq: 0,
    code: 'Best Practice',
    name: '논리적 포커스 순서',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: '포커스 순서가 논리적이지 않습니다',
    koreanHelp: '인터랙티브 요소는 논리적 순서로 포커스되어야 합니다'
  },
  'frame-focusable-content': {
    seq: 0,
    code: 'Best Practice',
    name: '프레임 포커스 가능 콘텐츠',
    isAutomatic: true,
    impact: 'serious',
    certificationRequired: false,
    principle: '운용의 용이성',
    koreanDescription: 'tabindex=-1인 iframe에 포커스 가능한 콘텐츠가 있습니다',
    koreanHelp: 'iframe의 tabindex를 제거하거나 내부 포커스 가능 요소를 제거하세요'
  },
  'frame-tested': {
    seq: 0,
    code: 'Best Practice',
    name: '프레임 테스트',
    isAutomatic: false,
    impact: 'moderate',
    certificationRequired: false,
    principle: '견고성',
    koreanDescription: 'iframe 내용이 테스트되지 않았습니다',
    koreanHelp: 'iframe 내용도 접근성 테스트가 필요합니다'
  },
  'empty-table-header': {
    seq: 0,
    code: 'Best Practice',
    name: '빈 테이블 헤더',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '이해의 용이성',
    koreanDescription: '테이블 헤더가 비어있습니다',
    koreanHelp: 'th 요소에 텍스트 내용을 추가하세요'
  },
  'table-fake-caption': {
    seq: 0,
    code: 'Best Practice',
    name: '테이블 캡션 구현',
    isAutomatic: true,
    impact: 'minor',
    certificationRequired: false,
    principle: '이해의 용이성',
    koreanDescription: '테이블 캡션이 올바르게 구현되지 않았습니다',
    koreanHelp: '<caption> 요소를 사용하세요'
  },
};

/**
 * axe-core rule ID를 KWCAG 지침으로 변환
 */
export function getKWCAGGuideline(ruleId: string): KWCAGGuideline {
  return KWCAG_MAPPING[ruleId] || {
    seq: 0,
    code: '기타',
    name: 'WCAG 기준',
    isAutomatic: true,
    impact: 'moderate',
    certificationRequired: false
  };
}

/**
 * KWCAG 지침명 포맷 ([코드] 이름)
 */
export function formatKWCAGGuideline(ruleId: string): string {
  const guideline = getKWCAGGuideline(ruleId);
  if (guideline.code === '기타') {
    return `기타(WCAG): ${ruleId}`;
  }
  return `[${guideline.code}] ${guideline.name}`;
}

/**
 * 한국어 설명 가져오기
 */
export function getKoreanDescription(ruleId: string, defaultDescription: string): string {
  const guideline = KWCAG_MAPPING[ruleId];
  return guideline?.koreanDescription || defaultDescription;
}

/**
 * 한국어 해결방안 가져오기
 */
export function getKoreanHelp(ruleId: string, defaultHelp: string): string {
  const guideline = KWCAG_MAPPING[ruleId];
  return guideline?.koreanHelp || defaultHelp;
}

/**
 * 심각도 정보 가져오기
 */
export function getImpactInfo(impact: ImpactLevel) {
  const impactInfo = {
    critical: {
      name: '치명적',
      description: '웹 접근성 인증 마크 획득을 위해 반드시 수정해야 하는 항목입니다.',
      action: '즉시 수정 필요'
    },
    serious: {
      name: '심각',
      description: '웹 접근성 인증 마크 획득을 위해 수정해야 하는 항목입니다.',
      action: '우선 수정 권장'
    },
    moderate: {
      name: '보통',
      description: '웹 접근성 품질 향상을 위해 수정을 권장하는 항목입니다.',
      action: '수정 권장'
    },
    minor: {
      name: '경미',
      description: '모범 사례(Best Practice)에 해당하는 항목입니다.',
      action: '선택적 수정'
    }
  };

  return impactInfo[impact];
}

/**
 * 인증 필수 항목만 필터링
 */
export function getCertificationRequiredRules(): string[] {
  return Object.entries(KWCAG_MAPPING)
    .filter(([_, guideline]) => guideline.certificationRequired)
    .map(([ruleId]) => ruleId);
}

/**
 * 자동 검사 가능 항목만 필터링
 */
export function getAutomaticRules(): string[] {
  return Object.entries(KWCAG_MAPPING)
    .filter(([_, guideline]) => guideline.isAutomatic)
    .map(([ruleId]) => ruleId);
}

/**
 * 수동 검사 필요 항목만 필터링
 */
export function getManualRules(): string[] {
  return Object.entries(KWCAG_MAPPING)
    .filter(([_, guideline]) => !guideline.isAutomatic)
    .map(([ruleId]) => ruleId);
}

/**
 * axe-core의 영문 failureSummary를 한국어로 번역
 */
export function translateFailureSummary(summary: string): string {
  if (!summary) return '';

  let translated = summary;

  // 1. 공통 문구 및 단순 매핑 (Literal Translation)
  const translationMap: Record<string, string> = {
    'Fix any of the following:': '다음 중 하나를 수정하세요:',
    'Fix all of the following:': '다음을 모두 수정하세요:',
    'Element does not have inner text that is visible to screen readers': '요소에 스크린 리더가 인식할 수 있는 텍스트가 없습니다',
    'aria-label attribute does not exist or is empty': 'aria-label 속성이 없거나 비어 있습니다',
    'aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty': 'aria-labelledby 속성이 없거나, 존재하지 않는 요소를 참조하거나, 참조된 요소가 비어 있습니다',
    'Element has no title attribute': '요소에 title 속성이 없습니다',
    'Element does not have an implicit \\(wrapped\\) <label>': '요소가 암시적(감싸는 형태) <label>을 가지고 있지 않습니다',
    'Element does not have an explicit <label>': '요소가 명시적 <label>을 가지고 있지 않습니다',
    "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"": '요소의 기본 의미가 role="none" 또는 role="presentation"으로 재정의되지 않았습니다',
    'The <html> element does not have a lang attribute': '<html> 요소에 lang 속성이 없습니다',
    'The <html> element has an invalid value for its lang attribute': '<html> 요소의 lang 속성 값이 유효하지 않습니다',
    "The <html> element's lang and xml:lang attributes do not have the same base language": '<html> 요소의 lang 속성과 xml:lang 속성의 기본 언어가 일치하지 않습니다',
    'Unique id attribute value is not unique': 'id 속성 값이 고유하지 않습니다',
    'Element has insufficient color contrast of': '요소의 색상 대비가 불충분합니다:',
    'expected': '기대치',
    'actual': '실제',
    'Element is not in the tab order and does not have aria-live': '요소가 탭 순서에 없으며 aria-live 속성이 정의되지 않았습니다',
    'Interactive controls must not be nested': '상호작용 가능한 컨트롤은 중첩될 수 없습니다',
    'The focusable element has a negative tabindex': '포커스 가능한 요소의 tabindex가 음수입니다',
    'Duplicate id attribute value on active element': '활성 요소에 중복된 id 속성 값이 있습니다',
    'The element has an unsupported or invalid ARIA role': '요소에 지원되지 않거나 유효하지 않은 ARIA role이 있습니다',
    'ARIA attribute is not allowed:': '허용되지 않는 ARIA 속성입니다:',
    'ARIA attribute value is invalid:': 'ARIA 속성 값이 유효하지 않습니다:',
    'Element does not have a required ARIA attribute:': '필수 ARIA 속성이 없습니다:',
    'The ARIA role is not allowed for this element': '이 요소에 허용되지 않는 ARIA role입니다',
    'The element has no accessible name': '요소에 접근 가능한 이름이 없습니다',
    'Document has more than one main landmark': '문서에 메인(main) 랜드마크가 두 개 이상입니다',
    'Page must have a main landmark': '페이지에는 하나의 메인(main) 랜드마크가 있어야 합니다',
    'All page content must be contained by landmarks': '모든 페이지 콘텐츠는 랜드마크에 포함되어야 합니다',
    'The header must not be contained inside another landmark': 'header는 다른 랜드마크 내부에 포함되면 안 됩니다',
    'The footer must not be contained inside another landmark': 'footer는 다른 랜드마크 내부에 포함되면 안 됩니다',
    'The link has no styling \\(such as underline\\) to distinguish it from the surrounding text': '링크에 주변 텍스트와 구분할 수 있는 스타일(예: 밑줄)이 없습니다',
    'Element is in tab order and does not have accessible text': '요소가 탭 순서에 포함되어 있으나 접근 가능한 텍스트가 없습니다',
    'Element does not have text that is visible to screen readers': '요소에 스크린 리더가 인식할 수 있는 텍스트가 없습니다',
    'ARIA content at this position is not allowed': '이 위치의 ARIA 콘텐츠는 허용되지 않습니다'
  };

  // 2. 동적 문구 번역 (Regex Translation)
  const regexMap: [RegExp, string][] = [
    // 리스트 구조 관련
    [
      /List element has direct children that are not allowed: (.*)/gi,
      '리스트 요소에 허용되지 않는 직계 자식이 포함되어 있습니다: $1'
    ],
    [
      /List elements must only contain: (.*)/gi,
      '리스트 요소는 다음만 포함해야 합니다: $1'
    ],
    [
      /(li|dt|dd) elements must be contained by (.*)/gi,
      '$1 요소는 $2 요소 내부에 포함되어야 합니다'
    ],
    // 테이블 구조 관련
    [
      /Table element has direct children that are not allowed: (.*)/gi,
      '테이블 요소에 허용되지 않는 직계 자식이 포함되어 있습니다: $1'
    ],
    [
      /(th|td|caption|thead|tbody|tfoot) elements must be contained by (.*)/gi,
      '$1 요소는 $2 요소 내부에 포함되어야 합니다'
    ],
    [
      /Table cells must only contain: (.*)/gi,
      '테이블 셀은 다음만 포함해야 합니다: $1'
    ],
    // 링크 및 폼 관련
    [
      /The link has insufficient color contrast of (.*) with the surrounding text\. \(Minimum contrast is (.*), link text: (.*), surrounding text: (.*)\)/gi,
      '링크와 주변 텍스트의 색상 대비가 $1로 불충분합니다. (최소 대비 $2, 링크 텍스트: $3, 주변 텍스트: $4)'
    ],
    [
      /Element has insufficient color contrast of (.*) \(foreground color: (.*), background color: (.*), font size: (.*), font weight: (.*)\)\. Expected contrast ratio of (.*)/gi,
      '요소의 색상 대비가 $1로 불충분합니다. (글자색: $2, 배경색: $3, 글자 크기: $4, 글자 굵기: $5). 기대 대비: $6'
    ],
    // ARIA 관련
    [
      /ARIA (attribute|role) (.*) is not allowed (.*)/gi,
      'ARIA $1 $2은(는) $3에서 허용되지 않습니다'
    ],
    [
      /ARIA attribute (.*) value is invalid: (.*)/gi,
      'ARIA 속성 $1의 값이 유효하지 않습니다: $2'
    ],
    [
      /ARIA attribute (.*) is not allowed on (.*)/gi,
      'ARIA 속성 $1은(는) $2 요소에서 사용할 수 없습니다'
    ],
    // 기타 구조적 문제
    [
      /The (.*) element does not have a (.*) attribute/gi,
      '$1 요소에 $2 속성이 없습니다'
    ],
    [
      /The (.*) element has an invalid value for its (.*) attribute/gi,
      '$1 요소의 $2 속성 값이 유효하지 않습니다'
    ]
  ];

  // 순차적으로 치환
  for (const [english, korean] of Object.entries(translationMap)) {
    const regex = new RegExp(english, 'gi');
    translated = translated.replace(regex, korean);
  }

  for (const [regex, replacement] of regexMap) {
    translated = translated.replace(regex, replacement);
  }

  return translated;
}
