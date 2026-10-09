import type { PostedReview, ReviewPage } from '@/pages/works/types/review';
import api from '@/shared/apis/api';
import type { ApiResponse } from '@/shared/types/api';

// 작품 ID에 한글이 포함될 수 있어 경로에 넣기 전에 인코딩한다.
const getReviewsUrl = (artworkId: string) => `/artworks/${encodeURIComponent(artworkId)}/reviews`;

// 방문자 세션 불필요. 페이지 크기는 서버에서 8개로 고정이다.
export const getReviews = async (artworkId: string, page: number) => {
  const { data } = await api.get<ApiResponse<ReviewPage>>(getReviewsUrl(artworkId), {
    params: { page },
  });
  return data.data;
};

// 방문자 세션 필요. withVisitorSession()으로 감싸 호출한다.
export const postReview = async (artworkId: string, content: string) => {
  const { data } = await api.post<ApiResponse<PostedReview>>(getReviewsUrl(artworkId), { content });
  return data.data;
};
