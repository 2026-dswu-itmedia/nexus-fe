import { GNB_MENUS } from '@/shared/constants/navigation';
import { NavLink } from 'react-router-dom';

const GNB = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <nav className="flex items-center justify-between px-5 py-4">
        {GNB_MENUS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `py-1 text-sm ${isActive ? 'font-bold' : 'text-gray-500'}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default GNB;
