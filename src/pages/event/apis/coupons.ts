import type { Coupon } from '@/pages/event/types/coupon';
import api from '@/shared/apis/api';
import type { ApiResponse } from '@/shared/types/api';

// 방문자 세션 필요. 201(최초 발급)·200(기존 쿠폰 반환) 모두 같은 구조다.
export const postCoupon = async (qrToken: string) => {
  const { data } = await api.post<ApiResponse<Coupon>>('/coupons', { qrToken });
  return data.data;
};

// 방문자 세션 필요. 발급받은 쿠폰이 없으면 404 COUPON_NOT_FOUND.
export const getMyCoupon = async () => {
  const { data } = await api.get<ApiResponse<Coupon>>('/coupons/me');
  return data.data;
};
