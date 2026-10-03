import type {
  CommitteeMember,
  QuickLink,
  ScheduleRow,
  TextSegment,
} from '@/pages/about/types/about';

export const INTRO_PARAGRAPHS: TextSegment[][] = [
  [
    { text: 'IT 미디어공학전공', bold: true },
    {
      text: '은 융합적 사고와 창의적 기술력을 바탕으로 미래 IT 산업을 선도할 여성 인재를 양성하고 있습니다. 4년간의 치열한 학문적 여정과 공학적 탐구의 결실을 담은 ',
    },
    { text: '제14회 졸업전시회 NEX:US', bold: true },
    { text: '가 그 화려한 막을 올립니다.' },
  ],
  [
    { text: '이번 전시 타이틀 ' },
    { text: 'NEX:US', bold: true },
    {
      text: "는 데이터의 결합이자 중심점을 뜻하는 'NEXUS' 와 우리를 나타내는 'US' 의 합성어로, 흩어져 있던 우리의 노력들이 하나의 거대한 결과물의 집합체로 연결되었음을 의미합니다. ‘보이지 않는 연결을 그리다’라는 슬로건 아래 개최되는 이번 전시회는 단순한 작품의 나열을 넘어, 기술과 인간, 그리고 무한한 공간을 잇는 새로운 가능성을 제시합니다.",
    },
  ],
  [
    { text: '인공지능 AI와 데이터 기술', bold: true },
    { text: '을 융합한 지능형 시스템, 가상과 현실을 넘나드는 ' },
    { text: 'XR 콘텐츠', bold: true },
    { text: ', 실용적인 ' },
    { text: '웹/앱 플랫폼', bold: true },
    { text: '부터 사용자 중심의 혁신적인 ' },
    { text: 'UI/UX 디자인', bold: true },
    { text: '까지 최신 기술 트렌드를 집약한 다채로운 결과물들을 선보입니다.' },
  ],
  [
    {
      text: '하나의 작은 아이디어에서 시작된 우리의 논리가 마침내 세상을 향해 무한히 확장되어 나아가는 눈부신 순간에 함께하시기 바랍니다. 이는 단순한 전시를 넘어, ',
    },
    { text: '차세대 IT 기술과 예술이 융합된 새로운 가능성', bold: true },
    {
      text: '을 마주하는 자리가 될 것입니다. 미래 IT 산업을 이끌어갈 전공생들의 앞날을 격려해 주시기 바랍니다.',
    },
  ],
];

export const SCHEDULE: ScheduleRow[] = [
  { date: '26.11.04 (수)', time: '10:00 - 17:00' },
  { date: '26.11.05 (목)', time: '10:00 - 17:00' },
  { date: '26.11.06 (금)', time: '10:00 - 14:00' },
];

export const ADDRESS_LINES = ['서울 도봉구 마들로 13길 84', '서울창업허브 창동 B1'];

// 서울창업허브 창동(창동 아우르네) 좌표. 네이버 지도 중심·마커 위치로 쓴다.
export const EXHIBITION_LOCATION = { lat: 37.655211, lng: 127.048241 };

export const QUICK_LINKS: QuickLink[] = [
  {
    label: '덕성여자대학교 IT미디어공학전공',
    url: 'https://www.duksung.ac.kr/itmedia/main.do',
    icon: 'duksung',
  },
  {
    label: 'dswu_itmedia_26',
    url: 'https://www.instagram.com/dswu_itmedia_26/',
    icon: 'instagram',
  },
];

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  { role: '위원장', name: '목소연' },
  { role: '부위원장', name: '안유빈' },
  { role: '부위원장', name: '이채진' },
];
