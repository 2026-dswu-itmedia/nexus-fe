const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

// "인클리어가 / 이너감이 NEX:US와 함께합니다"처럼 이름 뒤에 붙는 주격 조사를 받침 유무로 고른다.
// 마지막 글자가 한글이 아니면 "가"로 둔다.
export const getSubjectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_SYLLABLE_START || code > HANGUL_SYLLABLE_END) return '가';
  return (code - HANGUL_SYLLABLE_START) % JONGSEONG_COUNT === 0 ? '가' : '이';
};
