import { lazy } from 'react';

// 페이지는 lazy로 분리해 첫 로드 번들을 줄인다. Suspense는 각 레이아웃의 Outlet 둘레에 있다.
// router.tsx에 두면 컴포넌트와 router 객체가 한 파일에서 export되어 Fast Refresh 규칙에 걸리므로 분리했다.
export const About = lazy(() => import('@/pages/about/About'));
export const Works = lazy(() => import('@/pages/works/Works'));
export const WorkDetail = lazy(() => import('@/pages/works/WorkDetail'));
export const Students = lazy(() => import('@/pages/students/Students'));
export const StudentDetail = lazy(() => import('@/pages/students/StudentDetail'));
export const Map = lazy(() => import('@/pages/map/Map'));
export const Event = lazy(() => import('@/pages/event/Event'));
export const Sponsor = lazy(() => import('@/pages/event/Sponsor'));
export const SponsorDetail = lazy(() => import('@/pages/event/SponsorDetail'));
export const Partner = lazy(() => import('@/pages/event/Partner'));
export const PartnerDetail = lazy(() => import('@/pages/event/PartnerDetail'));
