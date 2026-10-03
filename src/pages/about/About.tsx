import Committee from '@/pages/about/components/Committee';
import HeroGraphic from '@/pages/about/components/HeroGraphic';
import Introduction from '@/pages/about/components/Introduction';
import LocationSection from '@/pages/about/components/LocationSection';
import QuickLinks from '@/pages/about/components/QuickLinks';
import ScheduleTable from '@/pages/about/components/ScheduleTable';
import FloatingActions from '@/pages/about/components/FloatingActions';
import Footer from '@/shared/components/Footer';

const About = () => {
  return (
    <>
      {/* 섹션 간격 80px. 키비주얼(5:7)은 GNB 아래 40px에서 시작해 시안의 그래픽 하단 위치와 맞는다. */}
      <div className="flex flex-1 flex-col gap-20 pt-10 pb-25">
        <HeroGraphic />
        <Introduction />
        <ScheduleTable />
        <LocationSection />
        <QuickLinks />
        <Committee />
      </div>
      {/* Footer는 ABOUT에만 있다(docs/ia.md). 다른 페이지에서는 렌더하지 않는다. */}
      <Footer />
      <FloatingActions />
    </>
  );
};

export default About;
