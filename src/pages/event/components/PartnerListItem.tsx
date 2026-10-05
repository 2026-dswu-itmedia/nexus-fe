import type { Partner } from '@/pages/event/types/event';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

interface PartnerListItemProps {
  partner: Partner;
}

// 흰 카드: 매장 아이콘 + 이름 + chevron. 쿠폰이 없으면 상세에서 /event/partner로 돌려보낸다.
const PartnerListItem = ({ partner }: PartnerListItemProps) => {
  return (
    <MotionLink
      to={`/event/partner/${partner.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className="bg-white-100 border-border shadow-card flex items-center gap-4 border px-4 py-4"
    >
      <img src={partner.icon} alt="" className="size-8 shrink-0" />
      <span className="text-semibold-16 text-subtext-500 min-w-0 flex-1 truncate">
        {partner.name}
      </span>
      <ChevronRight className="text-subtext-700 size-6 shrink-0" aria-hidden="true" />
    </MotionLink>
  );
};

export default PartnerListItem;
