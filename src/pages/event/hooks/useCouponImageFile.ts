import { fetchCouponImageFile } from '@/pages/event/utils/saveCouponImage';
import { useQuery } from '@tanstack/react-query';

// 저장 버튼이 보이는 동안 쿠폰 이미지를 미리 File로 받아 둔다.
// iOS Safari는 탭 직후(사용자 제스처가 살아 있는 동안)에만 공유 시트를 열 수 있어, 탭 시점에 fetch를 기다리면 열리지 않는다.
// 정적 파일이라 한 번 받으면 바꿀 일이 없으므로 staleTime을 무한으로 둔다.
const useCouponImageFile = (url: string, fileName: string, enabled: boolean) => {
  const { data } = useQuery({
    queryKey: ['coupon-image', url, fileName],
    queryFn: () => fetchCouponImageFile(url, fileName),
    enabled,
    staleTime: Infinity,
  });
  return data;
};

export default useCouponImageFile;
