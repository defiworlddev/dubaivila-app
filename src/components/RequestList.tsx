import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EstateRequest, requestService } from '../service/requestService';
import { useUser } from '../context/UserContext';

// Import property type images
import villaImage from '../assets/villa.webp';
import apartmentImage from '../assets/apartment.webp';
import officeImage from '../assets/office.webp';
import storeImage from '../assets/store.webp';
import otherImage from '../assets/other.webp';

const statusColors = {
  pending: 'bg-accent-100 text-accent-800',
  in_progress: 'bg-primary-100 text-primary-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const getPropertyImage = (propertyType: string): string => {
  const type = propertyType.toLowerCase();
  if (type === 'villa') return villaImage;
  if (type === 'apartment') return apartmentImage;
  if (type === 'office') return officeImage;
  if (type === 'store' || type === 'retail store') return storeImage;
  return otherImage;
};

export const RequestList = () => {
  const [requests, setRequests] = useState<EstateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-600 font-medium">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">All Requests</h2>
        <Link
          to="/request/new"
          className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
        >
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-12 text-center">
          <p className="text-primary-700 mb-6 font-medium">No requests found.</p>
          <Link
            to="/request/new"
            className="inline-block bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
          >
            Create Your First Request
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex">
                {/* Image */}
                <div className="relative w-32 h-32 flex-shrink-0 bg-primary-50">
                  <img
                    src={getPropertyImage(request.propertyType)}
                    alt={request.propertyType}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-primary-900 mb-1">
                          {request.location}
                        </h3>
                        <p className="text-sm text-primary-600 font-medium">
                          {request.propertyType}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${statusColors[request.status]}`}
                      >
                        {statusLabels[request.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-primary-900">
                          {request.budget}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

