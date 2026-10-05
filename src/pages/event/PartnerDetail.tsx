import CouponCard from '@/pages/event/components/CouponCard';
import { getPartnerById } from '@/pages/event/constants/partners';
import useMyCoupon from '@/pages/event/hooks/useMyCoupon';
import { getSubjectParticle } from '@/pages/event/utils/particle';
import { saveCouponImage } from '@/pages/event/utils/saveCouponImage';
import DownloadIcon from '@/shared/assets/icons/ic-download-16.svg?react';
import LocationIcon from '@/shared/assets/icons/ic-location-24.svg?react';
import eventGraphic from '@/shared/assets/images/graphic/img-event-graphic.svg';
import BackHeader from '@/shared/components/BackHeader';
import Button from '@/shared/components/Button';
import LinkRow from '@/shared/components/LinkRow';
import NotFound from '@/shared/components/NotFound';
import PageFallback from '@/shared/components/PageFallback';
import Reveal from '@/shared/components/Reveal';
import { useParams } from 'react-router-dom';

// 네이비 배경(DetailLayout dark). 시안 측정값: 헤더 아래 20px, 라벨→제목 12px, 제목→링크 24px,
// 링크→캐릭터 40px, 캐릭터(168×131)→안내 40px, 안내→쿠폰 카드 16px, 카드→주의 문구 16px, 저장 버튼은 바닥에서 20px.
// 캐릭터 뒤의 은은한 빛은 시안에서 중심(가로 중앙, 위에서 330px) 흰색 16%에서 반지름 약 230px까지 옅어진다.
const PartnerDetail = () => {
  const { partnerId = '' } = useParams<{ partnerId: string }>();
  const partner = getPartnerById(partnerId);
  const { data: coupon, isLoading } = useMyCoupon();

  if (!partner) {
    // NotFound는 자체 px-5를 가지므로 DetailLayout main의 px-5와 겹치지 않게 상쇄한다.
    return (
      <div className="-mx-5 flex flex-1 flex-col">
        <NotFound />
      </div>
    );
  }

  if (isLoading) {
    return <PageFallback />;
  }

  // 쿠폰이 없으면(미발급·조회 실패) 카드를 흐리게 잠그고 QR 안내 페이지로 보내는 버튼을 보여준다.
  const issuedCoupon = coupon ?? null;

  const handleSaveClick = () => {
    void saveCouponImage(partner.couponImage, `nexus-coupon-${partner.id}.png`);
  };

  return (
    <div className="-mx-5 flex flex-1 flex-col bg-[radial-gradient(14rem_circle_at_50%_20.625rem,rgb(255_255_255/0.16),transparent)] px-5">
      <BackHeader variant="dark" title={partner.name} />
      <div className="flex flex-1 flex-col pt-5 pb-5">
        <Reveal className="text-center">
          <p className="text-regular-12 text-white-075">OFFICIAL PARTNER</p>
          <h2 className="text-semibold-20 text-white-100 mt-3">
            {partner.name}
            {getSubjectParticle(partner.name)}
            <br />
            NEX:US와 함께합니다
          </h2>
        </Reveal>
        <Reveal className="mt-6" delay={0.1}>
          <LinkRow
            variant="dark"
            href={partner.mapUrl}
            label="매장 위치 확인하기"
            icon={<LocationIcon className="size-6 shrink-0" aria-hidden="true" />}
          />
        </Reveal>
        <Reveal className="mt-10 flex justify-center" delay={0.2}>
          <img src={eventGraphic} alt="" className="w-42" />
        </Reveal>
        <Reveal className="mt-10" delay={0.3}>
          <p className="text-semibold-14 text-white-100 text-center">
            매장에 방문해
            <br />이 화면을 직원에게 보여주세요
          </p>
        </Reveal>
        <Reveal className="mt-4" delay={0.4}>
          <CouponCard partner={partner} coupon={issuedCoupon} />
        </Reveal>
        <p className="text-regular-12 text-white-075 mt-4 text-center">
          타 할인 혜택과 중복 적용 여부는 매장에 문의해 주세요
        </p>
        {issuedCoupon && (
          // 내용이 짧으면 화면 바닥에 붙고, 길면 주의 문구 아래 40px에서 흐른다.
          <div className="mt-auto pt-21">
            <Button
              variant="outline"
              onClick={handleSaveClick}
              icon={<DownloadIcon className="size-4" aria-hidden="true" />}
            >
              쿠폰을 이미지로 저장하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDetail;
