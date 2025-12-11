import { Link } from 'react-router-dom';
import { EstateRequest } from '../../../service/requestService';
import { formatMoney } from '../../../utils/formatMoney';

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

interface RequestCardProps {
  request: EstateRequest;
}

export const RequestCard = ({ request }: RequestCardProps) => {
  return (
    <Link
      to={`/request/${request.id}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
              {request.area}
            </h3>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${statusColors[request.status]}`}>
            {statusLabels[request.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">{request.category}</p>
          <span className="text-primary-400">•</span>
          <p className="text-sm font-medium text-primary-700">{request.buyOrRent}</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Budget</p>
              <p className="text-lg font-bold text-gray-900 truncate">{formatMoney(request.budget)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

