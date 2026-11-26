export interface DownloadFile {
  name: string;
  description: string;
  path: string;
}

export interface MarkdownMetadata {
  title: string;
  week: number;
  session: number;
  awsServices: string[];
  learningObjectives: string[];
  // prerequisites 제거 (의미 없음)
  downloadFiles?: DownloadFile[];
}

export interface MarkdownContent {
  metadata: MarkdownMetadata;
  content: string;
}

/**
 * Front matter를 직접 파싱하는 함수 (gray-matter 대체)
 */
const parseFrontMatter = (text: string): { data: any; content: string } => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontMatterRegex);

  if (!match) {
    return { data: {}, content: text };
  }

  const [, frontMatter, content] = match;
  const data: any = {};

  // YAML 파싱 (간단한 버전)
  const lines = frontMatter.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // 배열 항목
    if (trimmedLine.startsWith('- ')) {
      const value = trimmedLine.substring(2).trim();
      currentArray.push(value);
      continue;
    }

    // 키-값 쌍
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      // 이전 배열 저장
      if (currentKey && currentArray.length > 0) {
        data[currentKey] = currentArray;
        currentArray = [];
      }

      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();

      currentKey = key;

      // 값이 있으면 저장
      if (value) {
        // 따옴표 제거
        const cleanValue = value.replace(/^["']|["']$/g, '');

        // 숫자 변환
        if (/^\d+$/.test(cleanValue)) {
          data[key] = parseInt(cleanValue, 10);
        } else {
          data[key] = cleanValue;
        }
        currentKey = '';
      }
    }
  }

  // 마지막 배열 저장
  if (currentKey && currentArray.length > 0) {
    data[currentKey] = currentArray;
  }

  return { data, content: content.trim() };
};

/**
 * Markdown 파일을 로드하고 메타데이터와 콘텐츠를 파싱합니다
 */
/** 마크다운 문자열(front matter 포함)을 파싱합니다 */
export const parseMarkdownText = (text: string): MarkdownContent => {
  const { data, content } = parseFrontMatter(
    text.split(String.fromCharCode(13)).join(''),
  );
  if (!data.title || !data.week || !data.session) {
    throw new Error('Missing required metadata fields: title, week, session');
  }
  return { metadata: data as MarkdownMetadata, content };
};

export const loadMarkdownFile = async (
  path: string,
): Promise<MarkdownContent> => {
  try {
    // 이 브라우저에만 저장된 개인 본문
    if (path.startsWith('private:')) {
      const { findPrivateItem } = await import('./privateMenu');
      const item = findPrivateItem(path.slice('private:'.length));
      if (!item?.markdown) throw new Error('개인 본문을 이 브라우저에서 찾을 수 없습니다.');
      return parseMarkdownText(item.markdown);
    }
    // base 경로 처리: path가 /로 시작하면 base 경로 추가
    const basePath = import.meta.env.BASE_URL || '/';
    const fullPath = path.startsWith('/')
      ? `${basePath}${path.substring(1)}`
      : path;

    const response = await fetch(fullPath);

    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${fullPath}`);
    }

    const text = await response.text();
    const { data, content } = parseFrontMatter(text);

    // 메타데이터 검증
    if (!data.title || !data.week || !data.session) {
      throw new Error('Missing required metadata fields: title, week, session');
    }

    return {
      metadata: data as MarkdownMetadata,
      content,
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
};

/**
 * 주차별 Markdown 파일 경로 생성
 */
export const getMarkdownPath = (week: number, session: number): string => {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}content/week${week}/${week}-${session}.md`;
};
