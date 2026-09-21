import Footer from '@/shared/components/Footer';
import GNB from '@/shared/components/GNB';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="max-w-mobile mx-auto flex min-h-dvh flex-col bg-white">
      <GNB />
      <main className="flex-1 px-5 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
