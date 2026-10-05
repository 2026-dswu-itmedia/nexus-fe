import MotionLink from '@/shared/components/MotionLink';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface CouponActionButtonProps {
  children: ReactNode;
  // 둘 중 하나만 넘긴다. to가 있으면 Link, 아니면 button.
  to?: string;
  onClick?: () => void;
}

// 쿠폰 카드 가운데에 올리는 160×44 네이비 버튼(시안 Brand=*, Status=Disabled 측정값).
// 미인증 상태의 "QR 스캔하러 가기"(Link)와 조회 실패 시 "다시 시도"(button)가 같은 모양을 쓴다.
const BUTTON_CLASS =
  'bg-navy-100 text-semibold-14 text-white-100 flex h-11 w-40 items-center justify-center gap-2';

const CouponActionButton = ({ children, to, onClick }: CouponActionButtonProps) => {
  const content = (
    <>
      {children}
      <ChevronRight className="size-4" aria-hidden="true" />
    </>
  );

  if (to) {
    return (
      <MotionLink to={to} viewTransition whileTap={{ scale: 0.97 }} className={BUTTON_CLASS}>
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={BUTTON_CLASS}
    >
      {content}
    </motion.button>
  );
};

export default CouponActionButton;
