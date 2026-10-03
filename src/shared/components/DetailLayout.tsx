import PageFallback from '@/shared/components/PageFallback';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

interface DetailLayoutProps {
  variant?: 'light' | 'dark';
}

// 뒤로가기 헤더(BackHeader)는 제목이 페이지 데이터에서 나오므로 각 페이지가 직접 렌더한다.
const DetailLayout = ({ variant = 'light' }: DetailLayoutProps) => {
  return (
    <div
      className={`max-w-mobile mx-auto flex min-h-dvh flex-col ${variant === 'dark' ? 'bg-navy-100 text-white-100' : 'bg-ivory-bg'}`}
    >
      <main className="flex flex-1 flex-col px-5">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default DetailLayout;
