import DescriptionTabs from '@/pages/works/components/DescriptionTabs';
import MemberChips from '@/pages/works/components/MemberChips';
import ReviewSection from '@/pages/works/components/ReviewSection';
import WorkHero from '@/pages/works/components/WorkHero';
import BackHeader from '@/shared/components/BackHeader';
import NotFound from '@/shared/components/NotFound';
import Reveal from '@/shared/components/Reveal';
import { getWorkById } from '@/shared/utils/exhibition';
import { useParams } from 'react-router-dom';

const WorkDetail = () => {
  const { workId = '' } = useParams<{ workId: string }>();
  const work = getWorkById(workId);

  if (!work) {
    // NotFound는 자체 px-5를 가지므로 DetailLayout main의 px-5와 겹치지 않게 상쇄한다.
    return (
      <div className="-mx-5 flex flex-1 flex-col">
        <NotFound />
      </div>
    );
  }

  // ABOUT과 같은 scroll reveal. 처음 보이는 섹션은 위에서부터 0.1초 간격으로 떠오른다.
  return (
    <>
      <BackHeader />
      <div className="flex flex-1 flex-col pt-5 pb-10">
        <Reveal>
          <WorkHero work={work} />
        </Reveal>
        <Reveal className="mt-4" delay={0.1}>
          <MemberChips memberIds={work.memberIds} />
        </Reveal>
        <Reveal className="mt-12" delay={0.2}>
          <DescriptionTabs description={work.description} purpose={work.purpose} />
        </Reveal>
        <Reveal className="mt-12" delay={0.3}>
          <ReviewSection workId={work.id} />
        </Reveal>
      </div>
    </>
  );
};

export default WorkDetail;
