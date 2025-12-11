import { useRequestForm } from '../../../hooks/requests/useRequestForm';

interface BudgetAreaStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const BudgetAreaStep = ({ form }: BudgetAreaStepProps) => {
  const { formData, updateFormData } = form;

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d\s-]/g, '');
    const parts = cleaned.split(/(\s*-\s*)/);
    const formattedParts = parts.map((part) => {
      if (/^\s*-\s*$/.test(part)) {
        return part.trim() === '-' ? ' - ' : part;
      }
      const digits = part.replace(/\D/g, '');
      if (!digits) return part;
      return parseInt(digits, 10).toLocaleString('en-US');
    });
    const formatted = formattedParts.join('');
    updateFormData({ budget: formatted });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ area: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div>
        <label htmlFor="budget" className="block text-sm font-semibold text-primary-900 mb-1.5">
          Budget Range (AED) <span className="text-red-500">*</span>
        </label>
        <input
          id="budget"
          name="budget"
          type="text"
          value={formData.budget}
          onChange={handleBudgetChange}
          placeholder="e.g., 2,000,000 - 3,000,000"
          className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
          required
        />
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-semibold text-primary-900 mb-1.5">
          Preferred Area <span className="text-red-500">*</span>
        </label>
        <input
          id="area"
          name="area"
          type="text"
          value={formData.area}
          onChange={handleAreaChange}
          placeholder="e.g., Dubai Marina, Palm Jumeirah, Downtown Dubai"
          className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
          required
        />
      </div>
    </div>
  );
};

