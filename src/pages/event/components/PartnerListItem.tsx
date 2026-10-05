import type { Partner } from '@/pages/event/types/event';
import MotionLink from '@/shared/components/MotionLink';
import { ChevronRight } from 'lucide-react';

interface PartnerListItemProps {
  partner: Partner;
}

// 흰 카드: 매장 아이콘 + 이름 + chevron. QR 미인증이면 상세의 쿠폰 카드가 잠기고 /event/partner로 안내하는 버튼이 보인다.
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
