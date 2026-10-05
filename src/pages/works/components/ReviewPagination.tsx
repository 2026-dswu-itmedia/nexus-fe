import { ChevronLeft, ChevronRight } from 'lucide-react';

const BUTTON_CLASS =
  'bg-navy-100 text-white-100 disabled:bg-navy-010 disabled:text-subtext-900 flex size-12 items-center justify-center';

interface ReviewPaginationProps {
  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const ReviewPagination = ({ page, hasNext, onPrev, onNext }: ReviewPaginationProps) => {
  return (
    <nav aria-label="감상평 페이지" className="flex justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="이전 감상평"
        className={BUTTON_CLASS}
      >
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="다음 감상평"
        className={BUTTON_CLASS}
      >
        <ChevronRight className="size-6" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default ReviewPagination;
