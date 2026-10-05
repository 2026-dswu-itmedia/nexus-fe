import SkeletonImage from '@/shared/components/SkeletonImage';
import TeamBadge from '@/shared/components/TeamBadge';
import type { Student } from '@/shared/types/exhibition';
import { getTeamById } from '@/shared/utils/exhibition';
import { getStudentImage } from '@/shared/utils/image';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

// WorkListItem과 같은 눌림 피드백(행 전체 0.98배 축소).
const MotionLink = motion.create(Link);

interface StudentListItemProps {
  student: Student;
}

const StudentListItem = ({ student }: StudentListItemProps) => {
  const imageUrl = getStudentImage(student.image);
  const teamName = getTeamById(student.teamId)?.name ?? student.teamId;

  return (
    <MotionLink
      to={`/students/${student.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 py-3"
    >
      <SkeletonImage src={imageUrl} alt="" className="h-25 w-17 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-semibold-16 text-navy-100 truncate">{student.name}</p>
        <div className="mt-1">
          <TeamBadge name={teamName} />
        </div>
      </div>
      <ChevronRight className="text-subtext-900 size-6 shrink-0" aria-hidden="true" />
    </MotionLink>
  );
};

export default StudentListItem;
