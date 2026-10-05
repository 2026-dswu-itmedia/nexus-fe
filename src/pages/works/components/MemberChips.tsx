import { getStudentsByIds } from '@/shared/utils/exhibition';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemberChipsProps {
  memberIds: string[];
}

const MemberChips = ({ memberIds }: MemberChipsProps) => {
  const members = getStudentsByIds(memberIds);

  return (
    <ul className="flex flex-wrap gap-1" aria-label="팀원">
      {members.map((member) => (
        <li key={member.id}>
          <Link
            to={`/students/${member.id}`}
            viewTransition
            className="bg-navy-010 text-regular-14 text-navy-100 flex items-center gap-1 px-2 py-1"
          >
            {member.name}
            <ChevronRight className="text-subtext-700 size-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MemberChips;
