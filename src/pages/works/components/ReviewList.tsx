import type { Review } from '@/pages/works/types/review';
import { LoaderCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';

// 시안의 메모지 순서(좌상단부터 행 우선): 핑크(+1.5°) → 노랑(-2°) → 초록(-1.5°) → 주황(+2°). 각도는 Figma 값.
const MEMO_STYLES = [
  'bg-pink-bg rotate-[1.5deg]',
  'bg-yellow-bg -rotate-2',
  'bg-green-bg -rotate-[1.5deg]',
  'bg-orange-bg rotate-2',
] as const;

const MEMO_CLASS = 'h-42.5 p-4';
const CONTENT_CLASS =
  'text-regular-14 scrollbar-hide h-full overflow-y-auto break-words whitespace-pre-line text-black';
const MESSAGE_CLASS = 'text-regular-14 text-subtext-700 py-10 text-center';

// 메모지 하나당 벌어지는 간격(초). 8개가 0.5초 안에 차례로 붙는다.
const MEMO_STAGGER = 0.07;

// 메모지 높이를 넘는 감상평은 메모지 안에서 스크롤한다(스크롤바는 숨김).
// 아래에 더 읽을 내용이 남아 있을 때만 하단을 흐리게 해 스크롤할 수 있음을 알린다.
// 메모지 배경색이 여러 가지라 그라디언트 오버레이 대신 mask로 글자 자체를 흐린다.
const ReviewMemoContent = ({ content }: { content: string }) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isFadeVisible, setIsFadeVisible] = useState(false);

  const updateFade = () => {
    const element = contentRef.current;
    if (!element) return;
    // 소수점 픽셀 오차로 끝까지 내려도 흐림이 남지 않도록 1px 여유를 둔다.
    setIsFadeVisible(element.scrollHeight - element.clientHeight - element.scrollTop > 1);
  };

  useLayoutEffect(updateFade, [content]);

  return (
    <p
      ref={contentRef}
      onScroll={updateFade}
      className={`${CONTENT_CLASS} ${isFadeVisible ? 'mask-b-from-70%' : ''}`}
    >
      {content}
    </p>
  );
};

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
              <ReviewMemoContent content={review.content} />
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
            <ReviewMemoContent content={review.content} />
          </motion.li>
        );
      })}
    </ul>
  );
};

export default ReviewList;
