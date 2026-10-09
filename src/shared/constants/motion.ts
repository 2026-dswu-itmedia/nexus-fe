// 목록 행·MAP 배치도·내부 약도가 함께 쓰는 진입 페이드 값. 한 곳에서 바꿔야 같은 리듬이 유지된다.
export const FADE_TRANSITION = { duration: 0.4, ease: 'easeOut' } as const;

// 목록 행마다 벌어지는 간격(초). 위에서부터 차례로 올라온다.
export const ROW_STAGGER = 0.05;

// 페이지 섹션·카드(Reveal)가 순서대로 떠오르는 간격(초). 행 stagger보다 느긋하다.
export const REVEAL_STAGGER = 0.1;
