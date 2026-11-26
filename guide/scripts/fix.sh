#!/bin/bash

# 실습 가이드 마크다운 파일의 일반적인 오류를 자동으로 수정하는 스크립트

echo "🔧 마크다운 파일 자동 수정 시작..."

# 수정할 디렉토리
CONTENT_DIR="public/content"

# 백업 생성
echo "📦 백업 생성 중..."
tar -czf "markdown-backup-$(date +%Y%m%d-%H%M%S).tar.gz" "$CONTENT_DIR"

# 1. 청유형 → 명령형
echo "✏️  청유형을 명령형으로 변경 중..."
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/하세요\./합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/해주세요\./합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/해보세요\./합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/확인하세요\./확인합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/선택하세요\./선택합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/클릭하세요\./클릭합니다./g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/입력하세요\./입력합니다./g' {} +

# 2. 왼쪽 메뉴 표현
echo "✏️  왼쪽 메뉴 표현 수정 중..."
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/왼쪽 메뉴의/왼쪽 메뉴에서/g' {} +

# 3. 탭 선택 표현
echo "✏️  탭 선택 표현 수정 중..."
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/탭으로 이동합니다/탭을 선택합니다/g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/탭으로 돌아갑니다/탭을 선택합니다/g' {} +

# 4. 연속 동작 표현
echo "✏️  연속 동작 표현 수정 중..."
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/선택하고 선택/선택한 후 선택/g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/입력하고 입력/입력한 후 입력/g' {} +
find "$CONTENT_DIR" -name "*.md" -type f -exec sed -i '' 's/클릭하고 클릭/클릭한 후 클릭/g' {} +

echo "✅ 자동 수정 완료!"
echo ""
echo "📊 변경 사항 확인:"
git diff --stat "$CONTENT_DIR"
echo ""
echo "💡 변경 사항을 확인하려면: git diff $CONTENT_DIR"
echo "💡 변경 사항을 되돌리려면: git checkout $CONTENT_DIR"
echo "💡 백업 파일: markdown-backup-*.tar.gz"
