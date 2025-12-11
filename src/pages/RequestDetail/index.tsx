import { useNavigate } from 'react-router-dom';
import { useRequestDetail } from '../../hooks/requests/useRequestDetail';
import { useUser } from '../../context/UserContext';
import { RequestHeader } from './components/RequestHeader';
import { RequestInfo } from './components/RequestInfo';
import { PropertySpecs } from './components/PropertySpecs';
import { AdditionalInfo } from './components/AdditionalInfo';
import { ContactInfo } from './components/ContactInfo';

export const RequestDetail = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { request, isLoading, error } = useRequestDetail();
  const isAgent = user?.isAgent === true;

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
        <RequestHeader request={request} onBack={() => navigate('/')} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RequestInfo request={request} />
            {request.bed || request.size ? <PropertySpecs request={request} /> : null}
            {request.additionalInfo ? <AdditionalInfo request={request} /> : null}
          </div>
          <div>
            <ContactInfo request={request} isAgent={isAgent} />
          </div>
        </div>
      </div>
    </div>
  );
};
