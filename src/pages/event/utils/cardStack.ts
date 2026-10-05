// EVENT 홈·SPONSOR 목록의 카드는 시안처럼 ±2°씩 번갈아 기울어져 쌓인다.
// 위 카드가 아래 카드의 모서리를 덮도록 앞 항목일수록 z-index가 높다(시안 측정: 1·3번째 +2°, 2번째 -2°).
const STACKED_CARD_CLASSES = ['rotate-2 z-30', '-rotate-2 z-20', 'rotate-2 z-10'] as const;

export const getStackedCardClass = (index: number) =>
  STACKED_CARD_CLASSES[index % STACKED_CARD_CLASSES.length];
