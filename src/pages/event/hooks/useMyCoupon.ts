import { getMyCoupon } from '@/pages/event/apis/coupons';
import type { Coupon } from '@/pages/event/types/coupon';
import { withVisitorSession } from '@/shared/apis/visitorSession';
import type { ApiError } from '@/shared/types/api';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export const MY_COUPON_QUERY_KEY = ['coupon', 'me'] as const;

// 404 COUPON_NOT_FOUND는 "아직 발급받지 않음"이라는 정상 상태이므로 에러가 아닌 null로 돌려준다.
// 본문이 명세의 오류 구조가 아닌 404(프록시의 HTML 등)는 그대로 에러로 둔다.
const fetchMyCoupon = async (): Promise<Coupon | null> => {
  try {
    return await withVisitorSession(getMyCoupon);
  } catch (error) {
    if (
      isAxiosError<ApiError>(error) &&
      error.response?.status === 404 &&
      error.response.data?.error?.code === 'COUPON_NOT_FOUND'
    ) {
      return null;
    }
    throw error;
  }
};

// PARTNER 페이지(발급 여부 판단)와 제휴사 상세(쿠폰 표시)가 같은 캐시를 본다.
// QR 토큰으로 발급 중일 때는 enabled를 꺼서 발급 결과(setQueryData)가 조회 응답에 덮이지 않게 한다.
const useMyCoupon = (enabled = true) =>
  useQuery({
    queryKey: MY_COUPON_QUERY_KEY,
    queryFn: fetchMyCoupon,
    enabled,
  });

export default useMyCoupon;
