import About from '@/pages/about/About';
import Event from '@/pages/event/Event';
import Partner from '@/pages/event/Partner';
import Sponsor from '@/pages/event/Sponsor';
import Map from '@/pages/map/Map';
import StudentDetail from '@/pages/students/StudentDetail';
import Students from '@/pages/students/Students';
import WorkDetail from '@/pages/works/WorkDetail';
import Works from '@/pages/works/Works';
import MainLayout from '@/shared/components/MainLayout';
import NotFound from '@/shared/components/NotFound';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <About /> },
      { path: '/works', element: <Works /> },
      { path: '/works/:workId', element: <WorkDetail /> },
      { path: '/students', element: <Students /> },
      { path: '/students/:studentId', element: <StudentDetail /> },
      { path: '/map', element: <Map /> },
      { path: '/event', element: <Event /> },
      { path: '/event/sponsor', element: <Sponsor /> },
      { path: '/event/partner', element: <Partner /> },
    ],
  },
  // 404는 상단 네비게이션 없이 단독 화면으로 보여준다.
  { path: '*', element: <NotFound /> },
]);

export default router;
