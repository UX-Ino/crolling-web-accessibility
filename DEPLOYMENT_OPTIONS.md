# 웹 접근성 크롤러 배포 방법

## 🎯 목표별 추천 방법

### 1. **가장 빠른 공유: Vercel/Netlify 웹앱** ⭐ 추천
**적합한 경우:** 팀 내부 공유, 바로 사용 가능해야 할 때

**아키텍처:**
```
[사용자 브라우저] → [Next.js 프론트엔드 (Vercel)]
                      ↓
                   [백엔드 API (별도 서버)]
                      ↓
                   [Playwright + 크롤러]
```

**장점:**
- 설치 불필요, URL만 공유
- 자동 HTTPS, CDN
- 무료 (Vercel Hobby Plan)

**단점:**
- Playwright는 별도 서버 필요 (Vercel은 Serverless Functions에서 Playwright 제한적)

**구현:**
1. 프론트엔드: Vercel에 배포
2. 백엔드: Railway, Render, DigitalOcean 등에 API 서버 배포

---

### 2. **완전 무료 솔루션: Docker + Railway**
**적합한 경우:** 비용 최소화, 완전한 기능

**필요한 파일:**

#### `Dockerfile`
```dockerfile
FROM node:20-bullseye

# Playwright 의존성 설치
RUN apt-get update && apt-get install -y \\
    chromium \\
    chromium-driver \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# Next.js 빌드
RUN npm run build

# Playwright 브라우저 설치
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin

EXPOSE 3000

CMD ["npm", "start"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./reports:/app/reports
```

**배포:**
```bash
# Railway CLI 설치
npm install -g @railway/cli

# Railway 배포
railway login
railway init
railway up
```

**장점:**
- 완전 무료 ($5/월 크레딧 제공)
- Docker로 환경 일관성
- 자동 배포

---

### 3. **Chrome Extension으로 변환**
**적합한 경우:** 개인 사용자들이 자주 쓸 때

**구조:**
```
chrome-extension/
├── manifest.json
├── popup.html
├── content.js (axe-core 직접 실행)
└── background.js
```

**장점:**
- Chrome Web Store에 배포하면 설치 쉬움
- 서버 불필요 (axe-core만 사용 시)

**단점:**
- 전체 사이트 크롤링은 제한적

---

### 4. **CLI 도구로 배포 (npm 패키지)**
**적합한 경우:** 개발자/전문가용

**설정:**

#### `package.json`
```json
{
  "name": "a11y-crawler-cli",
  "version": "1.0.0",
  "bin": {
    "a11y-crawl": "./bin/cli.js"
  },
  "files": [
    "bin/",
    "lib/",
    "dist-electron/"
  ]
}
```

#### `bin/cli.js`
```javascript
#!/usr/bin/env node
const { run } = require('../dist-electron/lib/crawler');

// CLI 실행 로직
```

**배포:**
```bash
npm publish
```

**사용:**
```bash
# 설치
npm install -g a11y-crawler-cli

# 실행
a11y-crawl https://example.com
```

---

## 🚀 실전 추천 시나리오

### A안: **팀 내부 + 비기술자 사용** → Vercel + Railway
1. Railway에 API 서버 배포 (크롤링 담당)
2. Vercel에 Next.js 배포 (UI)
3. URL 공유

### B안: **오픈소스 공개** → GitHub + Docker
1. GitHub에 코드 공개
2. README에 Docker 실행 방법 작성
3. Docker Hub에 이미지 배포

### C안: **개발자용 도구** → npm 패키지
1. CLI 버전 제작
2. npm에 퍼블리시
3. `npx a11y-crawler <url>` 형태로 실행

---

## 💰 비용 비교

| 방법 | 월 비용 | 제한사항 |
|------|--------|---------|
| Vercel (프론트) | 무료 | 100GB 대역폭 |
| Railway (백엔드) | 무료 | $5 크레딧 (500시간) |
| Render | 무료 | 자동 슬립 |
| DigitalOcean | $4 | 제한 없음 |
| Chrome Extension | 무료 | 서버 없음 |
| npm 패키지 | 무료 | 로컬 실행 |

---

## 📝 다음 단계

**지금 바로 시작하려면:**

```bash
# 1. Vercel 배포 (1분)
npm install -g vercel
vercel

# 2. Railway 백엔드 (5분)
npm install -g @railway/cli
railway login
railway init
railway up
```

**필요한 파일 생성할까요?**
1. Docker 설정 파일
2. Vercel 배포 설정
3. API 서버 코드 분리
4. CLI 버전

어떤 방법이 가장 적합해 보이시나요?
