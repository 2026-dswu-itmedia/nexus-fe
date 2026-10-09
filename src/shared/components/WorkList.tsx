import WorkListItem from '@/shared/components/WorkListItem';
import { FADE_TRANSITION, ROW_STAGGER } from '@/shared/constants/motion';
import type { Work } from '@/shared/types/exhibition';
import { motion, useReducedMotion } from 'motion/react';

interface WorkListProps {
  works: Work[];
  emptyMessage: string;
  className?: string;
}

// WORKS 목록과 MAP 하단 목록이 함께 쓰는 작품 목록. 마운트될 때 행이 순서대로 떠오르므로,
// 필터·선택이 바뀔 때 다시 올라오게 하려면 호출부에서 key를 그 값으로 준다.
const WorkList = ({ works, emptyMessage, className }: WorkListProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <ul className={className}>
        {works.map((work, index) =>
          shouldReduceMotion ? (
            <li key={work.id}>
              <WorkListItem work={work} />
            </li>
          ) : (
            <motion.li
              key={work.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...FADE_TRANSITION, delay: index * ROW_STAGGER }}
            >
              <WorkListItem work={work} />
            </motion.li>
          ),
        )}
      </ul>
      {works.length === 0 && (
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
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
