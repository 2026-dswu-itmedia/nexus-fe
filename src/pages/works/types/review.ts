// 정적 방명록에 보존한 작품 감상평 응답 구조
export interface Review {
  id: string;
  content: string;
  createdAt: string;
}

export interface ReviewPagination {
  page: number;
  pageSize: number; // 항상 8
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ReviewPage {
  items: Review[];
  pagination: ReviewPagination;
}
