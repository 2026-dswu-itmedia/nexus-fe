import { useSyncExternalStore } from 'react';

// 페이지를 한 화면(100vh) 넘게 내렸는지. 외부 스토어(window 스크롤)를 구독하므로 effect 안에서 setState할 필요가 없고,
// 뒤로가기로 스크롤 위치가 복원된 채 마운트돼도 첫 렌더부터 올바른 값을 준다.
const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
};

const getSnapshot = () => window.scrollY > window.innerHeight;

const getServerSnapshot = () => false;

const useIsScrolledPastViewport = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsScrolledPastViewport;
