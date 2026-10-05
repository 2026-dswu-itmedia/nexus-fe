import SectionTitle from '@/pages/event/components/SectionTitle';
import SponsorListItem from '@/pages/event/components/SponsorListItem';
import { SPONSORS } from '@/pages/event/constants/sponsors';
import { getStackedCardClass } from '@/pages/event/utils/cardStack';
import Reveal from '@/shared/components/Reveal';

// 카드마다 순서대로 떠오르는 간격(초)
const CARD_STAGGER = 0.1;

// EVENT 홈과 /event/sponsor가 같은 SPONSOR 영역을 보여준다(docs/work-plan.md 1장).
const SponsorSection = () => {
  return (
    <section aria-label="협찬사">
      <SectionTitle
        title="SPONSOR"
        subtitle="협찬 물품"
        description={'협찬 부스 이벤트에 참여하면 선물을 드려요\n(수량 소진 시 종료)'}
      />
      <ul className="mt-10 flex flex-col gap-1">
        {SPONSORS.map((sponsor, index) => (
          <li key={sponsor.id} className={getStackedCardClass(index)}>
            <Reveal delay={index * CARD_STAGGER}>
              <SponsorListItem sponsor={sponsor} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SponsorSection;
