import PartnerListItem from '@/pages/event/components/PartnerListItem';
import SectionTitle from '@/pages/event/components/SectionTitle';
import SponsorSection from '@/pages/event/components/SponsorSection';
import { PARTNERS } from '@/pages/event/constants/partners';
import { getStackedCardClass } from '@/pages/event/utils/cardStack';
import Reveal from '@/shared/components/Reveal';

// 카드마다 순서대로 떠오르는 간격(초)
const CARD_STAGGER = 0.1;

// 시안([Event] Home.png) 측정값: GNB 아래 40px, 제목→설명 12px, 설명→카드 48px, 섹션 사이 72px.
const Event = () => {
  return (
    <div className="flex flex-1 flex-col gap-18 pt-10 pb-15">
      <SponsorSection />
      <section aria-label="제휴 매장">
        <SectionTitle
          title="PARTNER"
          subtitle="제휴 매장"
          description={'현장 QR을 스캔하고\n전시장 근처 매장에서 할인받으세요'}
          to="/event/partner"
        />
        <ul className="mt-10 flex flex-col gap-1">
          {PARTNERS.map((partner, index) => (
            <li key={partner.id} className={getStackedCardClass(index)}>
              <Reveal delay={index * CARD_STAGGER}>
                <PartnerListItem partner={partner} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Event;
