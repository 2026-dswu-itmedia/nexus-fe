import ReviewList from '@/pages/works/components/ReviewList';
import ReviewPagination from '@/pages/works/components/ReviewPagination';
import reviewArchive from '@/pages/works/constants/review.json';
import type { ReviewPage } from '@/pages/works/types/review';
import type { ApiResponse } from '@/shared/types/api';
import { useState } from 'react';

const reviewsByWork: Partial<Record<string, Partial<Record<number, ApiResponse<ReviewPage>>>>> =
  reviewArchive;

interface ReviewSectionProps {
  workId: string;
}

// 기존 감상평 목록과 페이지 이동을 관리한다.
const ReviewSection = ({ workId }: ReviewSectionProps) => {
  const [page, setPage] = useState(1);
  const data = reviewsByWork[workId]?.[page]?.data;
  const pagination = data?.pagination;

  const handlePrevClick = () => setPage((current) => current - 1);
  const handleNextClick = () => setPage((current) => current + 1);

  return (
    <section aria-label="감상평">
      <ReviewList reviews={data?.items ?? []} />
      {/* 감상평이 하나도 없으면 비활성 버튼만 남으므로 페이지네이션을 숨긴다. */}
      {pagination && pagination.totalPages > 0 && (
        <div className="mt-6">
          <ReviewPagination
            page={page}
            hasNext={pagination.hasNext}
            onPrev={handlePrevClick}
            onNext={handleNextClick}
          />
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
