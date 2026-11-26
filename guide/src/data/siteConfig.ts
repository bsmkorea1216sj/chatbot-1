// 사이트 기본 설정 - 과정명, 강사 정보 등을 여기서 수정하세요

export const siteConfig = {
    // 기관명 (홈 제목 첫 줄)
    university: '실습형 AI 기초 교육',
    // 과정명
    courseName: 'Claude AI 완전 정복',
    // 일정 정보
    semester: '1일 8시간 워크숍',
    // 강사명
    professor: '빅데이터 김교수',
    // 영문 과정명 (홈 배지용)
    courseNameEn: 'Claude AI Workshop',
    // 과정 설명
    courseDescription: 'Chat부터 Code까지, 초보자를 위한 실전 워크숍',

    // 교육 시간
    credits: '8교시 (오전 4 · 오후 4)',
    // 구성
    courseCategory: '이론 40% · 실습 60%',
    // 대상
    evaluationType: 'AI·코딩 입문자, 직장인, 예비 창업자',

    // 과정 소개
    courseOverview:
        '오전에는 Claude Chat으로 프롬프트 작성, 문서 분석, Projects, Artifacts를 익히고, 오후에는 Claude Code로 내 컴퓨터에서 웹페이지와 업무용 웹앱을 직접 만들고 오류까지 고쳐 봅니다. 모든 실습은 이 사이트의 복사용 프롬프트와 가상 샘플 파일로 따라 할 수 있습니다.',

    // 학습 목표
    courseObjectives: [
        '좋은 프롬프트의 5요소(역할·목적·맥락·형식·제약조건)로 원하는 결과를 얻는다.',
        '문서를 요약·분석하고 원본과 대조해 AI 결과를 검증한다.',
        'Projects와 Artifacts로 반복 업무용 AI 비서와 간단한 도구를 만든다.',
        'Claude Code로 웹페이지·웹앱을 만들고 오류를 수정해 미니 프로젝트를 완성한다.',
    ],

    // 홈 페이지 피처 아이콘
    homeFeatures: [
        { icon: '💬', text: 'Claude Chat' },
        { icon: '🛠️', text: 'Artifacts' },
        { icon: '💻', text: 'Claude Code' },
    ],
} as const;

// 조합된 문자열 헬퍼
export const siteTitle = `${siteConfig.courseName}`;
export const semesterInfo = `${siteConfig.semester} · 강사 ${siteConfig.professor}`;
export const copyright = `© ${new Date().getFullYear()} ${siteConfig.courseName} 실습 가이드`;
