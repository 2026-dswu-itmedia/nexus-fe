// 협찬사·제휴사는 아직 JSON에 없어 프론트 상수로 관리한다(docs/work-plan.md 결정 기록 2026-10-03).
export type SponsorLinkIcon = 'instagram' | 'kakao';

export interface SponsorLink {
  label: string;
  url: string;
  icon: SponsorLinkIcon;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string; // 목록 카드 가운데에 들어가는 로고 이미지 URL
  link: SponsorLink;
  description: string; // 상세 인용 소개문. 줄바꿈 \n 포함
  productTitles: string[]; // 협찬 물품명. 여러 개면 한 줄씩 나열
  productImages: string[]; // 제품 이미지 URL. 세로로 나열
}

export interface Partner {
  id: string;
  name: string;
  icon: string; // 매장 아이콘 이미지 URL
  benefit: string; // 예: "전메뉴 5% 할인"
  usageNote: string; // 쿠폰 카드 우측 하단 안내. 예: "1일 1회 사용 가능"
  mapUrl: string; // 매장 위치 외부 링크
  couponImage: string; // "쿠폰을 이미지로 저장하기"로 내려받는 매장별 쿠폰 이미지 URL
  // 매장별 쿠폰 사용 기한(한국시간 그날 끝). 서버 쿠폰은 방문자당 1장이라 expiresAt이 매장 구분 없이 같아 프론트에서 관리한다.
  couponExpiresAt: string;
}
