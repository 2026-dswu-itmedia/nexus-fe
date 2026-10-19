import type { Student } from '@/shared/types/exhibition';
import { getStudentsByIds } from '@/shared/utils/exhibition';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemberChipsProps {
  memberIds: string[];
}

// 이 인원 이상이면 한 줄에 다 들어가지 않으므로 마지막 2명을 묶어 함께 줄바꿈한다(Figma: 4/1이 아닌 3/2 배치).
const GROUP_TRAILING_PAIR_FROM = 5;

const MemberChip = ({ member }: { member: Student }) => (
  <Link
    to={`/students/${member.id}`}
    viewTransition
    className="bg-navy-010 text-regular-14 text-navy-100 flex items-center gap-1 px-2 py-1"
  >
    {member.name}
    <ChevronRight className="text-subtext-700 size-4" aria-hidden="true" />
  </Link>
);

const MemberChips = ({ memberIds }: MemberChipsProps) => {
  const members = getStudentsByIds(memberIds);
  const shouldGroupTrailingPair = members.length >= GROUP_TRAILING_PAIR_FROM;
  const leadingMembers = shouldGroupTrailingPair ? members.slice(0, -2) : members;
  const trailingPair = shouldGroupTrailingPair ? members.slice(-2) : [];

  return (
    <ul className="flex flex-wrap gap-1" aria-label="팀원">
      {leadingMembers.map((member) => (
        <li key={member.id}>
          <MemberChip member={member} />
        </li>
      ))}
      {/* ul의 자식은 li여야 하므로 묶음은 li 안의 중첩 ul로 둔다. 줄바꿈되지 않는 flex라 둘이 항상 같은 줄에 선다. */}
      {trailingPair.length > 0 && (
        <li>
          <ul className="flex gap-1">
            {trailingPair.map((member) => (
              <li key={member.id}>
                <MemberChip member={member} />
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  );
};

export default MemberChips;
