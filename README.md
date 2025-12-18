# 🚀 a11y-crawler

웹 접근성 자동 검사 도구 - KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침) 기반

## ✨ 특징

- 🔍 **자동 크롤링**: 웹사이트의 모든 페이지를 자동으로 탐색
- ♿ **접근성 검사**: axe-core를 사용한 KWCAG 2.2 준수 여부 자동 검사
- 📊 **상세 리포트**: Excel 및 HTML 형식의 리포트 생성
- 🎨 **웹 UI**: 브라우저 기반의 직관적인 인터페이스
- 🖥️ **CLI 지원**: 커맨드 라인에서 간편하게 실행

## 📋 요구사항

- **Node.js**: 18.0.0 이상
  ```bash
  # nvm 사용 시
  nvm install 18
  nvm use 18
  ```

## 📦 설치 및 실행

### npx 사용 (권장) ⭐

설치 없이 바로 실행:

```bash
npx a11y-crawler
```

> [!TIP]
> **npx를 사용하면**:
> - 설치 불필요 (최신 버전 자동 다운로드)
> - 디스크 공간 절약
> - 항상 최신 버전 사용

### 글로벌 설치 (권장하지 않음)

```bash
# ⚠️ 글로벌 설치는 일부 환경에서 빌드 오류가 발생할 수 있습니다
npm install -g a11y-crawler
a11y-crawler
```

## 🚀 사용법

### 웹 UI 모드 (기본)

```bash
npx a11y-crawler
```

브라우저가 자동으로 열리고 웹 인터페이스에서 다음 작업을 수행할 수 있습니다:

1. **시작 URL 입력**: 검사할 웹사이트 URL 입력
2. **옵션 설정**:
   - 로그인 필요 여부
   - GNB 셀렉터
   - 접근성 진단 포함 여부
   - 플랫폼 선택 (PC/Mobile)
   - 점검자 이름
3. **실행**: 크롤링 및 접근성 검사 시작
4. **결과 확인**:
   - 실시간 로그 확인
   - 검사 결과 테이블 
   - Excel 다운로드
   - 상세 HTML 리포트 보기

## 📋 주요 기능

### 1. IA(Information Architecture) 크롤링

- GNB(Global Navigation Bar) 기반 자동 페이지 탐색
- 페이지 깊이(depth) 자동 분류
- 페이지 제목 및 URL 수집
- Excel 형식으로 IA 정의서 생성

### 2. 접근성 진단 (KWCAG 2.2)

- **자동 검사**: axe-core 엔진 사용
- **33개 항목**: KWCAG 2.2 전체 체크리스트 매핑
- **심각도 분류**: Critical, Serious, Moderate, Minor
- **영향 받는 요소**: HTML 코드 레벨 상세 정보
- **페이지별 집계**: 위반 개수 자동 집계

### 3. 리포트 생성

#### Excel 리포트
- 페이지별 위반 항목 목록
- WCAG 규칙 및 KWCAG 매핑 정보
- 심각도 및 영향 범위
- 수정 제안 및 참고 링크

#### HTML 리포트
- 📊 차트: 위반 분포 시각화
- 📋 체크리스트: 33개 항목 진행 상황
- 🔍 상세 정보: 각 위반 항목의 페이지 및 요소 정보

## 🛠️ 기술 스택

- **크롤러**: Playwright
- **접근성 엔진**: axe-core
- **프론트엔드**: Next.js, React, TailwindCSS
- **리포트**: xlsx, Chart.js

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 PR은 환영합니다!

## 📞 문의

문제가 발생하면 [이슈](https://github.com/ux-ino/crolling-web-accessibility/issues)를 등록해주세요.
