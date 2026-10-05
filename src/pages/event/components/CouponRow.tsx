import type { Partner } from '@/pages/event/types/event';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

interface CouponRowProps {
  partner: Partner;
  // QR 인증 전에는 누를 수 없는 행으로, 인증 후에는 상세로 가는 링크로 보여준다. 모양은 같다(아이콘 + 매장명 + 혜택 + chevron).
  isEnabled: boolean;
}

const ROW_CLASS = 'flex items-center gap-4 py-4';

const CouponRow = ({ partner, isEnabled }: CouponRowProps) => {
  const content = (
    <>
      <img src={partner.icon} alt="" className="size-8 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="text-semibold-16 block truncate text-black">{partner.name}</span>
        <span className="text-regular-14 text-subtext-500 mt-1 block truncate">
          {partner.benefit}
        </span>
      </span>
      <ChevronRight className="text-subtext-700 size-6 shrink-0" aria-hidden="true" />
    </>
  );

  if (!isEnabled) {
    return <div className={ROW_CLASS}>{content}</div>;
  }

  return (
    <MotionLink
      to={`/event/partner/${partner.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className={ROW_CLASS}
    >
      {content}
    </MotionLink>
  );
};

export default CouponRow;
