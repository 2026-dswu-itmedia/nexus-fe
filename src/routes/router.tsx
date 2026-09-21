import About from '@/pages/about/About';
import Map from '@/pages/map/Map';
import StudentDetail from '@/pages/students/StudentDetail';
import Students from '@/pages/students/Students';
import WorkDetail from '@/pages/works/WorkDetail';
import Works from '@/pages/works/Works';
import Layout from '@/shared/components/Layout';
import NotFound from '@/shared/components/NotFound';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <About /> },
      { path: '/works', element: <Works /> },
      { path: '/works/:workId', element: <WorkDetail /> },
      { path: '/students', element: <Students /> },
      { path: '/students/:studentId', element: <StudentDetail /> },
      { path: '/map', element: <Map /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
