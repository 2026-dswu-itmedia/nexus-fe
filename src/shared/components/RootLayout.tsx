import { markNavigatedInApp } from '@/shared/hooks/useSkipEntranceMotion';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from 'react-router-dom';

// ScrollRestoration은 앱에 한 번만 렌더해야 하므로 루트 라우트에 둔다.
// 새 경로로 이동하면 맨 위로, 뒤로가기하면 이전 스크롤 위치로 복원된다.
const RootLayout = () => {
  const navigationType = useNavigationType();
  const { key } = useLocation();
  // 마지막 popstate에서 브라우저가 이미 전환 애니메이션을 보여줬는지(모바일 가장자리 스와이프 뒤로가기 등).
  const hasUAVisualTransitionRef = useRef(false);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 미지원 브라우저는 undefined라 false로 보고 기존처럼 슬라이드한다.
      hasUAVisualTransitionRef.current = event.hasUAVisualTransition === true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // View Transition 방향을 CSS(global.css)에 알린다. 라우터는 startViewTransition 콜백 안에서
  // flushSync로 렌더하므로 layout effect는 전환 스냅샷이 만들어지기 전에 실행된다.
  // 뒤로가기(POP)는 이전 화면이 오른쪽으로 빠지고, 그 외(PUSH·REPLACE)는 새 화면이 오른쪽에서 들어온다.
  // 브라우저가 스와이프로 이미 화면을 넘겼다면 슬라이드를 한 번 더 재생하지 않도록 방향을 none으로 둔다
  // (global.css 기본값이 animation: none이라 전환이 즉시 끝난다). 연속된 POP에도 다시 계산하도록 key에 의존한다.
  useLayoutEffect(() => {
    let direction = 'forward';
    if (navigationType === 'POP') {
      direction = hasUAVisualTransitionRef.current ? 'none' : 'back';
    }
    document.documentElement.dataset.navDirection = direction;
    hasUAVisualTransitionRef.current = false;
    if (navigationType !== 'POP') {
      markNavigatedInApp();
    }
  }, [navigationType, key]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

export default RootLayout;
