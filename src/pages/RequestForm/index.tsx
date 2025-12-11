import { useRequestForm, STEPS } from '../../hooks/requests/useRequestForm';
import { CategoryStep } from './components/CategoryStep';
import { BuyRentStep } from './components/BuyRentStep';
import { BudgetAreaStep } from './components/BudgetAreaStep';
import { BedSizeStep } from './components/BedSizeStep';
import { AdditionalInfoStep } from './components/AdditionalInfoStep';
import { LoginStep } from './components/LoginStep';
import { ReviewStep } from './components/ReviewStep';

export const RequestForm = () => {
  const form = useRequestForm();
  const { currentStep, error, getProgressPercentage, handleNext, handleBack, handleSubmit } = form;

  if (currentStep === STEPS.SUCCESS) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-primary-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-primary-900 mb-2">Request Submitted</h2>
          <p className="text-primary-700 mb-6 font-medium">We'll contact you shortly.</p>
          <button
            onClick={() => form.navigate('/')}
            className="px-6 py-2.5 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-lg hover:shadow-xl transition"
          >
            View My Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <div className="w-full h-0.5 bg-primary-200 rounded-full">
          <div
            className="h-full bg-primary-700 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      <div
        className={`${
          currentStep === STEPS.CATEGORY ? 'bg-transparent' : 'bg-white rounded-md shadow-sm'
        } overflow-hidden flex flex-col flex-1 min-h-0`}
      >
        {currentStep === STEPS.CATEGORY && <CategoryStep form={form} />}
        {currentStep === STEPS.BUY_RENT && <BuyRentStep form={form} />}
        {currentStep === STEPS.BUDGET_AREA && <BudgetAreaStep form={form} />}
        {currentStep === STEPS.BED_SIZE && <BedSizeStep form={form} />}
        {currentStep === STEPS.ADDITIONAL_INFO && <AdditionalInfoStep form={form} />}
        {currentStep === STEPS.LOGIN && <LoginStep form={form} />}
        {currentStep === STEPS.REVIEW && <ReviewStep form={form} />}

        {error && (
          <div className="mx-4 sm:mx-6 mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0">
            {error}
          </div>
        )}

        {currentStep !== STEPS.CATEGORY && currentStep !== STEPS.BUY_RENT && currentStep !== STEPS.LOGIN && (
          <div className="flex gap-3 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-primary-200 pt-4 flex-shrink-0">
            {currentStep > STEPS.CATEGORY && (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 border border-primary-300 text-primary-700 rounded-lg font-semibold hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-sm"
              >
                Back
              </button>
            )}
            {currentStep < STEPS.REVIEW ? (
              <button
                type="button"
                onClick={() => handleNext()}
                className="ml-auto px-6 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-sm shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={form.isLoading}
                className="ml-auto px-6 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg hover:shadow-xl"
              >
                {form.isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        )}
        
        {currentStep === STEPS.LOGIN && (
          <div className="flex gap-3 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-primary-200 pt-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 border border-primary-300 text-primary-700 rounded-lg font-semibold hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-sm"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
