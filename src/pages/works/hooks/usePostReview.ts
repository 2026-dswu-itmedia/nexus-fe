import { postReview } from '@/pages/works/apis/reviews';
import { withVisitorSession } from '@/shared/apis/visitorSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const usePostReview = (workId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // 감상평 작성은 방문자 세션이 필요하다. 세션 준비와 401 재발급·재시도는 withVisitorSession이 맡는다.
    mutationFn: (content: string) => withVisitorSession(() => postReview(workId, content)),
    // 모든 페이지 쿼리를 무효화해 1페이지로 돌아갔을 때 새 감상평이 바로 보이게 한다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', workId] }),
  });
};

export default usePostReview;
