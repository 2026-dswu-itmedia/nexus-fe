import SymbolDecor from '@/shared/assets/icons/symbol-decor.svg?react';

interface TeamBadgeProps {
  name: string;
}

const TeamBadge = ({ name }: TeamBadgeProps) => {
  return (
    <span className="text-regular-14 text-navy-075 inline-flex items-center gap-1.5">
      <SymbolDecor className="h-3 w-auto shrink-0" aria-hidden="true" />
      {name}
    </span>
  );
};

export default TeamBadge;
