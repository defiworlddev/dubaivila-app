import { EstateRequest } from '../../../service/requestService';

interface ContactInfoProps {
  request: EstateRequest;
  isAgent: boolean;
}

export const ContactInfo = ({ request, isAgent }: ContactInfoProps) => {
  if (isAgent && (request.userPhoneNumber || request.userName)) {
    return (
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
    );
  }

  return (
    <div className="bg-white border border-primary-200 rounded p-6">
      <h3 className="text-lg font-bold text-primary-900 mb-4">Contact Information</h3>
      <p className="text-sm text-primary-600">Available exclusively to our verified agents.</p>
    </div>
  );
};

