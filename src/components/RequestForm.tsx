import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestService } from '../service/requestService';
import { useUser } from '../context/UserContext';
import { formatMoney } from '../utils/formatMoney';

// Import property type images
import villaImage from '../assets/villa.webp';
import apartmentImage from '../assets/apartment.webp';
import officeImage from '../assets/office.webp';
import storeImage from '../assets/store.webp';
import otherImage from '../assets/other.webp';

interface PropertyTypeOption {
  value: string;
  label: string;
  image: string;
  description: string;
}

const propertyTypes: PropertyTypeOption[] = [
  {
    value: 'Villa',
    label: 'Villa',
    image: villaImage,
    description: 'Luxury standalone properties with private gardens',
  },
  {
    value: 'Apartment',
    label: 'Apartment',
    image: apartmentImage,
    description: 'Modern residential units in premium buildings',
  },
  {
    value: 'Office',
    label: 'Office',
    image: officeImage,
    description: 'Professional workspace solutions',
  },
  {
    value: 'Store',
    label: 'Retail Store',
    image: storeImage,
    description: 'Commercial retail spaces',
  },
  {
    value: 'Other',
    label: 'Other',
    image: otherImage,
    description: 'Other property types',
  },
];

const STEPS = {
  CATEGORY: 1,
  BUY_RENT: 2,
  BUDGET_AREA: 3,
  BED_SIZE: 4,
  ADDITIONAL_INFO: 5,
  REVIEW: 6,
  SUCCESS: 7,
};

