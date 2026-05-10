# 전자책 자동발송 쇼핑몰 구축 가이드

카페24 주문 → API Gateway → Lambda → Gmail 자동 전송 전체 흐름

---

## 아키텍처

```
[구매자 결제]
     ↓
[카페24 Webhook POST]
     ↓
[AWS API Gateway]  https://<id>.execute-api.ap-northeast-2.amazonaws.com/webhook
     ↓
[AWS Lambda]  ebook-delivery
  ├─ 서명 검증 (CAFE24_SECRET)
  ├─ 상품코드 → PDF 파일명 매핑 (PRODUCT_PDF_MAP)
  ├─ GitHub Private 레포에서 PDF 다운로드
  └─ Gmail SMTP로 구매자에게 이메일 첨부 발송
```

---

## STEP 1 · 카페24 쇼핑몰 + 전자책 상품 등록

1. [카페24](https://www.cafe24.com) 로그인 → 무료 쇼핑몰 개설 (`bsmshop.cafe24.com`)
2. **상품 등록** > 상품유형: 무형/디지털 > 배송 없음 설정
3. 등록 후 상품 상세 페이지에서 **상품코드** 확인 (예: `P000000A`)
   - 이 코드를 나중에 `PRODUCT_PDF_MAP`에 사용합니다

---

## STEP 2 · GitHub Private 레포에 PDF 보관

레포 구조:
```
(GitHub Private 레포)
└── ebooks/
    ├── ebook1.pdf
    └── ebook2.pdf
```

1. GitHub에 새 **Private** 레포 생성 (예: `my-ebooks`)
2. `ebooks/` 폴더에 PDF 업로드
3. **Settings → Developer settings → Personal access tokens → Fine-grained**
   - Repository access: 위 Private 레포만 선택
   - Permission: `Contents` → Read-only
   - 생성된 토큰 복사 → `GITHUB_TOKEN` 에 사용

---

## STEP 3 · Gmail SMTP 앱 비밀번호 발급

> Gmail 계정에 2단계 인증이 활성화되어 있어야 합니다.

1. [Google 계정 보안](https://myaccount.google.com/security) 접속
2. **2단계 인증** → 활성화
3. 검색창에 "앱 비밀번호" 검색 → 앱: **메일**, 기기: 기타(직접 입력) → `Lambda`
4. 생성된 **16자리 비밀번호** 복사 → `GMAIL_APP_PASSWORD` 에 사용

---

## STEP 4 · AWS 환경 준비

### AWS CLI 설치 및 루트 자격 증명 설정

```bash
# macOS
brew install awscli

# AWS 자격 증명 설정 (루트 계정 액세스 키)
aws configure
# AWS Access Key ID: <루트 액세스 키>
# AWS Secret Access Key: <루트 시크릿 키>
# Default region name: ap-northeast-2
# Default output format: json
```

> 보안 권장: 루트 계정 대신 AdministratorAccess 권한을 가진 IAM 사용자 액세스 키 사용

---

## STEP 5 · Lambda + API Gateway 최초 생성

### 환경변수 설정 후 스크립트 실행

```bash
export GMAIL_USER="your@gmail.com"
export GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"   # 공백 제거: abcdefghijklmnop
export GITHUB_TOKEN="github_pat_xxxxxxxxxxxx"
export GITHUB_REPO_OWNER="your-github-username"
export GITHUB_REPO_NAME="my-ebooks"
export CAFE24_SECRET="카페24웹훅시크릿"           # STEP 6에서 설정
export SHOP_NAME="BSM전자책"
# 상품코드 → PDF 파일명 매핑 (JSON)
export PRODUCT_PDF_MAP='{"P000000A":"ebook1.pdf","P000000B":"ebook2.pdf"}'

bash scripts/create_lambda.sh
```

스크립트 완료 후 출력되는 **웹훅 URL**과 **GitHub Secrets 값**을 저장해두세요.

---

## STEP 6 · 카페24 웹훅 등록

1. 카페24 관리자 → **쇼핑몰 설정 → 고급 설정 → 웹훅**
2. **웹훅 추가** 클릭
   - 이벤트: `주문 완료` (order_complete)
   - URL: `https://<id>.execute-api.ap-northeast-2.amazonaws.com/webhook`
   - 시크릿 키 생성 → 복사 → `CAFE24_SECRET` 환경변수에 설정
3. 저장

> 시크릿 키를 설정하면 Lambda에서 위변조 검증을 자동으로 수행합니다.

---

## STEP 7 · GitHub Actions Secrets 등록

GitHub 레포 → **Settings → Secrets and variables → Actions → New repository secret**

| Secret 이름 | 값 |
|---|---|
| `AWS_ACCESS_KEY_ID` | 스크립트 출력값 |
| `AWS_SECRET_ACCESS_KEY` | 스크립트 출력값 |
| `AWS_REGION` | `ap-northeast-2` |
| `GMAIL_USER` | Gmail 주소 |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호 (공백 없이) |
| `EBOOK_GITHUB_TOKEN` | GitHub Fine-grained 토큰 |
| `GITHUB_REPO_OWNER` | 전자책 레포 소유자 |
| `GITHUB_REPO_NAME` | 전자책 레포 이름 |
| `CAFE24_SECRET` | 카페24 웹훅 시크릿 |
| `PRODUCT_PDF_MAP` | `{"P000000A":"ebook1.pdf"}` |
| `SHOP_NAME` | 쇼핑몰 이름 |

---

## STEP 8 · 테스트 주문으로 전체 검증

### 방법 A: 스크립트로 직접 테스트

```bash
export API_GATEWAY_URL="https://<id>.execute-api.ap-northeast-2.amazonaws.com/webhook"
export TEST_EMAIL="실제받을이메일@gmail.com"
export TEST_PRODUCT_CODE="P000000A"
export CAFE24_SECRET="카페24시크릿"

python scripts/test_webhook.py
```

### 방법 B: 카페24 테스트 결제

1. 카페24 관리자 → 테스트 결제 실행
2. AWS Lambda 콘솔 → `ebook-delivery` → **모니터링 → CloudWatch Logs** 확인
3. 구매자 이메일로 PDF 수신 확인

---

## CI/CD 동작 방식

```
main 브랜치에 push (lambda/** 변경 시)
     ↓
GitHub Actions 자동 실행
     ↓
pip install → ZIP 패키징 → Lambda 코드 업데이트 → 환경변수 동기화
     ↓
배포 완료 (약 2-3분)
```

`lambda/lambda_function.py` 수정 후 `main`에 push하면 자동으로 Lambda가 업데이트됩니다.

---

## 디렉터리 구조

```
chatbot-1/
├── lambda/
│   ├── lambda_function.py      # Lambda 핸들러 (메인 로직)
│   └── requirements.txt        # Python 의존성 (requests)
├── scripts/
│   ├── create_lambda.sh        # 최초 1회 AWS 인프라 생성
│   └── test_webhook.py         # 웹훅 로컬/원격 테스트
├── .github/
│   └── workflows/
│       └── deploy-lambda.yml   # CI/CD 자동 배포
└── SETUP_GUIDE.md              # 이 문서
```

---

## 비용 예상 (월)

| 서비스 | 무료 한도 | 초과 시 |
|---|---|---|
| Lambda | 100만 호출 / 400,000 GB-초 | ~$0.0000002/호출 |
| API Gateway | 100만 호출 | ~$1/100만 호출 |
| Gmail SMTP | 무제한 (앱 비밀번호) | 무료 |
| GitHub Private | 무제한 | 무료 |

월 주문 수백 건 수준이면 **실질적으로 무료**로 운영 가능합니다.
