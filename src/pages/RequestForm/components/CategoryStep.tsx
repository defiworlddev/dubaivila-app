import { useRequestForm } from '../../../hooks/requests/useRequestForm';
import { propertyTypes } from '../constants/propertyTypes';

interface CategoryStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const CategoryStep = ({ form }: CategoryStepProps) => {
  const { formData, updateFormData } = form;

  const handleCategorySelect = (category: string) => {
    updateFormData({ category });
    setTimeout(() => {
      form.handleNext({ category });
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 justify-center">
      <div className="max-w-md mx-auto w-full space-y-3">
        {propertyTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => handleCategorySelect(type.value)}
            className={`
              w-full relative overflow-hidden rounded-lg transition-all duration-300
              flex items-center px-4 py-3.5
              bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md
              ${formData.category === type.value
                ? 'ring-2 ring-primary-600 shadow-md bg-primary-50'
                : 'hover:bg-primary-50/50'
              }
            `}
          >
            <p
              className={`
                text-base font-semibold transition-colors flex-1 text-left
                ${formData.category === type.value ? 'text-primary-700' : 'text-primary-900'}
              `}
            >
              {type.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

