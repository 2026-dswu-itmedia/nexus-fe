import { LoaderCircle } from 'lucide-react';

// 색을 지정하지 않고 상속받아 네이비 상세 레이아웃에서는 흰색으로 표시된다.
const PageFallback = () => {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <LoaderCircle className="size-8 animate-spin" aria-label="로딩 중" />
    </div>
  );
};

export default PageFallback;
