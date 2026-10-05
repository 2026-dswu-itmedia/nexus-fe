import type { ApiError } from '@/shared/types/api';
import { isAxiosError } from 'axios';

// docs/api-spec.md 쿠폰 발급 오류 코드별 안내 문구. 목록에 없는 코드는 서버 message를 그대로 쓴다.
const COUPON_ERROR_MESSAGES: Record<string, string> = {
  INVALID_QR_TOKEN: '유효하지 않은 QR 코드예요',
  QR_TOKEN_INACTIVE: '만료되었거나 사용할 수 없는 QR 코드예요',
  COUPON_ISSUANCE_CLOSED: '지금은 쿠폰 발급 기간이 아니에요',
  RATE_LIMIT_EXCEEDED: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요',
};

export const getCouponErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiError>(error) && error.response?.data.error) {
    const { code, message } = error.response.data.error;
    return COUPON_ERROR_MESSAGES[code] ?? message;
  }
  return '네트워크 연결을 확인해 주세요.';
};
