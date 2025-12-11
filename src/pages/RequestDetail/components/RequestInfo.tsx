import { EstateRequest } from '../../../service/requestService';
import { formatMoney } from '../../../utils/formatMoney';

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

interface RequestInfoProps {
  request: EstateRequest;
}

export const RequestInfo = ({ request }: RequestInfoProps) => {
  return (
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
          <p className="font-semibold text-primary-900">{formatMoney(request.budget)} AED</p>
        </div>
        <div>
          <p className="text-sm text-primary-500 mb-1">Created</p>
          <p className="font-semibold text-primary-900">{formatDateTime(request.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

