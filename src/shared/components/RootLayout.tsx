import { Outlet, ScrollRestoration } from 'react-router-dom';

// ScrollRestoration은 앱에 한 번만 렌더해야 하므로 루트 라우트에 둔다.
// 새 경로로 이동하면 맨 위로, 뒤로가기하면 이전 스크롤 위치로 복원된다.
const RootLayout = () => {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
};

export default RootLayout;
