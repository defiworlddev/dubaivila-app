import { useRequestForm } from '../../../hooks/requests/useRequestForm';

interface BedSizeStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const BedSizeStep = ({ form }: BedSizeStepProps) => {
  const { formData, updateFormData } = form;

  const sortBedrooms = (beds: string[]): string[] => {
    return [...beds].sort((a, b) => {
      // Studio comes first
      if (a === 'Studio') return -1;
      if (b === 'Studio') return 1;
      // 5+ comes last
      if (a === '5+') return 1;
      if (b === '5+') return -1;
      // Sort numeric values
      return parseInt(a) - parseInt(b);
    });
  };

  const handleBedToggle = (bedOption: string) => {
    const isSelected = formData.bed.includes(bedOption);
    const newBed = isSelected
      ? formData.bed.filter((b) => b !== bedOption)
      : [...formData.bed, bedOption];
    updateFormData({ bed: sortBedrooms(newBed) });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ size: e.target.value });
  };

  const handleSizeUnitChange = (unit: 'sqft' | 'm²') => {
    updateFormData({ sizeUnit: unit });
  };

  const bedOptions = ['Studio', '1', '2', '3', '4', '5+'];

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary-900 mb-1.5">
            Bedrooms
          </label>
          <div className="space-y-2">
            {bedOptions.map((bedOption) => {
              const isSelected = formData.bed.includes(bedOption);
              const displayLabel =
                bedOption === 'Studio'
                  ? 'Studio'
                  : bedOption === '5+'
                    ? '5+ Bedrooms'
                    : bedOption === '1'
                      ? '1 Bedroom'
                      : `${bedOption} Bedrooms`;
              return (
                <label
                  key={bedOption}
                  className={`
                    flex items-center px-4 py-2.5 border rounded-lg cursor-pointer transition-all
                    ${isSelected
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600'
                      : 'border-primary-200 bg-white hover:bg-primary-50/50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleBedToggle(bedOption)}
                    className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-600 focus:ring-2"
                  />
                  <span className={`ml-3 text-base ${isSelected ? 'text-primary-900 font-semibold' : 'text-primary-700'}`}>
                    {displayLabel}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-semibold text-primary-900 mb-1.5">
            Size
          </label>
          <div className="relative">
            <input
              id="size"
              name="size"
              type="text"
              value={formData.size}
              onChange={handleSizeChange}
              placeholder="e.g., 150, 2000"
              className="w-full px-4 py-2.5 pr-24 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSizeUnitChange('sqft')}
                className={`text-sm font-medium transition-all ${formData.sizeUnit === 'sqft'
                    ? 'text-primary-900 underline decoration-primary-700 decoration-2 underline-offset-2'
                    : 'text-primary-500'
                  }`}
              >
                sqft
              </button>
              <span className="text-primary-300">|</span>
              <button
                type="button"
                onClick={() => handleSizeUnitChange('m²')}
                className={`text-sm font-medium transition-all ${formData.sizeUnit === 'm²'
                    ? 'text-primary-900 underline decoration-primary-700 decoration-2 underline-offset-2'
                    : 'text-primary-500'
                  }`}
              >
                m²
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

