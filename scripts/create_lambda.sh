#!/usr/bin/env bash
# AWS Lambda + API Gateway 최초 1회 생성 스크립트
# 사용법: bash scripts/create_lambda.sh
set -euo pipefail

# ─── 설정값 (직접 입력하거나 환경변수로 전달) ──────────────────────────────────
FUNCTION_NAME="${FUNCTION_NAME:-ebook-delivery}"
REGION="${AWS_REGION:-ap-northeast-2}"          # 서울 리전
RUNTIME="python3.11"
HANDLER="lambda_function.lambda_handler"
TIMEOUT=30                                       # 초 (PDF 다운로드 + 이메일 전송)
MEMORY=256                                       # MB

# GitHub Actions 배포용 IAM 사용자명
IAM_USER="${IAM_USER:-github-actions-deployer}"

echo "========================================"
echo " 전자책 자동발송 Lambda 초기 생성 스크립트"
echo "========================================"
echo ""

# ─── 1. 필수 환경변수 확인 ────────────────────────────────────────────────────
required_vars=(
  GMAIL_USER GMAIL_APP_PASSWORD
  GITHUB_TOKEN GITHUB_REPO_OWNER GITHUB_REPO_NAME
  PRODUCT_PDF_MAP
)
for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: 환경변수 $var 가 설정되어 있지 않습니다."
    exit 1
  fi
done

# ─── 2. Lambda 실행 역할 생성 ─────────────────────────────────────────────────
TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}'

ROLE_NAME="${FUNCTION_NAME}-role"
echo "[1/7] IAM 역할 생성: $ROLE_NAME"
ROLE_ARN=$(aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document "$TRUST_POLICY" \
  --region "$REGION" \
  --query "Role.Arn" \
  --output text 2>/dev/null || \
  aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)

aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --region "$REGION" 2>/dev/null || true

echo "  역할 ARN: $ROLE_ARN"
echo "  역할 활성화 대기 중 (10초)..."
sleep 10

# ─── 3. 배포 패키지 빌드 ─────────────────────────────────────────────────────
echo "[2/7] Lambda 배포 패키지 빌드"
BUILD_DIR="$(mktemp -d)"
pip install --quiet --target "$BUILD_DIR" -r lambda/requirements.txt
cp lambda/lambda_function.py "$BUILD_DIR/"
ZIP_PATH="$(mktemp --suffix=.zip)"
(cd "$BUILD_DIR" && zip -r "$ZIP_PATH" . -q)
echo "  ZIP 크기: $(du -sh "$ZIP_PATH" | cut -f1)"

# ─── 4. Lambda 함수 생성 ─────────────────────────────────────────────────────
echo "[3/7] Lambda 함수 생성: $FUNCTION_NAME"

ENV_VARS="Variables={\
GMAIL_USER=${GMAIL_USER},\
GMAIL_APP_PASSWORD=${GMAIL_APP_PASSWORD},\
GITHUB_TOKEN=${GITHUB_TOKEN},\
GITHUB_REPO_OWNER=${GITHUB_REPO_OWNER},\
GITHUB_REPO_NAME=${GITHUB_REPO_NAME},\
CAFE24_SECRET=${CAFE24_SECRET:-},\
PRODUCT_PDF_MAP=${PRODUCT_PDF_MAP},\
SHOP_NAME=${SHOP_NAME:-전자책쇼핑몰}\
}"

aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime "$RUNTIME" \
  --handler "$HANDLER" \
  --role "$ROLE_ARN" \
  --zip-file "fileb://${ZIP_PATH}" \
  --timeout "$TIMEOUT" \
  --memory-size "$MEMORY" \
  --environment "$ENV_VARS" \
  --region "$REGION" \
  --no-cli-pager

aws lambda wait function-active --function-name "$FUNCTION_NAME" --region "$REGION"
echo "  Lambda 함수 활성화 완료"

# ─── 5. API Gateway (HTTP API) 생성 ──────────────────────────────────────────
echo "[4/7] API Gateway HTTP API 생성"
API_ID=$(aws apigatewayv2 create-api \
  --name "${FUNCTION_NAME}-api" \
  --protocol-type HTTP \
  --region "$REGION" \
  --query "ApiId" \
  --output text)

ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
LAMBDA_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}"

# Lambda 통합 생성
INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id "$API_ID" \
  --integration-type AWS_PROXY \
  --integration-uri "$LAMBDA_ARN" \
  --payload-format-version "2.0" \
  --region "$REGION" \
  --query "IntegrationId" \
  --output text)

# POST /webhook 라우트
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key "POST /webhook" \
  --target "integrations/${INTEGRATION_ID}" \
  --region "$REGION" \
  --no-cli-pager > /dev/null

# $default 스테이지 자동 배포
aws apigatewayv2 create-stage \
  --api-id "$API_ID" \
  --stage-name "\$default" \
  --auto-deploy \
  --region "$REGION" \
  --no-cli-pager > /dev/null

# ─── 6. Lambda에 API Gateway 호출 권한 부여 ───────────────────────────────────
echo "[5/7] Lambda 호출 권한 부여"
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id "apigateway-invoke" \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" \
  --region "$REGION" \
  --no-cli-pager > /dev/null

WEBHOOK_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/webhook"
echo "  웹훅 URL: $WEBHOOK_URL"

# ─── 7. GitHub Actions 배포용 IAM 사용자 생성 ────────────────────────────────
echo "[6/7] GitHub Actions 배포용 IAM 사용자 생성: $IAM_USER"
aws iam create-user --user-name "$IAM_USER" --region "$REGION" 2>/dev/null || \
  echo "  (이미 존재함)"

DEPLOY_POLICY="{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Action\": [
      \"lambda:UpdateFunctionCode\",
      \"lambda:UpdateFunctionConfiguration\",
      \"lambda:GetFunction\"
    ],
    \"Resource\": \"${LAMBDA_ARN}\"
  }]
}"

aws iam put-user-policy \
  --user-name "$IAM_USER" \
  --policy-name "${FUNCTION_NAME}-deploy" \
  --policy-document "$DEPLOY_POLICY" \
  --region "$REGION"

KEY_OUTPUT=$(aws iam create-access-key --user-name "$IAM_USER" --output json)
ACCESS_KEY=$(echo "$KEY_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['AccessKey']['AccessKeyId'])")
SECRET_KEY=$(echo "$KEY_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['AccessKey']['SecretAccessKey'])")

# ─── 8. 완료 요약 ─────────────────────────────────────────────────────────────
echo ""
echo "========================================"
echo " 완료! 아래 정보를 GitHub Secrets에 등록하세요"
echo "========================================"
echo ""
echo "  AWS_ACCESS_KEY_ID     = $ACCESS_KEY"
echo "  AWS_SECRET_ACCESS_KEY = $SECRET_KEY"
echo "  AWS_REGION            = $REGION"
echo ""
echo "  [카페24 웹훅 등록 URL]"
echo "  $WEBHOOK_URL"
echo ""
echo "  ※ 위 시크릿 키는 이 화면에서만 표시됩니다. 즉시 저장하세요."

# 임시 파일 정리
rm -rf "$BUILD_DIR" "$ZIP_PATH"
