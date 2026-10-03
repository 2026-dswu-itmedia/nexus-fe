import {
  About,
  Event,
  Map,
  Partner,
  PartnerDetail,
  Sponsor,
  SponsorDetail,
  StudentDetail,
  Students,
  WorkDetail,
  Works,
} from '@/routes/pages';
import DetailLayout from '@/shared/components/DetailLayout';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import MainLayout from '@/shared/components/MainLayout';
import NotFound from '@/shared/components/NotFound';
import RootLayout from '@/shared/components/RootLayout';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <About /> },
          { path: '/works', element: <Works /> },
          { path: '/students', element: <Students /> },
          { path: '/map', element: <Map /> },
          { path: '/event', element: <Event /> },
          { path: '/event/sponsor', element: <Sponsor /> },
        ],
      },
      {
        element: <DetailLayout />,
        children: [
          { path: '/works/:workId', element: <WorkDetail /> },
          { path: '/students/:studentId', element: <StudentDetail /> },
          { path: '/event/partner', element: <Partner /> },
        ],
      },
      {
        element: <DetailLayout variant="dark" />,
        children: [
          { path: '/event/sponsor/:sponsorId', element: <SponsorDetail /> },
          { path: '/event/partner/:partnerId', element: <PartnerDetail /> },
        ],
      },
      // 404는 상단 네비게이션 없이 단독 화면으로 보여준다.
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
