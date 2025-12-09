import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EstateRequest, requestService } from '../service/requestService';
import { formatMoney } from '../utils/formatMoney';

// Import property type images
import villaImage from '../assets/villa.webp';
import apartmentImage from '../assets/apartment.webp';
import officeImage from '../assets/office.webp';
import storeImage from '../assets/store.webp';
import otherImage from '../assets/other.webp';
import dubiaBg from '../assets/dubia-bg.jpg';

const statusColors = {
  'New Request': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Receiving Offers': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Deal Closed 💯': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const statusLabels = {
  'New Request': 'New Request',
  'Receiving Offers': 'Receiving Offers',
  'Deal Closed 💯': 'Deal Closed 💯',
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
      {/* Hero Section */}
      <section 
        className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 mb-10 overflow-hidden"
        style={{
          backgroundImage: `url(${dubiaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-primary-900/85"></div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
              Dubai Villas
            </h1>
            <div className="w-20 h-1 bg-white/40 mx-auto rounded-full">
              <div className="w-12 h-1 bg-white mx-auto rounded-full"></div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Your premier destination for finding the perfect property in Dubai. Browse listings, create free requests, 
              and connect with trusted agents to find your dream property.
            </p>
            <div className="pt-4">
              <Link
                to="/request/new"
                className="inline-flex items-center gap-2.5 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform whitespace-nowrap"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                List Your Request (It's free!)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">All Requests</h2>
          <p className="text-sm text-gray-500 mt-1">{requests.length} {requests.length === 1 ? 'request' : 'requests'} available</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
            <Link
              key={request.id}
              to={`/request/${request.id}`}
              className="group bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-56 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
                <img
                  src={getPropertyImage(request.propertyType)}
                  alt={request.propertyType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm ${statusColors[request.status]}`}
                  >
                    {statusLabels[request.status]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {request.location}
                  </h3>
                  <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-4">
                    {request.propertyType}
                  </p>
                </div>

                {/* Budget Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Budget</p>
                      <p className="text-lg font-bold text-gray-900 truncate">
                        {formatMoney(request.budget)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

