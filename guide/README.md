# Claude AI 완전 정복 — 실습 가이드 사이트

1일 8시간 워크숍(PART 1 Claude Chat · PART 2 Claude Code)의 실습 가이드입니다.
주소 형식: `https://bsmkorea1216sj.github.io/chatbot-1/week/{PART}/session/{교시}`

## 내용 수정

| 바꿀 것 | 파일 |
|---|---|
| 과정명·강사·소개 | `src/data/siteConfig.ts` |
| 교시 제목·목표·순서 | `src/data/curriculum.ts` |
| 교시 본문 | `public/content/week1/*.md`, `public/content/week2/*.md` |
| 샘플 파일 | `public/files/week1/`, `public/files/week2/` |
| 용어 사전 | `src/data/helpTerms.ts` |

## 로컬 실행

```bash
cd guide
npm install
npm run dev
```

`main` 브랜치에 `guide/` 변경이 올라가면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.
