#!/usr/bin/env python3
"""
카페24 웹훅 로컬 테스트 스크립트
사용법: python scripts/test_webhook.py [API_GATEWAY_URL]
"""
import hashlib
import hmac
import json
import os
import sys
import urllib.request
from datetime import datetime

# ─── 테스트 설정 ──────────────────────────────────────────────────────────────
API_URL = sys.argv[1] if len(sys.argv) > 1 else os.environ.get(
    "API_GATEWAY_URL", "http://localhost:8080/webhook"
)
CAFE24_SECRET = os.environ.get("CAFE24_SECRET", "")

# 테스트용 카페24 주문 완료 웹훅 페이로드
TEST_PAYLOAD = {
    "event": {
        "name": "order_complete",
        "version": "1",
        "resource": {
            "order_id": f"TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "buyer_name": "테스트구매자",
            "buyer_email": os.environ.get("TEST_EMAIL", "test@example.com"),
            "items": [
                {
                    "product_code": os.environ.get("TEST_PRODUCT_CODE", "P000000A"),
                    "product_name": "테스트 전자책",
                    "quantity": 1,
                    "price": "10000",
                }
            ],
        },
    }
}


def make_signature(body: str, secret: str) -> str:
    return hmac.new(
        secret.encode("utf-8"),
        body.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def run_test():
    body = json.dumps(TEST_PAYLOAD, ensure_ascii=False)
    body_bytes = body.encode("utf-8")

    headers = {
        "Content-Type": "application/json; charset=utf-8",
    }
    if CAFE24_SECRET:
        headers["X-Cafe24-Signature"] = make_signature(body, CAFE24_SECRET)
        print(f"서명 추가: {headers['X-Cafe24-Signature'][:16]}...")

    print(f"\n▶ POST {API_URL}")
    print(f"  주문번호 : {TEST_PAYLOAD['event']['resource']['order_id']}")
    print(f"  구매자   : {TEST_PAYLOAD['event']['resource']['buyer_name']}")
    print(f"  이메일   : {TEST_PAYLOAD['event']['resource']['buyer_email']}")
    print(f"  상품코드 : {TEST_PAYLOAD['event']['resource']['items'][0]['product_code']}")
    print("")

    req = urllib.request.Request(
        API_URL,
        data=body_bytes,
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            status = resp.status
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        status = e.code
        result = json.loads(e.read().decode("utf-8"))

    print(f"HTTP 상태: {status}")
    print(f"응답: {json.dumps(result, ensure_ascii=False, indent=2)}")

    if status == 200 and result.get("sent"):
        print("\n✓ 성공! 이메일이 발송되었습니다.")
        print(f"  수신 이메일: {result.get('buyer_email')}")
        print(f"  발송 상품코드: {result.get('sent')}")
    elif result.get("skipped"):
        print("\n⚠ PDF 매핑 없음. PRODUCT_PDF_MAP 환경변수를 확인하세요.")
    else:
        print("\n✗ 오류 발생:")
        for err in result.get("errors", []):
            print(f"  - {err}")
        sys.exit(1)


if __name__ == "__main__":
    run_test()
