// docs/api-spec.md 2장 공통 응답 구조
export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[]; // 400 VALIDATION_ERROR에서만 포함
  };
}
