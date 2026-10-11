import useIsViewTransitioning from '@/shared/hooks/useIsViewTransitioning';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  // 같은 묶음 안에서 순서대로 떠오르게 할 때의 지연(초)
  delay?: number;
}

const HIDDEN = { opacity: 0, y: 24 };
const SHOWN = { opacity: 1, y: 0 };

// 뷰포트에 들어올 때 아래에서 살짝 떠오르며 나타난다. 한 번 보인 뒤에는 다시 숨기지 않는다.
// OS의 "동작 줄이기" 설정이 켜져 있으면 애니메이션 없이 바로 보여준다.
// 페이지 전환 슬라이드 중에는 숨긴 채로 기다렸다가 슬라이드가 끝난 뒤 떠오른다(둘이 겹치면 모바일에서 두 번 나타나 보인다).
const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const isViewTransitioning = useIsViewTransitioning();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={HIDDEN}
      animate={isInView && !isViewTransitioning ? SHOWN : HIDDEN}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
