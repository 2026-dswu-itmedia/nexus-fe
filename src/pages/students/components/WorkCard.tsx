import KeywordChip from '@/shared/components/KeywordChip';
import MotionLink from '@/shared/components/MotionLink';
import SkeletonImage from '@/shared/components/SkeletonImage';
import type { Work } from '@/shared/types/exhibition';
import { getWorkImage } from '@/shared/utils/image';

interface WorkCardProps {
  work: Work;
}

// 학생 상세의 참여 작품 카드. 누르면 WORKS 상세로 이동한다.
const WorkCard = ({ work }: WorkCardProps) => {
  const imageUrl = getWorkImage(work.image);

  return (
    <MotionLink
      to={`/works/${work.id}`}
      viewTransition
      whileTap={{ scale: 0.98 }}
      className="bg-white-100 border-border block border p-5"
    >
      <SkeletonImage
        src={imageUrl}
        alt={`${work.title} 대표 이미지`}
        className="aspect-3/2 w-full"
      />
      <p className="text-semibold-16 mt-6 text-black">{work.title}</p>
      <p className="text-regular-14 text-subtext-500 mt-2 whitespace-pre-line">{work.summary}</p>
      <ul className="mt-2 flex flex-wrap gap-1" aria-label="키워드">
        {work.keywords.map((keyword) => (
          <li key={keyword}>
            <KeywordChip label={keyword} />
          </li>
        ))}
      </ul>
    </MotionLink>
  );
};

export default WorkCard;
