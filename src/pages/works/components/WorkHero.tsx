import { getWorkInstagramUrl } from '@/pages/works/constants/instagramLinks';
import GoLinkIcon from '@/shared/assets/icons/ic-go-link-24.svg?react';
import LocationIcon from '@/shared/assets/icons/ic-location-24.svg?react';
import KeywordChip from '@/shared/components/KeywordChip';
import SkeletonImage from '@/shared/components/SkeletonImage';
import TeamBadge from '@/shared/components/TeamBadge';
import type { Work } from '@/shared/types/exhibition';
import { getTeamById } from '@/shared/utils/exhibition';
import { getWorkImage } from '@/shared/utils/image';
import { Link } from 'react-router-dom';

interface WorkHeroProps {
  work: Work;
}

const WorkHero = ({ work }: WorkHeroProps) => {
  const imageUrl = getWorkImage(work.image);
  const teamName = getTeamById(work.teamId)?.name ?? work.teamId;

  return (
    <section>
      <SkeletonImage
        src={imageUrl}
        alt={`${work.title} 대표 이미지`}
        loading="eager"
        className="aspect-3/2 w-full"
      />
      <div className="mt-9 flex items-center gap-1">
        <h1 className="text-semibold-24 text-black">{work.title}</h1>
        {/* MAP이 이 작품이 있는 부스(와 내부 자리)를 미리 선택하도록 작품 ID를 쿼리로 넘긴다(docs/ia.md). */}
        <Link
          to={`/map?work=${encodeURIComponent(work.id)}`}
          viewTransition
          aria-label="부스 위치 보기"
          className="text-subtext-900 shrink-0"
        >
          <LocationIcon className="size-6" aria-hidden="true" />
        </Link>
        {/* 작품별 인스타그램 카드뉴스. 외부 이동이므로 <a>를 쓴다. */}
        <a
          href={getWorkInstagramUrl(work.id)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="인스타그램 카드뉴스 보기"
          className="text-subtext-900 shrink-0"
        >
          <GoLinkIcon className="size-6" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-1">
        <TeamBadge name={teamName} />
      </div>
      <p className="text-regular-14 text-subtext-500 mt-4 whitespace-pre-line">{work.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1" aria-label="키워드">
        {work.keywords.map((keyword) => (
          <li key={keyword}>
            <KeywordChip label={keyword} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WorkHero;
