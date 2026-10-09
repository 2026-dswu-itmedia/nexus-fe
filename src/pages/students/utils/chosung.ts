// 한글 음절(가~힣)은 유니코드에서 (초성 × 21 + 중성) × 28 + 종성 순으로 배치되어 있어
// 0xAC00을 뺀 값을 588(21 × 28)로 나누면 초성 인덱스가 나온다.
const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const SYLLABLES_PER_CHOSUNG = 21 * 28;

// 초성 인덱스 순서(ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ). 쌍자음은 기본 자음으로 묶어 필터한다.
const CHOSUNG_BY_INDEX = [
  'ㄱ',
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅂ',
  'ㅅ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

export type Chosung = (typeof CHOSUNG_BY_INDEX)[number];

// 한글이 아니면(영문 이름 등) undefined를 돌려주고, 초성 필터에서는 "전체"에서만 보인다.
export const getChosung = (text: string): Chosung | undefined => {
  const code = text.codePointAt(0);
  if (code === undefined || code < HANGUL_SYLLABLE_START || code > HANGUL_SYLLABLE_END) {
    return undefined;
  }
  return CHOSUNG_BY_INDEX[Math.floor((code - HANGUL_SYLLABLE_START) / SYLLABLES_PER_CHOSUNG)];
};

// 시안의 필터 항목(전체 ㄱ ㄴ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅎ)은 실제 학생 이름에 있는 초성만 나열한 것이므로
// 데이터에서 추출해 자음 순서대로 정렬한다. 학생이 바뀌어도 상수를 고칠 필요가 없다.
export const getChosungFilters = (names: string[]): { label: string; value: Chosung | null }[] => {
  const present = new Set(names.map(getChosung).filter((chosung) => chosung !== undefined));
  const ordered = CHOSUNG_BY_INDEX.filter(
    (chosung, index) => present.has(chosung) && CHOSUNG_BY_INDEX.indexOf(chosung) === index,
  );
  return [
    { label: '전체', value: null },
    ...ordered.map((chosung) => ({ label: chosung, value: chosung })),
  ];
};
