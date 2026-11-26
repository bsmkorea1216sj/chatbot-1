// 실습 계획서 기반 커리큘럼 데이터

export type SessionType = 'theory' | 'lab' | 'demo' | 'none';

export interface Session {
  session: number;
  type: SessionType;
  title: string;
  hasContent: boolean;
  markdownPath?: string;
  description?: string;
  awsServices?: string[];
  learningObjectives?: string[]; // 차시별 학습 목표
  standalonePath?: string; // 주차 메뉴 대신 별도 주소로 제공 (예: '/ICT')
}

export interface WeekCurriculum {
  week: number;
  title: string;
  description: string;
  sessions: Session[];
  prerequisites?: string[];
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// 워크숍 커리큘럼: week = PART(1: 오전, 2: 오후), session = 교시 번호(1~8)
export const curriculum: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Claude Chat 완전 활용',
    description: '오전 4시간: 프롬프트 작성, 문서 분석, Projects, Artifacts를 익힙니다',
    sessions: [
      {
        session: 1,
        type: 'lab',
        title: 'Claude 소개 및 첫 대화',
        hasContent: true,
        markdownPath: '/content/week1/1-1-first-chat.md',
        description: '생성형 AI와 Claude의 특징, 인터페이스, 실습 A 여행 일정 자동 생성',
        awsServices: ['Claude Chat'],
        learningObjectives: [
          'Claude의 특징과 ChatGPT와의 차이를 용도 중심으로 설명할 수 있습니다.',
          '새 채팅·모델 선택·파일 첨부 등 기본 화면을 사용할 수 있습니다.',
          '역할과 형식을 지정한 프롬프트로 여행 일정을 표로 만들 수 있습니다.',
        ],
      },
      {
        session: 2,
        type: 'lab',
        title: '프롬프트 작성법',
        hasContent: true,
        markdownPath: '/content/week1/1-2-prompt.md',
        description: '좋은 프롬프트의 5가지 요소와 Before/After 비교 실습',
        awsServices: ['Claude Chat'],
        learningObjectives: [
          '좋은 프롬프트의 5요소(역할·목적·맥락·형식·제약조건)를 설명할 수 있습니다.',
          '같은 요청을 단순 질문과 5요소 질문으로 비교할 수 있습니다.',
          '나의 업무에 맞는 프롬프트를 직접 작성할 수 있습니다.',
        ],
      },
      {
        session: 3,
        type: 'lab',
        title: '파일 분석과 Projects',
        hasContent: true,
        markdownPath: '/content/week1/1-3-document-projects.md',
        description: '실습 B 문서 요약, 원본 검증, Projects로 나만의 업무 비서 만들기',
        awsServices: ['Claude Chat', 'Projects'],
        learningObjectives: [
          'PDF·엑셀 파일을 올려 핵심을 요약하고 표로 정리할 수 있습니다.',
          'AI 요약을 원본과 대조해 수치와 추측 여부를 검증할 수 있습니다.',
          'Projects에 지식과 지침을 등록해 반복 업무용 비서를 만들 수 있습니다.',
        ],
      },
      {
        session: 4,
        type: 'lab',
        title: 'Artifacts 도구 제작',
        hasContent: true,
        markdownPath: '/content/week1/1-4-artifacts.md',
        description: '실습 C 퀴즈 만들기와 후속 프롬프트로 반복 개선하기',
        awsServices: ['Claude Chat', 'Artifacts'],
        learningObjectives: [
          'Artifacts가 무엇인지 설명하고 실행 창을 사용할 수 있습니다.',
          '대화만으로 퀴즈·계산기 같은 작은 도구를 만들 수 있습니다.',
          '후속 프롬프트로 디자인과 기능을 단계적으로 개선할 수 있습니다.',
        ],
      },
    ],
    estimatedTime: '240분',
    difficulty: 'beginner',
  },
  {
    week: 2,
    title: 'Claude Code 웹앱 제작',
    description: '오후 4시간: 내 컴퓨터에서 웹페이지와 업무용 웹앱을 만들고 고칩니다',
    sessions: [
      {
        session: 5,
        type: 'lab',
        title: 'Claude Code 개요 및 환경 세팅',
        hasContent: true,
        markdownPath: '/content/week2/2-5-claude-code-setup.md',
        description: 'Claude Chat과 Code의 차이, 웹앱 구조, 요금제, 설치와 첫 명령',
        awsServices: ['Claude Code', 'VS Code', 'Node.js'],
        learningObjectives: [
          'Claude Chat과 Claude Code의 차이를 설명할 수 있습니다.',
          '웹앱의 구조(화면·로직·데이터)를 식당 비유로 설명할 수 있습니다.',
          'VS Code와 Node.js를 준비하고 Claude Code를 실행할 수 있습니다.',
        ],
      },
      {
        session: 6,
        type: 'lab',
        title: '자연어로 웹페이지 만들기',
        hasContent: true,
        markdownPath: '/content/week2/2-6-profile-web.md',
        description: '폴더 구조, HTML·CSS·JavaScript 기초, 실습 D 자기소개 웹페이지',
        awsServices: ['Claude Code', 'HTML', 'CSS', 'JavaScript'],
        learningObjectives: [
          'index.html·style.css·app.js의 역할을 구분할 수 있습니다.',
          '자연어 지시로 자기소개 웹페이지를 만들고 브라우저에서 열 수 있습니다.',
          '후속 지시로 디자인을 바꾸고 모바일 화면을 확인할 수 있습니다.',
        ],
      },
      {
        session: 7,
        type: 'lab',
        title: '기능 추가와 오류 수정',
        hasContent: true,
        markdownPath: '/content/week2/2-7-calculator-debug.md',
        description: '실습 E 매출·이익률 계산기, 버그 계산기로 디버깅 실습',
        awsServices: ['Claude Code', 'JavaScript'],
        learningObjectives: [
          '입력 검증·계산·초기화 기능이 있는 계산기 웹앱을 만들 수 있습니다.',
          '테스트 시나리오로 정상·예외 입력을 확인할 수 있습니다.',
          '오류 증상을 그대로 전달해 Claude Code로 버그를 고칠 수 있습니다.',
        ],
      },
      {
        session: 8,
        type: 'lab',
        title: '미니 프로젝트 발표',
        hasContent: true,
        markdownPath: '/content/week2/2-8-showcase.md',
        description: '나만의 업무용 웹앱 완성과 1분 시연 발표',
        awsServices: ['Claude Code'],
        learningObjectives: [
          '반복 업무를 줄이는 작은 웹앱 아이디어를 정할 수 있습니다.',
          '오늘 배운 방법으로 웹앱을 완성하고 개선할 수 있습니다.',
          '해결한 문제·핵심 기능·개선 경험·현업 적용 계획을 1분 안에 발표할 수 있습니다.',
        ],
      },
    ],
    estimatedTime: '240분',
    difficulty: 'beginner',
  },
];

// 세션 타입별 아이콘 및 레이블
export const sessionTypeConfig = {
  theory: { icon: 'file', label: '이론', color: 'grey', emoji: '📄' },
  lab: { icon: 'settings', label: '실습', color: 'blue', emoji: '🔬' },
  demo: { icon: 'video-on', label: '데모', color: 'green', emoji: '🎥' },
  none: { icon: 'edit', label: '시험', color: 'red', emoji: '📝' },
} as const;

/** 주차 메뉴와 분리해 별도 주소로 제공하는 차시 (standalonePath 지정 시) */
export const standaloneSessions = curriculum.flatMap((w) =>
  w.sessions
    .filter((s) => s.standalonePath)
    .map((s) => ({ week: w.week, session: s, path: s.standalonePath as string })),
);

/** 주차 목록에 표시할 차시 (별도 주소 차시 제외) */
export const weekSessions = (w: WeekCurriculum): Session[] =>
  w.sessions.filter((s) => !s.standalonePath);
