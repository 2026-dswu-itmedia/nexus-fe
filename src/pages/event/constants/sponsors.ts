import type { Sponsor } from '@/pages/event/types/event';
import cheremimakaLogo from '@/shared/assets/images/partners/img-cheremimaka-logo.svg';
import cheremimakaProduct1 from '@/shared/assets/images/partners/img-cheremimarker-1.png';
import inclearProduct1 from '@/shared/assets/images/partners/img-inclear-1.png';
import inclearProduct2 from '@/shared/assets/images/partners/img-inclear-2.png';
import inclearLogo from '@/shared/assets/images/partners/img-inclear-logo.svg';
import innergarmProduct1 from '@/shared/assets/images/partners/img-innergarm-1.png';
import innergarmProduct2 from '@/shared/assets/images/partners/img-innergarm-2.png';
import innergarmLogo from '@/shared/assets/images/partners/img-innergarm-logo.svg';

// 소개문·물품명은 시안(Sponsor] 협찬사 상세 - *.png) 기준.
// 인클리어 카카오톡 채널("인클리어하자!!")의 공개 URL은 확인 전이라 카카오톡 스토어로 임시 연결한다(docs/work-plan.md 확인 필요).
export const SPONSORS: Sponsor[] = [
  {
    id: 'inclear',
    name: '인클리어',
    logo: inclearLogo,
    link: { label: '인클리어하자!!', url: 'https://pf.kakao.com/_zxmgVK', icon: 'kakao' },
    description:
      '"여성 건강의 모든 것"\n속과 겉을 모두 케어하는\n토탈 페미닌 케어 전문브랜드 \'인클리어\'',
    productTitles: ['여성청결티슈 3매입'],
    productImages: [inclearProduct1, inclearProduct2],
  },
  {
    id: 'innergarm',
    name: '이너감',
    logo: innergarmLogo,
    link: {
      label: 'innergarm_official',
      url: 'https://www.instagram.com/innergarm_official/',
      icon: 'instagram',
    },
    description:
      '"지치고 예민해진 Y존에 깊은 휴식을"\n수분 보습부터 장벽 강화까지\n프리미엄 Y존 보습·보호 케어 전문브랜드 \'이너감\'',
    productTitles: ['메디 이너밸런싱젤 6p', '비건 페미닌 엔자임 파우더 워시 30p'],
    productImages: [innergarmProduct1, innergarmProduct2],
  },
  {
    id: 'cheremimaka',
    name: '체리미마카',
    logo: cheremimakaLogo,
    link: {
      label: 'cheremimaka',
      url: 'https://www.instagram.com/cheremimaka/',
      icon: 'instagram',
    },
    description:
      '"일상에 활력을 채우는 에너제틱 케어"\n활력 충전부터 건강한 일상 리듬까지\n페미닌 헬스&에너지 케어 전문브랜드 \'체리미마카\'',
    productTitles: ['생리컵 Mini / Small / Large'],
    productImages: [cheremimakaProduct1],
  },
];

export const getSponsorById = (id: string) => SPONSORS.find((sponsor) => sponsor.id === id);
