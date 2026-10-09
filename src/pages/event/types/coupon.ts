// docs/api-spec.md "현장 QR 인증 및 쿠폰 발급", "내 쿠폰 조회" 응답 구조
export type CouponStatus = 'ISSUED' | 'EXPIRED';

export interface Coupon {
  id: string;
  name: string;
  benefitDescription: string;
  status: CouponStatus;
  issuedAt: string;
  expiresAt: string;
}
