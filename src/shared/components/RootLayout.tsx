import { useLayoutEffect } from 'react';
import { Outlet, ScrollRestoration, useNavigationType } from 'react-router-dom';

// ScrollRestoration은 앱에 한 번만 렌더해야 하므로 루트 라우트에 둔다.
// 새 경로로 이동하면 맨 위로, 뒤로가기하면 이전 스크롤 위치로 복원된다.
const RootLayout = () => {
  const navigationType = useNavigationType();

  // View Transition 방향을 CSS(global.css)에 알린다. 라우터는 startViewTransition 콜백 안에서
  // flushSync로 렌더하므로 layout effect는 전환 스냅샷이 만들어지기 전에 실행된다.
  // 뒤로가기(POP)는 이전 화면이 오른쪽으로 빠지고, 그 외(PUSH·REPLACE)는 새 화면이 오른쪽에서 들어온다.
  useLayoutEffect(() => {
    document.documentElement.dataset.navDirection = navigationType === 'POP' ? 'back' : 'forward';
  }, [navigationType]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

export default RootLayout;
