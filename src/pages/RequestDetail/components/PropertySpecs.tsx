import { EstateRequest } from '../../../service/requestService';

interface PropertySpecsProps {
  request: EstateRequest;
}

export const PropertySpecs = ({ request }: PropertySpecsProps) => {
  if (!request.bed && !request.size) {
    return null;
  }

  return (
    <div className="bg-white border border-primary-200 rounded p-6">
      <h2 className="text-lg font-bold text-primary-900 mb-4">Property Specifications</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {request.bed && (
          <div>
            <p className="text-sm text-primary-500 mb-1">Bedrooms</p>
            <p className="font-semibold text-primary-900">{request.bed.split(',').map((b) => b.trim()).join(', ')}</p>
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
  );
};

