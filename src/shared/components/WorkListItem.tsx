import MotionLink from '@/shared/components/MotionLink';
import SkeletonImage from '@/shared/components/SkeletonImage';
import type { Work } from '@/shared/types/exhibition';
import { getStudentsByIds } from '@/shared/utils/exhibition';
import { getWorkImage } from '@/shared/utils/image';
import { ChevronRight } from 'lucide-react';

interface WorkListItemProps {
  work: Work;
}

const WorkListItem = ({ work }: WorkListItemProps) => {
  const imageUrl = getWorkImage(work.image);
  const memberNames = getStudentsByIds(work.memberIds)
    .map(({ name }) => name)
    .join(' ');

  return (
    <MotionLink
      to={`/works/${work.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 py-3"
    >
      <SkeletonImage src={imageUrl} alt="" className="h-[2.8125rem] w-[4.25rem] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-semibold-16 truncate text-black">{work.title}</p>
        <p className="text-regular-14 text-subtext-700 mt-1 truncate">{memberNames}</p>
      </div>
      <ChevronRight className="text-subtext-900 size-6 shrink-0" aria-hidden="true" />
    </MotionLink>
  );
};

export default WorkListItem;
