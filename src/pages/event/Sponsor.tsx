import SponsorSection from '@/pages/event/components/SponsorSection';

// EVENT 홈의 SPONSOR 영역과 같은 내용을 단독 페이지로 보여준다.
const Sponsor = () => {
  return (
    <div className="flex flex-1 flex-col pt-10 pb-10">
      <SponsorSection />
    </div>
  );
};

export default Sponsor;
