import { useState } from 'react';
import { useLocation, useViewTransitionState } from 'react-router-dom';

// 이 컴포넌트가 View Transition 슬라이드로 들어오는 중인지.
// 라우터는 전환 상태를 켠 뒤 startViewTransition 콜백 안에서 새 페이지를 렌더하므로 첫 렌더부터 true이고,
// 슬라이드가 끝나면 false로 바뀌며 다시 렌더된다.
// 나가는 페이지도 전환 상태를 받으므로, 전환 중에 마운트된 경우로 한정해 나가는 화면이 미리 숨지 않게 한다.
// 슬라이드와 진입 페이드가 동시에 돌면 모바일에서 내용이 두 번 나타나 보이므로,
// 전환 중에는 숨긴 상태(initial)를 유지하고 끝난 뒤에 페이드를 시작하는 데 쓴다.
const useIsViewTransitioning = () => {
  const { pathname } = useLocation();
  const isTransitioning = useViewTransitionState(pathname);
  const [isMountedDuringTransition] = useState(isTransitioning);
  return isMountedDuringTransition && isTransitioning;
};

export default useIsViewTransitioning;
