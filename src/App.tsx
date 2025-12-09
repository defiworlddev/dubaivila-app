import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Verification } from './components/Verification';
import { Registration } from './components/Registration';
import { RequestList } from './components/RequestList';
import { RequestForm } from './components/RequestForm';
import { RequestDetail } from './components/RequestDetail';

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

