import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EstateRequest, requestService } from '../../service/requestService';

export const useRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<EstateRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  const loadRequest = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const requestData = await requestService.getRequestById(id);
      setRequest(requestData);
    } catch (err) {
      console.error('Failed to load request:', err);
      setError('Failed to load request details');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    request,
    isLoading,
    error,
  };
};

