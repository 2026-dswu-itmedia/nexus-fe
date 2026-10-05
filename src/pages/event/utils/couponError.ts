import type { ApiError } from '@/shared/types/api';
import { isAxiosError } from 'axios';

// docs/api-spec.md 쿠폰 발급 오류 코드별 안내 문구. 목록에 없는 코드는 서버 message를 그대로 쓴다.
const COUPON_ERROR_MESSAGES: Record<string, string> = {
  INVALID_QR_TOKEN: '유효하지 않은 QR 코드예요',
  QR_TOKEN_INACTIVE: '만료되었거나 사용할 수 없는 QR 코드예요',
  COUPON_ISSUANCE_CLOSED: '지금은 쿠폰 발급 기간이 아니에요',
  RATE_LIMIT_EXCEEDED: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요',
};

// 같은 토큰으로 다시 요청해도 결과가 같은 발급 오류. 이 경우에만 URL의 QR 토큰을 지운다
// (타임아웃·429·500 같은 일시 오류는 새로고침으로 재시도할 수 있게 토큰을 남긴다).
const UNRECOVERABLE_COUPON_ERROR_CODES = new Set([
  'INVALID_QR_TOKEN',
  'QR_TOKEN_INACTIVE',
  'COUPON_ISSUANCE_CLOSED',
  'VALIDATION_ERROR',
]);

// 응답 본문이 명세의 오류 구조가 아닐 수도 있어(프록시의 HTML 404 등) 옵셔널 체이닝으로 읽는다.
const getApiErrorBody = (error: unknown) =>
  isAxiosError<ApiError>(error) ? error.response?.data?.error : undefined;

export const getCouponErrorMessage = (error: unknown) => {
  const apiError = getApiErrorBody(error);
  if (apiError) {
    return COUPON_ERROR_MESSAGES[apiError.code] ?? apiError.message;
  }
  return '네트워크 연결을 확인해 주세요.';
};

export const isUnrecoverableCouponError = (error: unknown) => {
  const code = getApiErrorBody(error)?.code;
  return code !== undefined && UNRECOVERABLE_COUPON_ERROR_CODES.has(code);
};
