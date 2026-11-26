// 용어 사전 데이터
export interface Term {
    term: string
    definition: string
    category: string
    awsCategory?: string // 하위 분류명 (선택)
    weeks?: string[] // 이 용어를 다루는 교시 (예: ['3', '4'])
}

// 워크숍에서 다루는 용어
export const labTerms: Term[] = [
    // Claude 기능
    { term: 'Claude', definition: 'Anthropic이 만든 대화형 AI입니다. 긴 문서 이해, 자연스러운 한국어 작성, 코딩에 강점이 있습니다.', category: 'Claude 기능', weeks: ['1'] },
    { term: 'Claude Chat', definition: '웹 브라우저(claude.ai)나 앱에서 대화로 사용하는 Claude입니다. 글쓰기·요약·분석·Artifacts 제작에 씁니다.', category: 'Claude 기능', weeks: ['1', '2', '3', '4'] },
    { term: 'Projects', definition: '기준 문서(지식)와 고정 지침(Instructions)을 저장해 두는 전용 작업 공간입니다. 매번 설명하지 않아도 같은 규칙으로 결과를 만들어 줍니다.\n\n• 지식 - 보고서 양식, 매뉴얼 등 참고 문서\n• 지침 - 항상 지킬 말투·형식·규칙', category: 'Claude 기능', weeks: ['3'] },
    { term: 'Artifacts', definition: '대화창 오른쪽에 결과물(웹앱, 문서, 차트 등)을 바로 실행해 보여 주는 창입니다. 미리보기·코드 보기·링크 공유가 가능합니다.', category: 'Claude 기능', weeks: ['4'] },
    { term: 'Claude Code', definition: '터미널이나 VS Code에서 자연어로 지시하면 내 컴퓨터의 파일을 직접 만들고 고치는 AI 코딩 에이전트입니다. 유료(Pro 이상) 또는 API 키가 필요합니다.', category: 'Claude 기능', weeks: ['5', '6', '7', '8'] },
    { term: 'Sonnet / Haiku / Opus', definition: 'Claude의 모델 등급입니다. 일상 업무는 Sonnet을 기본으로 쓰고, 빠른 간단 작업은 Haiku, 어렵고 긴 작업은 Opus(유료)를 씁니다.', category: 'Claude 기능', weeks: ['1'] },

    // AI 기초
    { term: '생성형 AI', definition: '글·이미지·코드처럼 새로운 콘텐츠를 만들어 내는 AI입니다.', category: 'AI 기초', weeks: ['1'] },
    { term: '프롬프트 (Prompt)', definition: 'AI에게 주는 지시문입니다. 역할·목적·맥락·형식·제약조건 5요소를 넣으면 결과 품질이 크게 좋아집니다.', category: 'AI 기초', weeks: ['2'] },
    { term: '환각 (Hallucination)', definition: 'AI가 사실과 다른 내용을 그럴듯하게 만들어 내는 현상입니다. "문서에 없는 내용은 추측하지 마세요"라고 지시하고 원본과 대조해 막습니다.', category: 'AI 기초', weeks: ['3'] },
    { term: '마스킹 (비식별화)', definition: '이름·연락처·주민번호 같은 개인정보나 사내 기밀을 가린 뒤 AI에 올리는 것입니다.', category: 'AI 기초', weeks: ['3'] },

    // 웹 기초
    { term: 'HTML', definition: 'HyperText Markup Language. 웹페이지의 뼈대(제목·문단·버튼·이미지 배치)를 만드는 언어입니다.', category: '웹 기초', weeks: ['6'] },
    { term: 'CSS', definition: 'Cascading Style Sheets. 색상·여백·글꼴·모바일 정렬 등 디자인을 담당합니다.', category: '웹 기초', weeks: ['6'] },
    { term: 'JavaScript', definition: '클릭 반응·계산·화면 전환 같은 동작을 담당하는 언어입니다.', category: '웹 기초', weeks: ['6', '7'] },
    { term: '프론트엔드 / 백엔드', definition: '프론트엔드는 사용자가 보고 누르는 화면(식당의 홀), 백엔드는 주문을 처리하는 보이지 않는 서버(식당의 주방)입니다.', category: '웹 기초', weeks: ['5'] },
    { term: '반응형 디자인', definition: '화면 크기(PC·태블릿·휴대폰)에 맞춰 배치가 자동으로 바뀌는 디자인입니다.', category: '웹 기초', weeks: ['6'] },
    { term: 'NaN', definition: 'Not a Number. 0을 0으로 나누는 것처럼 숫자로 계산할 수 없을 때 JavaScript가 내놓는 값입니다.', category: '웹 기초', weeks: ['7'] },

    // 개발 도구
    { term: 'VS Code', definition: 'Visual Studio Code. 무료 코드 편집기로, 터미널과 Claude Code를 함께 쓸 수 있습니다.', category: '개발 도구', weeks: ['5'] },
    { term: 'Node.js / npm', definition: 'Node.js는 JavaScript 실행 환경, npm(Node Package Manager)은 프로그램 설치 도구입니다. Claude Code 설치에 필요합니다.', category: '개발 도구', weeks: ['5'] },
    { term: '터미널', definition: '글자로 명령을 입력해 컴퓨터를 다루는 창입니다. VS Code에서는 Ctrl + ` 로 엽니다.', category: '개발 도구', weeks: ['5'] },
    { term: 'API 키', definition: '프로그램이 Claude를 쓸 수 있게 해 주는 비밀 열쇠입니다. 다른 사람에게 보여 주거나 코드에 넣지 마세요.', category: '개발 도구', weeks: ['5'] },
]
