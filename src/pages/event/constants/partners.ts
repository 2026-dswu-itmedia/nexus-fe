import type { Partner } from '@/pages/event/types/event';
import berryberryCoupon from '@/shared/assets/images/partners/img-coupon-berryberry-bakery.png';
import jewelCoupon from '@/shared/assets/images/partners/img-coupon-jewel-changdong.png';
import osushiCoupon from '@/shared/assets/images/partners/img-coupon-osushi-changdong.png';
import croissantIcon from '@/shared/assets/images/partners/img-partner-1.svg';
import sushiIcon from '@/shared/assets/images/partners/img-partner-2.svg';
import scissorsIcon from '@/shared/assets/images/partners/img-partner-3.svg';

// 매장별 지도 URL은 확인 전이라 네이버 지도 검색 결과로 연결한다(docs/work-plan.md 확인 필요).
const getNaverMapSearchUrl = (keyword: string) =>
  `https://map.naver.com/p/search/${encodeURIComponent(keyword)}`;

// 혜택·사용 안내 문구는 시안(Partner] 제휴사 상세 - *.png) 기준. 쥬얼창동만 "1회 사용 가능"이다.
export const PARTNERS: Partner[] = [
  {
    id: 'berryberry-bakery',
    name: '베리베리베이커리',
    icon: croissantIcon,
    benefit: '전메뉴 5% 할인',
    usageNote: '1일 1회 사용 가능',
    mapUrl: getNaverMapSearchUrl('베리베리베이커리 창동'),
    couponImage: berryberryCoupon,
    couponExpiresAt: '2026-11-06T23:59:59+09:00',
  },
  {
    id: 'jewel-changdong',
    name: '쥬얼창동',
    icon: scissorsIcon,
    benefit: '전시술 20% 할인',
    usageNote: '1회 사용 가능',
    mapUrl: getNaverMapSearchUrl('쥬얼 창동'),
    couponImage: jewelCoupon,
    couponExpiresAt: '2026-11-20T23:59:59+09:00',
  },
  {
    id: 'osushi-changdong',
    name: '오스시 창동씨드큐브점',
    icon: sushiIcon,
    benefit: '회전초밥 10% 할인',
    usageNote: '1일 1회 사용 가능',
    mapUrl: getNaverMapSearchUrl('오스시 창동씨드큐브점'),
    couponImage: osushiCoupon,
    couponExpiresAt: '2026-11-06T23:59:59+09:00',
  },
];

export const getPartnerById = (id: string) => PARTNERS.find((partner) => partner.id === id);
