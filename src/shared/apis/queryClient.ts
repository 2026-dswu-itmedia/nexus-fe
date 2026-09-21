import { QueryClient } from '@tanstack/react-query';

// 전시 정보는 자주 바뀌지 않으므로 staleTime을 길게 두고 포커스 리페치를 끈다.
// 방명록처럼 갱신이 잦은 쿼리는 개별 쿼리에서 옵션을 덮어쓴다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