export const RequestForm = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(STEPS.CATEGORY);
  const [formData, setFormData] = useState({
    category: '',
    buyOrRent: '',
    budget: '',
    area: '',
    bed: '',
    size: '',
    additionalInfo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const hasAutoSubmitted = useRef(false);

  // Restore form data from location state if available (after login redirect)
  useEffect(() => {
    const savedFormData = location.state?.formData;
    
    if (savedFormData) {
      setFormData(savedFormData);
      setCurrentStep(STEPS.REVIEW);
    }
  }, [location.state]);

  // Auto-submit request when user becomes available after login
  useEffect(() => {
    const savedFormData = location.state?.formData;
    
    if (savedFormData && user && !user.isNewUser && !hasAutoSubmitted.current && !isLoading) {
      hasAutoSubmitted.current = true;
      const submitRequest = async () => {
        setIsLoading(true);
        setError('');
        try {
          await requestService.createRequest(user.id, {
            category: savedFormData.category,
            buyOrRent: savedFormData.buyOrRent,
            budget: savedFormData.budget,
            area: savedFormData.area,
            bed: savedFormData.bed || undefined,
            size: savedFormData.size || undefined,
            additionalInfo: savedFormData.additionalInfo || undefined,
          });
          setCurrentStep(STEPS.SUCCESS);
          // Clear location state to prevent re-submission
          window.history.replaceState({}, document.title);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create request');
          hasAutoSubmitted.current = false; // Allow retry on error
        } finally {
          setIsLoading(false);
        }
      };
      
      submitRequest();
    }
  }, [user, location.state, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove all non-digit characters except spaces and hyphens (remove commas to re-format)
    const cleaned = value.replace(/[^\d\s-]/g, '');
    
    // Format numbers with thousand separators
    // Split by hyphens and spaces to handle ranges like "2000000 - 3000000" or "2000000-3000000"
    const parts = cleaned.split(/(\s*-\s*)/);
    const formattedParts = parts.map(part => {
      // If it's a separator (hyphen with optional spaces), keep it as is
      if (/^\s*-\s*$/.test(part)) {
        return part.trim() === '-' ? ' - ' : part;
      }
      // Extract digits only from this part
      const digits = part.replace(/\D/g, '');
      if (!digits) return part;
      // Format with thousand separators
      return parseInt(digits, 10).toLocaleString('en-US');
    });
    
    const formatted = formattedParts.join('');
    
    setFormData({
      ...formData,
      budget: formatted,
    });
    setError('');
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setError('');
    // Auto-advance to next step
    setTimeout(() => {
      setCurrentStep(STEPS.BUY_RENT);
    }, 300);
  };

  const validateStep = (step: number): boolean => {
    setError('');
    switch (step) {
      case STEPS.CATEGORY:
        if (!formData.category) {
          setError('Please select a category');
          return false;
        }
        return true;
      case STEPS.BUY_RENT:
        if (!formData.buyOrRent) {
          setError('Please select Buy or Rent');
          return false;
        }
        return true;
      case STEPS.BUDGET_AREA:
        if (!formData.budget.trim()) {
          setError('Please enter your budget');
          return false;
        }
        if (!formData.area.trim()) {
          setError('Please enter the area');
          return false;
        }
        return true;
      case STEPS.BED_SIZE:
        return true; // Bed and size are optional
      case STEPS.ADDITIONAL_INFO:
        return true; // Additional info is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.REVIEW));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, STEPS.CATEGORY));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If user is not logged in, redirect to login with form data
    if (!user) {
      navigate('/login', { 
        state: { 
          returnPath: '/request/new',
          formData: formData 
        } 
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestService.createRequest(user.id, {
        category: formData.category,
        buyOrRent: formData.buyOrRent,
        budget: formData.budget,
        area: formData.area,
        bed: formData.bed || undefined,
        size: formData.size || undefined,
        additionalInfo: formData.additionalInfo || undefined,
      });
      setCurrentStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (STEPS.REVIEW - 1)) * 100;
  };

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
            onClick={() => navigate('/')}
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
      {/* Minimal Progress Bar */}
      <div className="mb-3 flex-shrink-0">
        <div className="w-full h-0.5 bg-primary-200 rounded-full">
          <div
            className="h-full bg-primary-700 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      <div className={`${currentStep === STEPS.CATEGORY ? 'bg-transparent' : 'bg-white rounded-md shadow-sm'} overflow-hidden flex flex-col flex-1 min-h-0`}>
        {/* Step 1: Category Selection */}
        {currentStep === STEPS.CATEGORY && (
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
                  <p className={`
                    text-base font-semibold transition-colors flex-1 text-left
                    ${formData.category === type.value 
                      ? 'text-primary-700' 
                      : 'text-primary-900'
                    }
                  `}>
                    {type.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Buy/Rent Selection */}
        {currentStep === STEPS.BUY_RENT && (
          <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 justify-center">
            <div className="max-w-md mx-auto w-full space-y-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, buyOrRent: 'Buy' });
                  setError('');
                  setTimeout(() => {
                    setCurrentStep(STEPS.BUDGET_AREA);
                  }, 300);
                }}
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
                <p className={`
                  text-base font-semibold transition-colors flex-1 text-left
                  ${formData.buyOrRent === 'Buy' 
                    ? 'text-primary-700' 
                    : 'text-primary-900'
                  }
                `}>
                  Buy
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, buyOrRent: 'Rent' });
                  setError('');
                  setTimeout(() => {
                    setCurrentStep(STEPS.BUDGET_AREA);
                  }, 300);
                }}
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
                <p className={`
                  text-base font-semibold transition-colors flex-1 text-left
                  ${formData.buyOrRent === 'Rent' 
                    ? 'text-primary-700' 
                    : 'text-primary-900'
                  }
                `}>
                  Rent
                </p>
              </button>
            </div>
          </div>
        )}

          {/* Step 3: Budget and Area */}
          {currentStep === STEPS.BUDGET_AREA && (
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
                  onChange={handleChange}
                  placeholder="e.g., Dubai Marina, Palm Jumeirah, Downtown Dubai"
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Bed and Size */}
          {currentStep === STEPS.BED_SIZE && (
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="bed" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    Bedrooms <span className="text-primary-500 font-normal text-xs">(Optional)</span>
                  </label>
                  <select
                    id="bed"
                    name="bed"
                    value={formData.bed}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 bg-white text-base"
                  >
                    <option value="" className="text-primary-900">Any</option>
                    <option value="1" className="text-primary-900">1 Bedroom</option>
                    <option value="2" className="text-primary-900">2 Bedrooms</option>
                    <option value="3" className="text-primary-900">3 Bedrooms</option>
                    <option value="4" className="text-primary-900">4 Bedrooms</option>
                    <option value="5+" className="text-primary-900">5+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    Size <span className="text-primary-500 font-normal text-xs">(Optional)</span>
                  </label>
                  <input
                    id="size"
                    name="size"
                    type="text"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="e.g., 150 sqft, 2000 sqft"
                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Additional Info */}
          {currentStep === STEPS.ADDITIONAL_INFO && (
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  Additional Information <span className="text-primary-500 font-normal text-xs">(Optional)</span>
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
          )}

          {/* Step 6: Review */}
          {currentStep === STEPS.REVIEW && (() => {
            const selectedProperty = propertyTypes.find(pt => pt.value === formData.category);
            return (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-200 flex flex-col flex-1 min-h-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-700 to-primary-800 px-6 py-4 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Review Your Request</h2>
                    <p className="text-primary-100 text-sm mt-1">Please review all details before submitting</p>
                  </div>

                  {/* Main Content */}
                  <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Image Section */}
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-md">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={selectedProperty?.image || otherImage}
                              alt={formData.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {formData.category}
                            </span>
                          </div>
                        </div>
                        {selectedProperty?.description && (
                          <p className="text-sm text-primary-600 italic text-center">
                            {selectedProperty.description}
                          </p>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Property Details
                          </h3>
                        </div>

                        {/* Category */}
                        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Category</p>
                              <p className="text-base font-semibold text-primary-900">{formData.category}</p>
                            </div>
                          </div>
                        </div>

                        {/* Buy/Rent */}
                        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Transaction Type</p>
                              <p className="text-base font-semibold text-primary-900">{formData.buyOrRent}</p>
                            </div>
                          </div>
                        </div>

                        {/* Area */}
                        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Preferred Area</p>
                              <p className="text-base font-semibold text-primary-900">{formData.area}</p>
                            </div>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Budget Range</p>
                              <p className="text-base font-semibold text-primary-900">{formatMoney(formData.budget)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bed & Size */}
                        {(formData.bed || formData.size) && (
                          <div className="grid grid-cols-2 gap-3">
                            {formData.bed && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Bedrooms</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.bed}</p>
                              </div>
                            )}
                            {formData.size && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Size</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.size}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Additional Info */}
                        {formData.additionalInfo && (
                          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                            <div className="flex items-start mb-2">
                              <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Additional Information</p>
                                <p className="text-sm text-primary-900 leading-relaxed">{formData.additionalInfo}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Login Notice */}
                    {!user && (
                      <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
          })()}

        {error && (
          <div className="mx-4 sm:mx-6 mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep !== STEPS.CATEGORY && currentStep !== STEPS.BUY_RENT && (
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
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-sm shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="ml-auto px-6 py-2 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
