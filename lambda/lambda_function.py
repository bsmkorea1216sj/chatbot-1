import json
import os
import base64
import hmac
import hashlib
import smtplib
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication


# ─── 서명 검증 ────────────────────────────────────────────────────────────────

def verify_cafe24_signature(raw_body: str, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode("utf-8"),
        raw_body.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


# ─── GitHub Private 레포에서 PDF 다운로드 ──────────────────────────────────────

def fetch_pdf_from_github(product_code: str) -> tuple[bytes, str]:
    token = os.environ["GITHUB_TOKEN"]
    owner = os.environ["GITHUB_REPO_OWNER"]
    repo = os.environ["GITHUB_REPO_NAME"]

    # 환경변수 PRODUCT_PDF_MAP 예시: {"P000000A":"ebook1.pdf","P000000B":"ebook2.pdf"}
    pdf_map: dict = json.loads(os.environ.get("PRODUCT_PDF_MAP", "{}"))
    filename = pdf_map.get(product_code)

    if not filename:
        raise ValueError(f"상품코드 {product_code!r}에 매핑된 PDF 없음")

    url = f"https://api.github.com/repos/{owner}/{repo}/contents/ebooks/{filename}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3.raw",
    }
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.content, filename


# ─── Gmail SMTP 발송 ────────────────────────────────────────────────────────────

def send_ebook_email(
    to_email: str,
    buyer_name: str,
    product_name: str,
    pdf_bytes: bytes,
    pdf_filename: str,
) -> None:
    gmail_user = os.environ["GMAIL_USER"]
    gmail_password = os.environ["GMAIL_APP_PASSWORD"]
    shop_name = os.environ.get("SHOP_NAME", "전자책 쇼핑몰")

    msg = MIMEMultipart()
    msg["From"] = f"{shop_name} <{gmail_user}>"
    msg["To"] = to_email
    msg["Subject"] = f"[{shop_name}] '{product_name}' 전자책을 보내드립니다"

    body = (
        f"안녕하세요, {buyer_name}님!\n\n"
        f"'{product_name}' 전자책을 구매해 주셔서 진심으로 감사합니다.\n"
        f"첨부 파일에서 PDF를 다운로드하여 이용해 주세요.\n\n"
        f"문의사항은 언제든지 연락 주세요.\n\n"
        f"감사합니다.\n{shop_name}"
    )
    msg.attach(MIMEText(body, "plain", "utf-8"))

    attachment = MIMEApplication(pdf_bytes, _subtype="pdf")
    attachment.add_header("Content-Disposition", "attachment", filename=pdf_filename)
    msg.attach(attachment)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(gmail_user, gmail_password)
        server.send_message(msg)


# ─── Cafe24 웹훅 페이로드 파싱 ──────────────────────────────────────────────────

def parse_order(payload: dict) -> dict:
    """
    Cafe24 웹훅 구조를 정규화하여 반환.
    두 가지 포맷 모두 처리:
      1. { "event": { "name": "...", "resource": { ... } } }
      2. { "event_type": "...", "resource": { ... } }
    """
    event_block = payload.get("event", payload)
    resource = event_block.get("resource", payload.get("resource", {}))

    return {
        "event_name": event_block.get("name", payload.get("event_type", "")),
        "order_id": resource.get("order_id", ""),
        "buyer_name": resource.get("buyer_name", "고객"),
        "buyer_email": resource.get("buyer_email", ""),
        "items": resource.get("items", []),
    }


# ─── Lambda 핸들러 ──────────────────────────────────────────────────────────────

def lambda_handler(event, context):
    # 1. 바디 추출 (API Gateway 프록시 통합)
    raw_body: str = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        raw_body = base64.b64decode(raw_body).decode("utf-8")

    # 2. 서명 검증 (CAFE24_SECRET 설정 시에만 강제)
    cafe24_secret = os.environ.get("CAFE24_SECRET", "")
    if cafe24_secret:
        headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
        signature = headers.get("x-cafe24-signature", "")
        if not verify_cafe24_signature(raw_body, signature, cafe24_secret):
            print("서명 검증 실패")
            return {"statusCode": 401, "body": json.dumps({"error": "Invalid signature"})}

    # 3. 페이로드 파싱
    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError:
        return {"statusCode": 400, "body": json.dumps({"error": "Invalid JSON"})}

    order = parse_order(payload)
    print(f"이벤트: {order['event_name']} | 주문번호: {order['order_id']}")

    # 결제완료/주문완료 이벤트만 처리
    event_name = order["event_name"].lower()
    if not any(k in event_name for k in ("order_complete", "order_paid", "paid")):
        print(f"처리 불필요한 이벤트: {event_name}")
        return {"statusCode": 200, "body": json.dumps({"message": "ignored"})}

    buyer_email = order["buyer_email"]
    if not buyer_email:
        print("구매자 이메일 없음 → 처리 중단")
        return {"statusCode": 400, "body": json.dumps({"error": "No buyer email"})}

    # 4. 각 상품별 PDF 전송
    sent, skipped, errors = [], [], []
    for item in order["items"]:
        product_code = item.get("product_code", "")
        product_name = item.get("product_name", product_code)
        try:
            pdf_bytes, pdf_filename = fetch_pdf_from_github(product_code)
            send_ebook_email(
                buyer_email,
                order["buyer_name"],
                product_name,
                pdf_bytes,
                pdf_filename,
            )
            print(f"발송 완료 → {buyer_email} | {product_code} ({pdf_filename})")
            sent.append(product_code)
        except ValueError as e:
            print(f"매핑 없음: {e}")
            skipped.append(product_code)
        except Exception as e:
            print(f"오류 ({product_code}): {e}")
            errors.append({"product_code": product_code, "error": str(e)})

    status = 200 if not errors else 500
    return {
        "statusCode": status,
        "body": json.dumps(
            {
                "order_id": order["order_id"],
                "buyer_email": buyer_email,
                "sent": sent,
                "skipped": skipped,
                "errors": errors,
            },
            ensure_ascii=False,
        ),
    }
