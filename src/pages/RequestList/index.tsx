import { Link } from 'react-router-dom';
import { useRequestList } from '../../hooks/requests/useRequestList';
import { EstateRequest } from '../../service/requestService';
import { formatMoney } from '../../utils/formatMoney';
import { HeroSection } from './components/HeroSection';
import { RequestCard } from './components/RequestCard';
import dubiaBg from '../../assets/dubia-bg.jpg';

export const RequestList = () => {
  const { requests, isLoading } = useRequestList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin"></div>
          <div className="text-primary-600 font-medium text-sm">Loading requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroSection backgroundImage={dubiaBg} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">All Requests</h2>
          <p className="text-sm text-gray-500 mt-1">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'} available
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500 mb-6">Be the first to create a property request and connect with agents.</p>
            </div>
            <Link
              to="/request/new"
              className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};
