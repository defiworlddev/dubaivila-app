import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Verification } from './pages/Verification';
import { Registration } from './pages/Registration';
import { RequestList } from './pages/RequestList';
import { RequestForm } from './pages/RequestForm';
import { RequestDetail } from './pages/RequestDetail';

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
          <Layout>
            <RequestList />
          </Layout>
        }
      />
      <Route
        path="/request/new"
        element={
          <Layout>
            <RequestForm />
          </Layout>
        }
      />
      <Route
        path="/request/:id"
        element={
          <Layout>
            <RequestDetail />
          </Layout>
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
