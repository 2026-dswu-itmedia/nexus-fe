import { GNB_MENUS } from '@/shared/constants/navigation';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section>
      <h1>페이지를 찾을 수 없습니다</h1>
      <nav className="mt-4 flex flex-wrap gap-4">
        {GNB_MENUS.map(({ label, path }) => (
          <Link key={path} to={path} className="underline">
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
};

export default NotFound;
