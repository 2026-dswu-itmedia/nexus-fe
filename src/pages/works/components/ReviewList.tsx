import type { Review } from '@/pages/works/types/review';
import { LoaderCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

// 시안의 메모지 순서(좌상단부터 행 우선): 핑크(+1.5°) → 노랑(-2°) → 초록(-1.5°) → 주황(+2°). 각도는 Figma 값.
const MEMO_STYLES = [
  'bg-pink-bg rotate-[1.5deg]',
  'bg-yellow-bg -rotate-2',
  'bg-green-bg -rotate-[1.5deg]',
  'bg-orange-bg rotate-2',
] as const;

const MEMO_CLASS = 'min-h-42.5 p-4';
const CONTENT_CLASS = 'text-regular-14 line-clamp-6 whitespace-pre-line text-black';
const MESSAGE_CLASS = 'text-regular-14 text-subtext-700 py-10 text-center';

// 메모지 하나당 벌어지는 간격(초). 8개가 0.5초 안에 차례로 붙는다.
const MEMO_STAGGER = 0.07;

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
}

const ReviewList = ({ reviews, isLoading, isError }: ReviewListProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoaderCircle
          className="text-navy-100 size-6 animate-spin"
          aria-label="감상평 불러오는 중"
        />
      </div>
    );
  }

  if (isError) {
    return <p className={MESSAGE_CLASS}>감상평을 불러오지 못했습니다.</p>;
  }

  if (reviews.length === 0) {
    return <p className={MESSAGE_CLASS}>아직 감상평이 없어요. 첫 감상평을 남겨주세요</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-4">
      {reviews.map((review, index) => {
        const memoStyle = MEMO_STYLES[index % MEMO_STYLES.length];

        if (shouldReduceMotion) {
          return (
            <li key={review.id} className={`${memoStyle} ${MEMO_CLASS}`}>
              <p className={CONTENT_CLASS}>{review.content}</p>
            </li>
          );
        }

        // 메모지를 하나씩 붙이는 느낌: 살짝 아래·작게 시작해 제자리로 떠오른다.
        // 기울기는 Tailwind의 CSS rotate 속성이라 motion의 transform(translate·scale)과 겹치지 않는다.
        // 페이지를 넘기면 key가 바뀌어 새 메모지들이 다시 떠오른다.
        return (
          <motion.li
            key={review.id}
            className={`${memoStyle} ${MEMO_CLASS}`}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 8) * MEMO_STAGGER }}
          >
            <p className={CONTENT_CLASS}>{review.content}</p>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default ReviewList;
