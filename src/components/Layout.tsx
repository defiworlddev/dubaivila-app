import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Requests' },
    { path: '/request/new', label: 'New Request' },
  ];

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      <header className="bg-gray-100 sticky top-0 z-50" >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-pink-500 px-4 py-2 rounded-lg">
                <h1 className="text-xl font-bold text-white italic">Dubai Villas</h1>
              </div>
              <span className="text-sm text-gray-600 font-sans">by Premium Properties</span>
            </Link>
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-2">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={
                        active
                          ? 'bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition'
                          : 'text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition'
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              {user && (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-gray-900 font-medium transition px-3"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-primary-200 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <a
              href="https://x.com/dubaivilas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-900 transition-colors"
              aria-label="Follow us on X"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

