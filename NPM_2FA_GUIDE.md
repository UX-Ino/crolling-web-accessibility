# npm 2FA 설정 및 퍼블리시 가이드

## 문제 상황

npm publish 시 다음 오류가 발생했습니다:
```
npm error 403 403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

## 해결 방법

npm은 보안을 위해 패키지 퍼블리시 시 2FA(Two-Factor Authentication)를 요구합니다.

### 옵션 1: 2FA 활성화 (권장)

1. **npm 웹사이트에서 2FA 활성화**
   - https://www.npmjs.com/settings/계정명/profile 접속
   - "Two-Factor Authentication" 섹션에서 "Edit Settings" 클릭
   - 인증 방법 선택:
     - **Authenticator App** (권장): Google Authenticator, Authy 등 사용
     - **SMS**: 휴대폰 번호로 인증 코드 수신
   
2. **2FA 적용 범위 선택**
   - **Authorization only**: 로그인 시에만 2FA 요구
   - **Authorization and publishing** (권장): 로그인 및 패키지 퍼블리시 시 2FA 요구

3. **다시 퍼블리시 시도**
   ```bash
   npm publish
   ```
   2FA 코드를 입력하라는 프롬프트가 나타납니다.

### 옵션 2: Automation Token 사용 (CI/CD용)

CI/CD 파이프라인에서 자동 퍼블리시가 필요한 경우:

1. **Automation Token 생성**
   - https://www.npmjs.com/settings/계정명/tokens 접속
   - "Generate New Token" → "Automation" 선택
   - 생성된 토큰 복사

2. **환경 변수 설정**
   ```bash
   export NPM_TOKEN=your_automation_token_here
   ```

3. **`.npmrc` 파일 생성**
   ```
   //registry.npmjs.org/:_authToken=${NPM_TOKEN}
   ```

## 퍼블리시 전 체크리스트

### 1. Dry-Run 테스트

실제 퍼블리시 전에 어떤 파일이 업로드되는지 확인:

```bash
npm pack --dry-run
```

예상 출력:
- 파일 목록이 표시됨
- `.next/` 폴더가 **제외**되어야 함
- 총 파일 크기가 **10MB 이하**여야 함

### 2. 실제 Tarball 생성 및 검증

```bash
npm pack
```

생성된 파일 확인:
```bash
tar -tzf a11y-crawler-1.0.0.tgz | head -20
```

### 3. 로컬 설치 테스트

```bash
npm install -g ./a11y-crawler-1.0.0.tgz
a11y-crawler
```

### 4. 실제 퍼블리시

```bash
npm publish
```

2FA 코드 입력 후 완료!

## 퍼블리시 후 검증

### npx로 실행 테스트

```bash
# 전역 설치 제거
npm uninstall -g a11y-crawler

# npx로 실행 (npm 레지스트리에서 다운로드)
npx a11y-crawler
```

## 문제 해결

### 패키지가 너무 큰 경우

`.npmignore`에 다음 항목이 있는지 확인:
```
.next/
out/
node_modules/
```

### 파일이 누락된 경우

`package.json`의 `files` 필드를 제거하고 `.npmignore`로만 관리:
```json
{
  "files": [...]  ← 이 필드 삭제
}
```

### 버전 충돌

버전을 올려야 하는 경우:
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## 추가 참고사항

- npm 퍼블리시는 **되돌릴 수 없습니다**
- 퍼블리시 후 24시간 이내에만 `npm unpublish`가 가능
- 같은 버전을 다시 퍼블리시할 수 없음 (버전을 올려야 함)
