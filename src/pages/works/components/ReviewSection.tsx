import ReviewForm from '@/pages/works/components/ReviewForm';
import ReviewList from '@/pages/works/components/ReviewList';
import ReviewPagination from '@/pages/works/components/ReviewPagination';
import useReviews from '@/pages/works/hooks/useReviews';
import { useState } from 'react';

interface ReviewSectionProps {
  workId: string;
}

// 감상평 입력 → 목록 → 페이지 이동을 한 묶음으로 관리한다. 작성에 성공하면 1페이지로 돌아간다.
const ReviewSection = ({ workId }: ReviewSectionProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReviews(workId, page);
  const pagination = data?.pagination;

  const handlePrevClick = () => setPage((current) => current - 1);
  const handleNextClick = () => setPage((current) => current + 1);

  return (
    <section aria-label="감상평">
      <ReviewForm workId={workId} onPosted={() => setPage(1)} />
      <div className="mt-6">
        <ReviewList reviews={data?.items ?? []} isLoading={isLoading} isError={isError} />
      </div>
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
