import type { Sponsor } from '@/pages/event/types/event';
import MotionLink from '@/shared/components/MotionLink';
import { ChevronRight } from 'lucide-react';

interface SponsorListItemProps {
  sponsor: Sponsor;
}

// 흰 카드: 좌 이름 + 남는 공간 가운데 로고 + 우 chevron. 기울기·겹침은 부모 li가 맡는다(utils/cardStack.ts).
const SponsorListItem = ({ sponsor }: SponsorListItemProps) => {
  return (
    <MotionLink
      to={`/event/sponsor/${sponsor.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className="bg-white-100 border-border shadow-card flex items-center gap-4 border px-4 py-5"
    >
      <span className="text-semibold-16 text-subtext-500 shrink-0">{sponsor.name}</span>
      <span className="flex min-h-6 min-w-0 flex-1 items-center justify-center">
        <img src={sponsor.logo} alt={`${sponsor.name} 로고`} className="max-h-6 max-w-full" />
      </span>
      <ChevronRight className="text-subtext-700 size-6 shrink-0" aria-hidden="true" />
    </MotionLink>
  );
};

export default SponsorListItem;
