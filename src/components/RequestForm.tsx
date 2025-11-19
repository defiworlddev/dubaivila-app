import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../service/requestService';
import { useUser } from '../context/UserContext';

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
  PROPERTY_TYPE: 1,
  LOCATION_BUDGET: 2,
  DETAILS: 3,
  REVIEW: 4,
  SUCCESS: 5,
};

export const RequestForm = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.PROPERTY_TYPE);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    budget: '',
    bedrooms: '',
    bathrooms: '',
    surface: '',
    district: '',
    additionalRequirements: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePropertyTypeSelect = (type: string) => {
    setFormData({ ...formData, propertyType: type });
    setError('');
    // Auto-advance to next step
    setTimeout(() => {
      setCurrentStep(STEPS.LOCATION_BUDGET);
    }, 300);
  };

  const validateStep = (step: number): boolean => {
    setError('');
    switch (step) {
      case STEPS.PROPERTY_TYPE:
        if (!formData.propertyType) {
          setError('Please select a property type');
          return false;
        }
        return true;
      case STEPS.LOCATION_BUDGET:
        if (!formData.location.trim()) {
          setError('Please enter a location');
          return false;
        }
        if (!formData.budget.trim()) {
          setError('Please enter your budget');
          return false;
        }
        return true;
      case STEPS.DETAILS:
        return true; // Details are optional
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
    setCurrentStep((prev) => Math.max(prev - 1, STEPS.PROPERTY_TYPE));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a request');
      return;
    }

    setIsLoading(true);
    try {
      await requestService.createRequest(user.id, {
        propertyType: formData.propertyType,
        location: formData.location,
        budget: formData.budget,
        bedrooms: formData.bedrooms || undefined,
        bathrooms: formData.bathrooms || undefined,
        surface: formData.surface || undefined,
        district: formData.district || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
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

      <div className={`${currentStep === STEPS.PROPERTY_TYPE ? 'bg-transparent' : 'bg-white rounded-md shadow-sm'} overflow-hidden flex flex-col flex-1 min-h-0`}>
        {/* Step 1: Property Type Selection */}
        {currentStep === STEPS.PROPERTY_TYPE && (
          <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto w-full">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlePropertyTypeSelect(type.value)}
                  className={`
                    group relative overflow-hidden rounded-md transition-all duration-300 flex flex-col
                    bg-white shadow-md hover:shadow-xl transform hover:-translate-y-1
                    ${formData.propertyType === type.value 
                      ? 'ring-4 ring-primary-600 ring-offset-2 shadow-xl scale-105' 
                      : 'hover:shadow-lg'
                    }
                  `}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={type.image}
                      alt={type.label}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 sm:p-4 text-center bg-white flex-shrink-0">
                    <p className={`text-sm sm:text-base font-semibold transition-colors ${
                      formData.propertyType === type.value 
                        ? 'text-primary-700' 
                        : 'text-primary-900 group-hover:text-primary-700'
                    }`}>
                      {type.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

          {/* Step 2: Location and Budget */}
          {currentStep === STEPS.LOCATION_BUDGET && (
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  Preferred Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Dubai Marina, Palm Jumeirah, Downtown Dubai"
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., AED 2,000,000 - 3,000,000"
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === STEPS.DETAILS && (
            <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
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
                  <label htmlFor="bathrooms" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 bg-white text-base"
                  >
                    <option value="" className="text-primary-900">Any</option>
                    <option value="1" className="text-primary-900">1 Bathroom</option>
                    <option value="2" className="text-primary-900">2 Bathrooms</option>
                    <option value="3" className="text-primary-900">3 Bathrooms</option>
                    <option value="4+" className="text-primary-900">4+ Bathrooms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="surface" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    Surface Area
                  </label>
                  <input
                    id="surface"
                    name="surface"
                    type="text"
                    value={formData.surface}
                    onChange={handleChange}
                    placeholder="e.g., 150 sqft, 2000 sqft"
                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-semibold text-primary-900 mb-1.5">
                    District / Area
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Dubai Marina, Business Bay"
                    className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all text-primary-900 placeholder-primary-500 text-base bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="additionalRequirements" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  Additional Requirements <span className="text-primary-500 font-normal text-xs">(Optional)</span>
                </label>
                <textarea
                  id="additionalRequirements"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., sea view, parking, gym, pool, furnished"
                  className="w-full px-4 py-2.5 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none resize-none text-primary-900 placeholder-primary-500 text-base transition-all bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === STEPS.REVIEW && (() => {
            const selectedProperty = propertyTypes.find(pt => pt.value === formData.propertyType);
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
                              alt={formData.propertyType}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {formData.propertyType}
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

                        {/* Location */}
                        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Location</p>
                              <p className="text-base font-semibold text-primary-900">{formData.location}</p>
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
                              <p className="text-base font-semibold text-primary-900">{formData.budget}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bedrooms & Bathrooms */}
                        {(formData.bedrooms || formData.bathrooms) && (
                          <div className="grid grid-cols-2 gap-3">
                            {formData.bedrooms && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Bedrooms</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.bedrooms}</p>
                              </div>
                            )}
                            {formData.bathrooms && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Bathrooms</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.bathrooms}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Surface & District */}
                        {(formData.surface || formData.district) && (
                          <div className="grid grid-cols-2 gap-3">
                            {formData.surface && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Surface Area</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.surface}</p>
                              </div>
                            )}
                            {formData.district && (
                              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                <div className="flex items-center mb-2">
                                  <svg className="w-4 h-4 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">District / Area</p>
                                </div>
                                <p className="text-lg font-bold text-primary-900">{formData.district}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Additional Requirements */}
                        {formData.additionalRequirements && (
                          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                            <div className="flex items-start mb-2">
                              <svg className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">Additional Requirements</p>
                                <p className="text-sm text-primary-900 leading-relaxed">{formData.additionalRequirements}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
        {currentStep !== STEPS.PROPERTY_TYPE && (
          <div className="flex gap-3 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-primary-200 pt-4 flex-shrink-0">
            {currentStep > STEPS.PROPERTY_TYPE && (
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
