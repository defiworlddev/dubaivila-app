import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white border-b border-primary-200 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary-900">Dubai Villas</h1>
            </Link>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <span className="text-sm text-primary-700 font-medium">
                    {user.name || user.phoneNumber}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-primary-600 hover:text-primary-900 font-medium transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

