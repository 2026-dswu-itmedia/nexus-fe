import { getSponsorById } from '@/pages/event/constants/sponsors';
import type { SponsorLinkIcon } from '@/pages/event/types/event';
import { getSubjectParticle } from '@/pages/event/utils/particle';
import LogoInstagram from '@/shared/assets/logos/logo-instagram-24.svg?react';
import LogoKakao from '@/shared/assets/logos/logo-kakao-24.svg?react';
import BackHeader from '@/shared/components/BackHeader';
import LinkRow from '@/shared/components/LinkRow';
import NotFound from '@/shared/components/NotFound';
import Reveal from '@/shared/components/Reveal';
import type { FC, SVGProps } from 'react';
import { useParams } from 'react-router-dom';

const LINK_ICONS: Record<SponsorLinkIcon, FC<SVGProps<SVGSVGElement>>> = {
  instagram: LogoInstagram,
  kakao: LogoKakao,
};

// 네이비 배경(DetailLayout dark). 시안 측정값: 헤더 아래 20px, 라벨→제목 12px, 제목→링크 24px,
// 링크→소개문 24px, 소개문→PRODUCT DETAIL 40px, 라벨→물품명 12px, 물품명→이미지 24px, 이미지 간격 20px.
const SponsorDetail = () => {
  const { sponsorId = '' } = useParams<{ sponsorId: string }>();
  const sponsor = getSponsorById(sponsorId);

  if (!sponsor) {
    // NotFound는 자체 px-5를 가지므로 DetailLayout main의 px-5와 겹치지 않게 상쇄한다.
    return (
      <div className="-mx-5 flex flex-1 flex-col">
        <NotFound />
      </div>
    );
  }

  const LinkIcon = LINK_ICONS[sponsor.link.icon];

  return (
    <>
      <BackHeader variant="dark" title={sponsor.name} />
      <div className="flex flex-1 flex-col pt-5 pb-5">
        <Reveal className="text-center">
          <p className="text-regular-12 text-white-075">OFFICIAL SPONSOR</p>
          <h2 className="text-semibold-20 text-white-100 mt-3">
            {sponsor.name}
            {getSubjectParticle(sponsor.name)}
            <br />
            NEX:US와 함께합니다
          </h2>
        </Reveal>
        <Reveal className="mt-6" delay={0.1}>
          <LinkRow
            variant="dark"
            href={sponsor.link.url}
            label={sponsor.link.label}
            icon={<LinkIcon className="size-6 shrink-0" aria-hidden="true" />}
          />
        </Reveal>
        <Reveal className="mt-6" delay={0.2}>
          <p className="text-regular-14 text-white-075 text-center whitespace-pre-line">
            {sponsor.description}
          </p>
        </Reveal>
        <Reveal className="mt-10 text-center" delay={0.3}>
          <p className="text-regular-12 text-white-075">PRODUCT DETAIL</p>
          <ul className="mt-3 flex flex-col gap-1">
            {sponsor.productTitles.map((title) => (
              <li key={title} className="text-semibold-20 text-white-100">
                {title}
              </li>
            ))}
          </ul>
        </Reveal>
        <ul className="mt-6 flex flex-col gap-5">
          {sponsor.productImages.map((src, index) => (
            <li key={src}>
              <Reveal delay={0.4 + index * 0.1}>
                <img
                  src={src}
                  alt={`${sponsor.name} 협찬 물품 이미지 ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="bg-white-050 aspect-square w-full object-cover"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SponsorDetail;
