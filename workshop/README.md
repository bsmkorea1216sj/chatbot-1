# 🧑‍🏫 Claude AI 완전 정복 — 실습 자료실

**Chat부터 Code까지, 초보자를 위한 1일 8시간 실전 워크숍**의 실습 파일 모음입니다.

> ⚠️ 이 폴더의 모든 회사명·인물·수치는 **실습용 가상 데이터**입니다. 실제와 관계없습니다.

## 📦 한 번에 모두 받기

**[⬇️ 실습 자료 전체 다운로드 (ZIP)](workshop-materials.zip?raw=true)**: 받은 뒤 압축을 풀어서 사용하세요.

## 📋 복사용 프롬프트

👉 **[프롬프트 모음 열기](prompts.md)** (실습 A~E, 비교·디버깅 실습 포함)

## 📂 교시별 실습 파일

| 교시 | 실습 | 파일 | 용도 |
|---|---|---|---|
| 3교시 | 실습 B · 문서 요약 | [📄 weekly_report_sample.pdf](03-document/weekly_report_sample.pdf?raw=true) | 가상 회사 주간 업무 보고서 (2쪽) |
| 3교시 | 실습 B · 심화 | [📊 sales_data.xlsx](03-document/sales_data.xlsx?raw=true) · [sales_data.csv](03-document/sales_data.csv?raw=true) | 일별 매출 데이터, 보고서 수치와 대조 |
| 3교시 | Projects 실습 | [📝 weekly_report_template.docx](03-projects/weekly_report_template.docx?raw=true) | 프로젝트 "지식"에 올릴 보고서 양식 |
| 3교시 | Projects 실습 | [instructions_example.txt](03-projects/instructions_example.txt) | "지침(Instructions)"에 붙여 넣을 예시 |
| 3교시 | Projects 실습 | [today_memo_example.txt](03-projects/today_memo_example.txt) | 테스트용 "오늘 한 일" 메모 |
| 4교시 | 실습 C · 퀴즈 | [quiz-example.html](04-artifacts/quiz-example.html?raw=true) | 완성 예시 (받은 뒤 더블클릭) |
| 6교시 | 실습 D · 자기소개 | [my-profile-web/](06-profile/my-profile-web) | 완성 예시 폴더 (index.html·style.css·app.js) |
| 7교시 | 디버깅 실습 | [07-calculator/buggy/](07-calculator/buggy) | **일부러 버그를 넣은** 계산기: 매출 0원이면 `NaN%` 표시 |
| 7교시 | 디버깅 정답 | [07-calculator/fixed/](07-calculator/fixed) | 수정 완료 버전 (비교용) |

## 🛠 실습 순서 예시

1. **3교시 문서 분석:** PDF를 Claude에 끌어다 놓고 실습 B 프롬프트를 입력합니다. 요약에 나온 숫자를 PDF 원본과 대조해 봅니다.
2. **Projects:** 양식(docx)과 지침(txt)으로 "내 주간업무 보고 비서"를 만들고, 메모를 넣어 결과를 확인합니다.
3. **7교시 디버깅:** ZIP을 풀고 VS Code에서 `07-calculator/buggy` 폴더를 엽니다. `index.html`을 브라우저로 열어 매출에 0을 넣으면 `NaN%`가 나옵니다. 터미널에서 `claude`를 실행하고 디버깅 프롬프트로 수정을 요청합니다.

## 💡 설치가 어려운 경우

Claude Code 설치에 실패했거나 무료 계정이면, `buggy/app.js` 내용을 Claude Chat에 붙여 넣고 같은 요청을 하세요. Artifacts로 동일한 실습을 할 수 있습니다.
