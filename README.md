# 🚀 a11y-crawler

**KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침) 기반 웹 접근성 자동 검사 도구**

[![npm version](https://img.shields.io/npm/v/a11y-crawler.svg)](https://www.npmjs.com/package/a11y-crawler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 특징

- 🔍 **자동 크롤링**: 웹사이트의 모든 페이지를 자동으로 탐색
- ♿ **KWCAG 2.2 기반 검사**: axe-core를 사용한 33개 항목 자동 진단
- 📊 **상세 리포트**: Excel 및 HTML 형식의 리포트 생성
- 🎨 **직관적인 웹 UI**: 브라우저 자동 실행으로 즉시 사용 가능
- 🚀 **간단한 설치**: npm 한 줄로 설치 완료

---

## 📋 요구사항

- **Node.js** 18.0.0 이상

```bash
# 버전 확인
node --version

# nvm 사용 시
nvm install 18
nvm use 18
```

---

## 🚀 빠른 시작

### 설치

작업 폴더를 만들고 패키지를 설치합니다.

```bash
# 1. 폴더 생성 및 이동
mkdir my-accessibility-check
cd my-accessibility-check

# 2. 패키지 설치
npm install a11y-crawler
```

### 실행

```bash
npx a11y-crawler
```

**자동으로:**
1. 로컬 서버 시작 (http://localhost:3000)
2. 크롬 브라우저 자동 실행 🎉
3. 웹 UI에서 크롤링 작업 시작

### 종료

```bash
Ctrl + C
```

---

## 💡 사용 방법

### 1. URL 입력 및 옵션 설정

브라우저가 자동으로 열리면 다음 정보를 입력합니다:

- **시작 URL**: 검사할 웹사이트 주소
- **로그인 필요 여부**: 로그인이 필요한 사이트인 경우 체크
- **GNB 셀렉터**: 메뉴 네비게이션의 CSS 셀렉터
- **접근성 진단 포함**: KWCAG 2.2 자동 검사 실행 여부
- **플랫폼**: PC 또는 Mobile
- **점검자 이름**: 리포트에 표시될 이름

### 2. 크롤링 시작

"크롤링 시작" 버튼을 클릭하면 실시간으로 진행 상황을 확인할 수 있습니다.

### 3. 결과 확인

크롤링이 완료되면:

- 📊 **실시간 로그**: 진행 상황 및 오류 확인
- 📋 **검사 결과 테이블**: 페이지별 위반 항목 목록
- 📥 **Excel 다운로드**: 상세 리포트 다운로드
- 🔍 **HTML 리포트**: 차트와 체크리스트가 포함된 시각적 리포트


## 📋 주요 기능

### 1. 🔍 자동 크롤링 (IA 구조 생성)

- GNB(Global Navigation Bar) 기반 전체 페이지 탐색
- 페이지 깊이(depth) 자동 분류
- 페이지 제목 및 URL 자동 수집
- Excel 형식의 IA 정의서 생성

### 2. ♿ 접근성 자동 진단 (KWCAG 2.2)

- **33개 항목**: KWCAG 2.2 전체 체크리스트 자동 검사
- **심각도 분류**: Critical, Serious, Moderate, Minor
- **상세 정보**: 위반된 HTML 요소 및 코드 레벨 분석
- **페이지별 집계**: 페이지별 위반 개수 자동 통계

### 3. 📊 다양한 리포트 생성

#### Excel 리포트 (`.xlsx`)
- 페이지별 위반 항목 상세 목록
- WCAG 규칙 및 KWCAG 매핑
- 심각도 및 영향 범위
- 수정 제안 및 참고 링크

#### HTML 리포트
- 📈 **차트**: 위반 분포 시각화
- ✅ **체크리스트**: 33개 항목 자동/수동 검사 구분
- 🔍 **상세 정보**: 영향받는 페이지 및 HTML 요소 코드

---

## 🔄 업데이트 및 삭제

### 최신 버전으로 업데이트

```bash
npm update a11y-crawler
```

### 패키지 삭제

```bash
npm uninstall a11y-crawler
```

---

## 🛠️ 기술 스택

- **크롤러**: Playwright
- **접근성 엔진**: axe-core 4.11
- **프론트엔드**: Next.js 16, React 19, TailwindCSS 4
- **리포트**: xlsx, Chart.js

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 PR은 환영합니다!

## 📞 문의

문제가 발생하면 [이슈](https://github.com/ux-ino/crolling-web-accessibility/issues)를 등록해주세요.
