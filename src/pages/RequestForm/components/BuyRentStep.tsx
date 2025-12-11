import { useRequestForm } from '../../../hooks/requests/useRequestForm';

interface BuyRentStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const BuyRentStep = ({ form }: BuyRentStepProps) => {
  const { formData, updateFormData } = form;

  const handleSelect = (buyOrRent: string) => {
    updateFormData({ buyOrRent });
    setTimeout(() => {
      form.handleNext({ buyOrRent });
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 justify-center">
      <div className="max-w-md mx-auto w-full space-y-3">
        <button
          type="button"
          onClick={() => handleSelect('Buy')}
          className={`
            w-full relative overflow-hidden rounded-lg transition-all duration-300
            flex items-center px-4 py-3.5
            bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md
            ${formData.buyOrRent === 'Buy'
              ? 'ring-2 ring-primary-600 shadow-md bg-primary-50'
              : 'hover:bg-primary-50/50'
            }
          `}
        >
          <p
            className={`
              text-base font-semibold transition-colors flex-1 text-left
              ${formData.buyOrRent === 'Buy' ? 'text-primary-700' : 'text-primary-900'}
            `}
          >
            Buy
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect('Rent')}
          className={`
            w-full relative overflow-hidden rounded-lg transition-all duration-300
            flex items-center px-4 py-3.5
            bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md
            ${formData.buyOrRent === 'Rent'
              ? 'ring-2 ring-primary-600 shadow-md bg-primary-50'
              : 'hover:bg-primary-50/50'
            }
          `}
        >
          <p
            className={`
              text-base font-semibold transition-colors flex-1 text-left
              ${formData.buyOrRent === 'Rent' ? 'text-primary-700' : 'text-primary-900'}
            `}
          >
            Rent
          </p>
        </button>
      </div>
    </div>
  );
};

