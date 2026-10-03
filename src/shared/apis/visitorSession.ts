import api from '@/shared/apis/api';
import type { ApiResponse } from '@/shared/types/api';

interface VisitorSession {
  created: boolean;
}

// 감상평 작성·쿠폰 API 호출 전에 먼저 호출한다. 200(기존 유지)·201(신규) 모두 준비 완료 상태.
export const postVisitorSession = async () => {
  const { data } = await api.post<ApiResponse<VisitorSession>>('/visitor-sessions');
  return data.data;
};
