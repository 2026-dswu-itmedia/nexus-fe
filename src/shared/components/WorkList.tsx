import WorkListItem from '@/shared/components/WorkListItem';
import { FADE_TRANSITION, ROW_STAGGER } from '@/shared/constants/motion';
import useIsViewTransitioning from '@/shared/hooks/useIsViewTransitioning';
import useSkipEntranceMotion from '@/shared/hooks/useSkipEntranceMotion';
import type { Work } from '@/shared/types/exhibition';
import { motion } from 'motion/react';

interface WorkListProps {
  works: Work[];
  emptyMessage: string;
  className?: string;
}

// WORKS 목록과 MAP 하단 목록이 함께 쓰는 작품 목록. 마운트될 때 행이 순서대로 떠오르므로,
// 필터·선택이 바뀔 때 다시 올라오게 하려면 호출부에서 key를 그 값으로 준다.
// 페이지 전환 슬라이드 중에는 숨긴 채로 기다렸다가 슬라이드가 끝난 뒤 올라온다(useIsViewTransitioning).
const WorkList = ({ works, emptyMessage, className }: WorkListProps) => {
  const shouldSkipEntrance = useSkipEntranceMotion();
  const isViewTransitioning = useIsViewTransitioning();

  return (
    <>
      <ul className={className}>
        {works.map((work, index) =>
          shouldSkipEntrance ? (
            <li key={work.id}>
              <WorkListItem work={work} />
            </li>
          ) : (
            <motion.li
              key={work.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isViewTransitioning ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
              transition={{ ...FADE_TRANSITION, delay: index * ROW_STAGGER }}
            >
              <WorkListItem work={work} />
            </motion.li>
          ),
        )}
      </ul>
      {works.length === 0 && (
        <motion.p
          initial={shouldSkipEntrance ? false : { opacity: 0 }}
          animate={{ opacity: !shouldSkipEntrance && isViewTransitioning ? 0 : 1 }}
          transition={FADE_TRANSITION}
          className="text-regular-14 text-subtext-700 py-10 text-center"
        >
          {emptyMessage}
        </motion.p>
      )}
    </>
  );
};

export default WorkList;
