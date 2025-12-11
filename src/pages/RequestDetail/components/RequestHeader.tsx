import { EstateRequest } from '../../../service/requestService';

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

interface RequestHeaderProps {
  request: EstateRequest;
  onBack: () => void;
}

export const RequestHeader = ({ request, onBack }: RequestHeaderProps) => {
  return (
    <div className="mb-6">
      <button onClick={onBack} className="text-primary-700 hover:text-primary-900 mb-4">
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
  );
};

