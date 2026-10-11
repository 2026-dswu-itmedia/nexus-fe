import { useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { useNavigationType } from 'react-router-dom';

// 첫 진입·새로고침도 라우터에서는 POP이므로, 앱 안에서 PUSH·REPLACE가 한 번이라도 있었는지로 구분한다.
// RootLayout이 이동할 때마다 표시한다.
let hasNavigatedInApp = false;

export const markNavigatedInApp = () => {
  hasNavigatedInApp = true;
};

// 진입 애니메이션을 건너뛸지. OS의 "동작 줄이기"가 켜져 있거나,
// 뒤로·앞으로 가기로 이미 본 페이지에 돌아온 경우(상세 → 목록 복귀 등)에는 바로 보여준다.
// 마운트 시점의 이동 방식으로 고정해, 이후 필터 변경(REPLACE) 등으로 다시 마운트되는 목록은 애니메이션된다.
const useSkipEntranceMotion = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigationType = useNavigationType();
  const [isHistoryNavigation] = useState(() => hasNavigatedInApp && navigationType === 'POP');
  return Boolean(shouldReduceMotion) || isHistoryNavigation;
};

export default useSkipEntranceMotion;
