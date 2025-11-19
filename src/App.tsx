import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Verification } from './components/Verification';
import { Registration } from './components/Registration';
import { RequestList } from './components/RequestList';
import { RequestForm } from './components/RequestForm';

const AppRoutes = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-primary-700 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Verification />} />
      <Route path="/register" element={<Registration />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/request/new"
        element={
          <ProtectedRoute>
            <Layout>
              <RequestForm />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

