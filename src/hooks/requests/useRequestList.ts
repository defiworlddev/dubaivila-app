import { useState, useEffect } from 'react';
import { EstateRequest, requestService } from '../../service/requestService';

export const useRequestList = () => {
  const [requests, setRequests] = useState<EstateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const allRequests = await requestService.getAllRequests();
      setRequests(allRequests);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests,
    isLoading,
  };
};

