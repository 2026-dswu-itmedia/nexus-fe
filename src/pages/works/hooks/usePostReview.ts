import { postReview } from '@/pages/works/apis/reviews';
import { postVisitorSession } from '@/shared/apis/visitorSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const usePostReview = (workId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // 감상평 작성은 방문자 세션이 필요하므로 먼저 세션을 준비한다(200·201 모두 준비 완료).
    mutationFn: async (content: string) => {
      await postVisitorSession();
      try {
        return await postReview(workId, content);
      } catch (error) {
        // 세션이 그 사이 무효화된 경우(401)에만 세션을 다시 발급받고 한 번 재시도한다.
        if (isAxiosError(error) && error.response?.status === 401) {
          await postVisitorSession();
          return postReview(workId, content);
        }
        throw error;
      }
    },
    // 모든 페이지 쿼리를 무효화해 1페이지로 돌아갔을 때 새 감상평이 바로 보이게 한다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', workId] }),
  });
};

export default usePostReview;
