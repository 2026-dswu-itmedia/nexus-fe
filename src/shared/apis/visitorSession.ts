import api from '@/shared/apis/api';
import { isAxiosError } from 'axios';
import type { ApiResponse } from '@/shared/types/api';

interface VisitorSession {
  created: boolean;
}

// 감상평 작성·쿠폰 API 호출 전에 먼저 호출한다. 200(기존 유지)·201(신규) 모두 준비 완료 상태.
export const postVisitorSession = async () => {
  const { data } = await api.post<ApiResponse<VisitorSession>>('/visitor-sessions');
  return data.data;
};

// 세션이 필요한 요청을 감싼다. 먼저 세션을 준비하고, 그 사이 세션이 무효화된 경우(401)에만 한 번 재발급 후 재시도한다.
export const withVisitorSession = async <T>(request: () => Promise<T>) => {
  await postVisitorSession();
  try {
    return await request();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      await postVisitorSession();
      return request();
    }
    throw error;
  }
};
