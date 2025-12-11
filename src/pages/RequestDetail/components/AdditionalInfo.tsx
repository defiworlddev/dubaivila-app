import { EstateRequest } from '../../../service/requestService';

interface AdditionalInfoProps {
  request: EstateRequest;
}

export const AdditionalInfo = ({ request }: AdditionalInfoProps) => {
  if (!request.additionalInfo) {
    return null;
  }

  return (
    <div className="bg-white border border-primary-200 rounded p-6">
      <h2 className="text-lg font-bold text-primary-900 mb-4">Request Details & Special Requirements</h2>
      <p className="text-primary-700 whitespace-pre-wrap">{request.additionalInfo}</p>
    </div>
  );
};

