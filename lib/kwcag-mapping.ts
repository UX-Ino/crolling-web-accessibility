/**
 * KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침) 매핑 + 한국어 번역
 * 33개 검사 항목 기준
 */

export interface KWCAGGuideline {
  seq: number;  // 순번 (1-33)
  code: string; // 예: "1.1.1", "1.3.3"
  name: string;
  isAutomatic: boolean; // 자동검사 가능 여부
  koreanDescription?: string;
  koreanHelp?: string;
}

// Axe-core Rule ID를 KWCAG 2.2 33개 검사 항목으로 변환하는 매핑 테이블
export const KWCAG_MAPPING: Record<string, KWCAGGuideline> = {
  // =======================================================
  // 1. [1번] 1.1.1 적절한 대체 텍스트 제공
  // =======================================================
  'image-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: '이미지에 대체 텍스트(alt 속성)가 없습니다',
    koreanHelp: '모든 이미지 요소에 대체 텍스트를 제공하세요. 장식용 이미지는 alt=""를 사용하세요'
  },
  'input-image-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: '이미지 버튼에 대체 텍스트가 없습니다',
    koreanHelp: 'type="image"인 input 요소에 alt 속성을 추가하세요'
  },
  'area-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: '이미지 맵 영역에 대체 텍스트가 없습니다',
    koreanHelp: 'area 요소에 alt 속성을 추가하세요'
  },
  'object-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: 'object 요소에 대체 텍스트가 없습니다',
    koreanHelp: 'object 요소 내부에 대체 콘텐츠를 제공하세요'
  },
  'svg-img-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: 'SVG 이미지에 대체 텍스트가 없습니다',
    koreanHelp: 'SVG 요소에 title 또는 aria-label을 제공하세요'
  },
  'role-img-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공',
    isAutomatic: true,
    isAutomatic: true,
    koreanDescription: 'role="img"인 요소에 대체 텍스트가 없습니다',
    koreanHelp: 'role="img"인 요소에 aria-label 또는 aria-labelledby를 추가하세요'
  },
  'image-redundant-alt': {
    seq: 1,
    code: '1.1.1',
    name: '적절한 대체 텍스트 제공(중복)',
    isAutomatic: true,
    isAutomatic: true,
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
    isAutomatic: true,
    koreanDescription: '동영상에 자막이 제공되지 않습니다',
    koreanHelp: '멀티미디어 콘텐츠에 자막 또는 대본을 제공하세요'
  },
  'audio-caption': {
    seq: 2,
    code: '1.2.1',
    name: '자막 제공',
    isAutomatic: true,
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
    koreanDescription: '텍스트와 배경의 명도 대비가 4.5:1 미만입니다',
    koreanHelp: '텍스트와 배경의 명도 대비를 4.5:1 이상으로 조정하세요. 큰 텍스트(18pt 이상)는 3:1 이상'
  },

  // =======================================================
  // 6. [6번] 1.3.4 자동 재생 금지
  // =======================================================
  'autoplay-audio': {
    seq: 6,
    code: '1.3.4',
    name: '자동 재생 금지',
    isAutomatic: true,
    koreanDescription: '오디오/비디오가 자동으로 재생됩니다',
    koreanHelp: '3초 이상의 오디오/비디오는 자동 재생을 금지하거나 정지 기능을 제공하세요'
  },

  // =======================================================
  // 8. [8번] 2.1.1 키보드 사용 보장
  // =======================================================
  'scrollable-region-focusable': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    koreanDescription: '스크롤 가능한 영역이 키보드로 접근할 수 없습니다',
    koreanHelp: '스크롤 가능한 영역에 tabindex="0"을 추가하여 키보드 접근을 보장하세요'
  },
  'accesskeys': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    koreanDescription: 'accesskey 속성이 중복되거나 충돌합니다',
    koreanHelp: '각 accesskey는 페이지 내에서 고유해야 하며, 브라우저 단축키와 충돌하지 않아야 합니다'
  },
  'keyboard-navigable': {
    seq: 8,
    code: '2.1.1',
    name: '키보드 사용 보장',
    isAutomatic: true,
    koreanDescription: '모든 기능을 키보드로 사용할 수 없습니다',
    koreanHelp: '마우스로만 가능한 기능을 키보드로도 사용할 수 있도록 구현하세요'
  },

  // =======================================================
  // 14. [14번] 2.4.1 반복 영역 건너뛰기
  // =======================================================
  'bypass': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    koreanDescription: '반복되는 콘텐츠를 건너뛸 수 있는 방법이 없습니다',
    koreanHelp: '페이지 상단에 "본문으로 건너뛰기" 링크를 추가하거나 ARIA 랜드마크를 사용하세요'
  },
  'skip-link': {
    seq: 14,
    code: '2.4.1',
    name: '반복 영역 건너뛰기',
    isAutomatic: true,
    koreanDescription: '건너뛰기 링크가 제대로 작동하지 않습니다',
    koreanHelp: '건너뛰기 링크는 실제 존재하는 앵커로 연결되어야 합니다'
  },

  // =======================================================
  // 15. [15번] 2.4.2 제목 제공
  // =======================================================
  'document-title': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공',
    isAutomatic: true,
    koreanDescription: '페이지에 title 요소가 없거나 비어있습니다',
    koreanHelp: 'head 태그 내에 의미있는 title 요소를 추가하세요'
  },
  'frame-title': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공(프레임)',
    isAutomatic: true,
    koreanDescription: 'iframe에 title 속성이 없습니다',
    koreanHelp: '모든 iframe 요소에 내용을 설명하는 title 속성을 추가하세요'
  },
  'frame-title-unique': {
    seq: 15,
    code: '2.4.2',
    name: '제목 제공(중복 프레임)',
    isAutomatic: true,
    koreanDescription: 'iframe의 title이 중복됩니다',
    koreanHelp: '각 iframe의 title은 고유해야 합니다'
  },

  // =======================================================
  // 16. [16번] 2.4.3 적절한 링크 텍스트
  // =======================================================
  'link-name': {
    seq: 16,
    code: '2.4.3',
    name: '적절한 링크 텍스트',
    isAutomatic: true,
    koreanDescription: '링크에 접근 가능한 이름이 없습니다',
    koreanHelp: '링크에 텍스트 내용이나 aria-label을 추가하세요'
  },
  'empty-table-header': {
    seq: 16,
    code: '2.4.3',
    name: '적절한 링크 텍스트(빈 헤더)',
    isAutomatic: true,
    koreanDescription: '테이블 헤더가 비어있습니다',
    koreanHelp: 'th 요소에 텍스트 내용을 추가하세요'
  },

  // =======================================================
  // 18. [18번] 3.1.1 기본 언어 표시
  // =======================================================
  'html-has-lang': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시',
    isAutomatic: true,
    koreanDescription: 'html 요소에 lang 속성이 없습니다',
    koreanHelp: 'html 태그에 lang="ko" 속성을 추가하세요'
  },
  'html-lang-valid': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시(유효성)',
    isAutomatic: true,
    koreanDescription: 'html 요소의 lang 속성 값이 유효하지 않습니다',
    koreanHelp: '올바른 언어 코드를 사용하세요 (예: ko, en, ja)'
  },
  'html-xml-lang-mismatch': {
    seq: 18,
    code: '3.1.1',
    name: '기본 언어 표시(불일치)',
    isAutomatic: true,
    koreanDescription: 'lang과 xml:lang 속성이 일치하지 않습니다',
    koreanHelp: 'lang과 xml:lang 속성 값을 동일하게 설정하세요'
  },

  // =======================================================
  // 20. [20번] 3.3.1 콘텐츠의 선형화
  // =======================================================
  'list': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(리스트)',
    isAutomatic: true,
    koreanDescription: 'ul, ol 요소가 li 요소만 포함해야 합니다',
    koreanHelp: '리스트 요소는 직접 자식으로 li만 가져야 합니다'
  },
  'listitem': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(리스트 아이템)',
    isAutomatic: true,
    koreanDescription: 'li 요소가 ul, ol 내부에 없습니다',
    koreanHelp: 'li 요소는 ul 또는 ol의 직접 자식이어야 합니다'
  },
  'dlitem': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(정의 리스트)',
    isAutomatic: true,
    koreanDescription: 'dl 요소 구조가 올바르지 않습니다',
    koreanHelp: 'dl은 dt와 dd 요소만 직접 자식으로 가져야 합니다'
  },
  'heading-order': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(헤딩 순서)',
    isAutomatic: true,
    koreanDescription: '제목(heading) 레벨이 순차적이지 않습니다',
    koreanHelp: '제목은 h1부터 시작하여 순차적으로 사용하세요 (h1 → h2 → h3)'
  },
  'empty-heading': {
    seq: 20,
    code: '3.3.1',
    name: '콘텐츠의 선형화(빈 헤딩)',
    isAutomatic: true,
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
    koreanDescription: '데이터 테이블의 제목 셀이 올바르게 연결되지 않았습니다',
    koreanHelp: 'th 요소가 td 요소와 올바르게 연결되도록 scope 또는 headers 속성을 사용하세요'
  },
  'td-headers-attr': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성(Headers 속성)',
    isAutomatic: true,
    koreanDescription: 'headers 속성이 올바르지 않습니다',
    koreanHelp: 'td의 headers 속성이 유효한 th의 id를 참조하도록 수정하세요'
  },
  'table-duplicate-name': {
    seq: 21,
    code: '3.3.2',
    name: '표의 구성(캡션 중복)',
    isAutomatic: true,
    koreanDescription: '테이블 캡션과 요약이 중복됩니다',
    koreanHelp: 'caption과 summary가 동일한 내용을 반복하지 않도록 수정하세요'
  },

  // =======================================================
  // 22. [22번] 3.4.1 레이블 제공
  // =======================================================
  'label': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공',
    isAutomatic: true,
    koreanDescription: '폼 요소에 레이블이 없습니다',
    koreanHelp: '모든 input, select, textarea 요소에 label 또는 aria-label을 제공하세요'
  },
  'select-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(Select)',
    isAutomatic: true,
    koreanDescription: 'select 요소에 접근 가능한 이름이 없습니다',
    koreanHelp: 'select 요소에 label 또는 aria-label을 제공하세요'
  },
  'form-field-multiple-labels': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(중복)',
    isAutomatic: true,
    koreanDescription: '폼 필드에 여러 개의 레이블이 연결되어 있습니다',
    koreanHelp: '각 폼 필드는 하나의 명확한 레이블만 가져야 합니다'
  },
  'button-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(버튼)',
    isAutomatic: true,
    koreanDescription: '버튼에 접근 가능한 이름이 없습니다',
    koreanHelp: '버튼에 텍스트 내용, aria-label, 또는 aria-labelledby를 추가하세요'
  },
  'input-button-name': {
    seq: 22,
    code: '3.4.1',
    name: '레이블 제공(인풋)',
    isAutomatic: true,
    koreanDescription: 'input 버튼에 접근 가능한 이름이 없습니다',
    koreanHelp: 'input[type="button/submit/reset"]에 value 속성을 추가하세요'
  },

  // =======================================================
  // 24. [24번] 4.1.1 마크업 오류 방지
  // =======================================================
  'duplicate-id': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지(ID 중복)',
    isAutomatic: true,
    koreanDescription: '페이지에 중복된 id 값이 있습니다',
    koreanHelp: '모든 id 속성 값은 페이지 내에서 고유해야 합니다'
  },
  'duplicate-id-active': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지',
    isAutomatic: true,
    koreanDescription: '상호작용 가능한 요소에 중복된 id가 있습니다',
    koreanHelp: '포커스 가능한 요소의 id는 반드시 고유해야 합니다'
  },
  'duplicate-id-aria': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지',
    isAutomatic: true,
    koreanDescription: 'ARIA에서 참조하는 id가 중복되었습니다',
    koreanHelp: 'aria-labelledby, aria-describedby 등에서 참조하는 id는 고유해야 합니다'
  },
  'deprecated-active-element': {
    seq: 24,
    code: '4.1.1',
    name: '마크업 오류 방지(Deprecated)',
    isAutomatic: true,
    koreanDescription: '더 이상 사용되지 않는 HTML 요소가 사용되었습니다',
    koreanHelp: '최신 HTML5 표준 요소를 사용하세요'
  },

  // =======================================================
  // 25. [25번] 4.2.1 웹 애플리케이션 접근성 준수
  // =======================================================
  'aria-allowed-attr': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: '해당 role에 허용되지 않는 ARIA 속성이 사용되었습니다',
    koreanHelp: '각 ARIA role에 맞는 속성만 사용하세요'
  },
  'aria-roles': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: '유효하지 않은 ARIA role이 사용되었습니다',
    koreanHelp: '올바른 ARIA role 값을 사용하세요'
  },
  'aria-valid-attr-value': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: 'ARIA 속성의 값이 유효하지 않습니다',
    koreanHelp: 'ARIA 속성에 올바른 형식의 값을 설정하세요'
  },
  'aria-valid-attr': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: '유효하지 않은 ARIA 속성이 사용되었습니다',
    koreanHelp: '올바른 ARIA 속성 이름을 사용하세요'
  },
  'aria-hidden-focus': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: 'aria-hidden 요소 내에 포커스 가능한 요소가 있습니다',
    koreanHelp: 'aria-hidden="true"인 요소 내부에는 포커스 가능한 요소를 배치하지 마세요'
  },
  'aria-input-field-name': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: 'ARIA 입력 필드에 접근 가능한 이름이 없습니다',
    koreanHelp: 'ARIA 입력 필드에 aria-label 또는 aria-labelledby를 추가하세요'
  },
  'presentation-role-conflict': {
    seq: 25,
    code: '4.2.1',
    name: '웹 애플리케이션 접근성 준수',
    isAutomatic: true,
    koreanDescription: 'role="presentation" 또는 role="none"과 충돌하는 속성이 있습니다',
    koreanHelp: 'presentation/none role 사용 시 의미론적 속성을 제거하세요'
  },

  // =======================================================
  // 31. [31번] 6.1.1 입력 목적 식별
  // =======================================================
  'autocomplete-valid': {
    seq: 31,
    code: '6.1.1',
    name: '입력 목적 식별',
    isAutomatic: true,
    koreanDescription: 'autocomplete 속성 값이 유효하지 않습니다',
    koreanHelp: '올바른 autocomplete 속성 값을 사용하세요 (예: name, email, tel)'
  },
};

/**
 * axe-core rule ID를 KWCAG 지침으로 변환
 */
export function getKWCAGGuideline(ruleId: string): KWCAGGuideline {
  return KWCAG_MAPPING[ruleId] || { seq: 0, code: '기타', name: 'WCAG 기준', isAutomatic: true };
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
