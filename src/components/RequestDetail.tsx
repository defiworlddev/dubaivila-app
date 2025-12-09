import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EstateRequest, requestService } from '../service/requestService';
import { formatMoney } from '../utils/formatMoney';
import { useUser } from '../context/UserContext';

const statusColors = {
  'New Request': 'bg-accent-100 text-accent-800',
  'Receiving Offers': 'bg-primary-100 text-primary-800',
  'Deal Closed 💯': 'bg-green-100 text-green-800',
};

const statusLabels = {
  'New Request': 'New Request',
  'Receiving Offers': 'Receiving Offers',
  'Deal Closed 💯': 'Deal Closed 💯',
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [request, setRequest] = useState<EstateRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAgent = user?.isAgent === true;

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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-primary-200 rounded animate-pulse w-32 mb-6"></div>
          <div className="bg-white border border-primary-200 rounded p-6 space-y-4">
            <div className="h-6 bg-primary-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-primary-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-primary-200 rounded p-8 text-center max-w-md">
          <h3 className="text-xl font-bold text-primary-900 mb-2">
            {error ? 'Error Loading Request' : 'Request Not Found'}
          </h3>
          <p className="text-primary-600 mb-6">
            {error || 'The request you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-primary-700 hover:text-primary-900 mb-4"
          >
            ← Back to Requests
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-900">{request.area}</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-primary-500">Request ID</p>
                <p className="text-sm font-mono text-primary-900">{request.id.slice(-8)}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[request.status]}`}>
                {statusLabels[request.status]}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-primary-200 rounded p-6">
              <h2 className="text-lg font-bold text-primary-900 mb-4">Request Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-primary-500 mb-1">Category</p>
                  <p className="font-semibold text-primary-900">{request.category}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500 mb-1">Buy/Rent</p>
                  <p className="font-semibold text-primary-900">{request.buyOrRent}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500 mb-1">Budget</p>
                  <p className="font-semibold text-primary-900">{formatMoney(request.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-500 mb-1">Created</p>
                  <p className="font-semibold text-primary-900">{formatDateTime(request.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Property Specifications */}
            {(request.bed || request.size) && (
              <div className="bg-white border border-primary-200 rounded p-6">
                <h2 className="text-lg font-bold text-primary-900 mb-4">Property Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {request.bed && (
                    <div>
                      <p className="text-sm text-primary-500 mb-1">Bedrooms</p>
                      <p className="font-semibold text-primary-900">{request.bed}</p>
                    </div>
                  )}
                  {request.size && (
                    <div>
                      <p className="text-sm text-primary-500 mb-1">Size</p>
                      <p className="font-semibold text-primary-900">{request.size}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {request.additionalInfo && (
              <div className="bg-white border border-primary-200 rounded p-6">
                <h2 className="text-lg font-bold text-primary-900 mb-4">Additional Information</h2>
                <p className="text-primary-700 whitespace-pre-wrap">{request.additionalInfo}</p>
              </div>
            )}
          </div>

          {/* Right Column - Contact */}
          <div>
            {isAgent && (request.userPhoneNumber || request.userName) ? (
              <div className="bg-white border border-primary-200 rounded p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">Contact Client</h3>
                {request.userName && (
                  <div className="mb-4">
                    <p className="text-sm text-primary-500 mb-1">Name</p>
                    <p className="text-lg font-semibold text-primary-900">{request.userName}</p>
                  </div>
                )}
                {request.userPhoneNumber && (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-primary-500 mb-1">Phone Number</p>
                      <p className="text-xl font-bold text-primary-900">{request.userPhoneNumber}</p>
                    </div>
                    <a
                      href={`tel:${request.userPhoneNumber}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      Call Now
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white border border-primary-200 rounded p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">Contact Information</h3>
                <p className="text-sm text-primary-600">Available exclusively to our verified agents.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

