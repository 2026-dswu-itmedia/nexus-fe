import { getReviews } from '@/pages/works/apis/reviews';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

// 감상평은 작성 직후 바로 반영되어야 하므로 공용 staleTime(5분)을 쓰지 않는다.
// keepPreviousData: 페이지를 넘길 때 그리드가 비었다가 다시 채워지는 깜빡임을 막는다.
const useReviews = (workId: string, page: number) =>
  useQuery({
    queryKey: ['reviews', workId, page],
    queryFn: () => getReviews(workId, page),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

export default useReviews;
