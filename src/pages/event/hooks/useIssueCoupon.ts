import { postCoupon } from '@/pages/event/apis/coupons';
import { MY_COUPON_QUERY_KEY } from '@/pages/event/hooks/useMyCoupon';
import { withVisitorSession } from '@/shared/apis/visitorSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 현장 QR의 토큰으로 쿠폰을 발급한다. 세션 준비·401 재시도는 withVisitorSession이 맡는다.
const useIssueCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrToken: string) => withVisitorSession(() => postCoupon(qrToken)),
    // 발급 응답이 곧 "내 쿠폰"이므로 다시 조회하지 않고 캐시에 바로 넣는다.
    onSuccess: (coupon) => queryClient.setQueryData(MY_COUPON_QUERY_KEY, coupon),
  });
};

export default useIssueCoupon;
