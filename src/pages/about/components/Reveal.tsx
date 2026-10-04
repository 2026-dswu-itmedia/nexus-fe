import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  // 같은 묶음 안에서 순서대로 떠오르게 할 때의 지연(초)
  delay?: number;
}

// 뷰포트에 들어올 때 아래에서 살짝 떠오르며 나타난다. 한 번 보인 뒤에는 다시 숨기지 않는다.
// OS의 "동작 줄이기" 설정이 켜져 있으면 애니메이션 없이 바로 보여준다.
const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
