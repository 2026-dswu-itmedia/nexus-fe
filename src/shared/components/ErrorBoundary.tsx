import Button from '@/shared/components/Button';
import { ChevronRight } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// createBrowserRouter의 errorElement로 사용한다. 라우트 내부 렌더 오류와 lazy 청크 로드 실패를 모두 받는다.
const ErrorBoundary = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  // 배포 후 남은 이전 청크 때문에 실패한 경우를 복구하기 위해 전체 새로고침으로 이동한다.
  const handleHomeClick = () => {
    window.location.assign('/');
  };

  return (
    <div className="max-w-mobile bg-ivory-bg mx-auto flex min-h-dvh flex-col">
      <div className="text-regular-16 text-subtext-700 flex flex-1 items-center justify-center px-5 text-center">
        <p>{message}</p>
      </div>
      <div className="px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <Button onClick={handleHomeClick} icon={<ChevronRight className="size-6" />}>
          NEX:US 홈페이지 바로가기
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
