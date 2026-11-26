import { visit } from 'unist-util-visit';
import type { Root, Text } from 'mdast';

/**
 * remark 플러그인: 한글 조사 앞 볼드 처리
 * **단어**는 → **단어** 는 자동 변환
 */
export default function remarkKoreanBold() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text) => {
      // 한글 조사 목록
      const particles = ['는', '은', '가', '이', '를', '을', '와', '과', '에', '의', '로', '으로', '도', '만', '부터', '까지', '에서', '에게', '한테', '께', '라고', '이라고'];
      
      let text = node.value;
      let modified = false;
      
      // **단어**조사 → **단어** 조사
      for (const particle of particles) {
        const pattern = new RegExp(`(\\*\\*[^*]+\\*\\*)(${particle})`, 'g');
        const newText = text.replace(pattern, '$1 $2');
        if (newText !== text) {
          text = newText;
          modified = true;
        }
      }
      
      if (modified) {
        node.value = text;
      }
    });
  };
}
