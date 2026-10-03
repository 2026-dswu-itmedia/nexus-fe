import PageFallback from '@/shared/components/PageFallback';
import TopNavigation from '@/shared/components/TopNavigation';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// Suspense를 Outlet 바로 바깥에 두어 페이지 전환 시 상단 네비게이션은 유지되고 본문만 스피너로 바뀐다.
const MainLayout = () => {
  return (
    <div className="max-w-mobile bg-ivory-bg mx-auto flex min-h-dvh flex-col">
      <TopNavigation />
      <main className="flex flex-1 flex-col px-5">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default MainLayout;
