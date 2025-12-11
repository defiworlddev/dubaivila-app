import { useRequestForm } from '../../../hooks/requests/useRequestForm';

interface AdditionalInfoStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const AdditionalInfoStep = ({ form }: AdditionalInfoStepProps) => {
  const { formData, updateFormData } = form;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ additionalInfo: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-semibold text-primary-900 mb-1.5">
          Your Request Details & Special Requirements
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows={5}
          placeholder="e.g., sea view, parking, gym, pool, furnished, or any other requirements"
          className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none resize-none text-primary-900 placeholder-primary-500 text-base transition-all bg-white"
        />
      </div>
    </div>
  );
};

