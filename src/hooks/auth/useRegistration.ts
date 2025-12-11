import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const useRegistration = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { completeRegistration, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.returnPath;
  const formData = location.state?.formData;

  useEffect(() => {
    if (user && !user.isNewUser) {
      if (returnPath && formData) {
        navigate(returnPath, { state: { formData } });
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, returnPath, formData]);

  const handleChange = (value: string) => {
    setName(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    try {
      await completeRegistration(name.trim());
      if (returnPath && formData) {
        navigate(returnPath, { state: { formData } });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
};

