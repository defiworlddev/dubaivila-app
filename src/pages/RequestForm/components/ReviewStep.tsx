import { useRequestForm } from '../../../hooks/requests/useRequestForm';
import { useUser } from '../../../context/UserContext';
import { formatMoney } from '../../../utils/formatMoney';

interface ReviewStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const ReviewStep = ({ form }: ReviewStepProps) => {
  const { formData } = form;
  const { user } = useUser();

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full flex-1 flex flex-col min-h-0">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-200 flex flex-col flex-1 min-h-0">
        <div className="bg-gradient-to-r from-primary-700 to-primary-800 px-6 py-5 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Review Your Request</h2>
          <p className="text-primary-100 text-sm">Please review all details before submitting</p>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReviewCard icon="building" label="Category" value={formData.category} />
              <ReviewCard icon="check" label="Transaction Type" value={formData.buyOrRent} />
              <ReviewCard icon="location" label="Preferred Area" value={formData.area} />
              <ReviewCard icon="money" label="Budget Range" value={formatMoney(formData.budget)} />
            </div>

            {(formData.bed.length > 0 || formData.size) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.bed.length > 0 && (
                  <ReviewCard
                    icon="home"
                    label="Bedrooms"
                    value={formData.bed
                      .map((b) => {
                        if (b === 'Studio') return 'Studio';
                        if (b === '5+') return '5+ Bedrooms';
                        if (b === '1') return '1 Bedroom';
                        return `${b} Bedrooms`;
                      })
                      .join(', ')}
                  />
                )}
                {formData.size && (
                  <ReviewCard icon="size" label="Size" value={`${formData.size} ${formData.sizeUnit}`} />
                )}
              </div>
            )}

            {formData.additionalInfo && (
              <ReviewCard icon="info" label="Additional Information" value={formData.additionalInfo} isTextArea />
            )}
          </div>

          {!user && (
            <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Login Required</p>
                  <p className="text-sm text-amber-800">Please log in to submit your request. Your information will be saved.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReviewCardProps {
  icon: string;
  label: string;
  value: string;
  isTextArea?: boolean;
}

const ReviewCard = ({ icon, label, value, isTextArea }: ReviewCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'building':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        );
      case 'check':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'location':
        return (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
        );
      case 'money':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'home':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        );
      case 'size':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        );
      case 'info':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-5 border border-primary-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="bg-primary-100 rounded-lg p-2.5 mr-3 flex-shrink-0">
          <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon()}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1.5">{label}</p>
          {isTextArea ? (
            <p className="text-sm text-primary-900 leading-relaxed whitespace-pre-wrap">{value}</p>
          ) : (
            <p className="text-base font-bold text-primary-900 break-words">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

