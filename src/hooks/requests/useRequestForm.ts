import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestService } from '../../service/requestService';
import { useUser } from '../../context/UserContext';

export const STEPS = {
  CATEGORY: 1,
  BUY_RENT: 2,
  BUDGET_AREA: 3,
  BED_SIZE: 4,
  ADDITIONAL_INFO: 5,
  LOGIN: 6,
  REVIEW: 7,
  SUCCESS: 8,
};

export interface FormData {
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed: string[];
  size: string;
  sizeUnit: 'sqft' | 'm²';
  additionalInfo: string;
}

export const useRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(STEPS.CATEGORY);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    buyOrRent: '',
    budget: '',
    area: '',
    bed: [],
    size: '',
    sizeUnit: 'sqft',
    additionalInfo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedFormData = location.state?.formData;
    if (savedFormData) {
      let sizeValue = savedFormData.size || '';
      let sizeUnit: 'sqft' | 'm²' = 'sqft';

      if (sizeValue) {
        if (sizeValue.toLowerCase().includes('m²') || sizeValue.toLowerCase().includes('m2')) {
          sizeUnit = 'm²';
          sizeValue = sizeValue.replace(/m²|m2/gi, '').trim();
        } else if (sizeValue.toLowerCase().includes('sqft') || sizeValue.toLowerCase().includes('sq ft')) {
          sizeUnit = 'sqft';
          sizeValue = sizeValue.replace(/sqft|sq ft/gi, '').trim();
        }
      }

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

      const bedArray = savedFormData.bed
        ? Array.isArray(savedFormData.bed)
          ? savedFormData.bed
          : savedFormData.bed.split(',').map((b: string) => b.trim()).filter(Boolean)
        : [];

      const normalizedFormData = {
        ...savedFormData,
        bed: sortBedrooms(bedArray),
        size: sizeValue,
        sizeUnit: savedFormData.sizeUnit || sizeUnit,
      };
      setFormData(normalizedFormData);
      // After returning from login/verification, go to REVIEW step (only if user is logged in)
      if (user && !user.isNewUser) {
        setCurrentStep(STEPS.REVIEW);
      }
    }
  }, [location.state, user]);

  // Auto-advance from LOGIN to REVIEW when user logs in (if already on LOGIN step)
  useEffect(() => {
    if (currentStep === STEPS.LOGIN && user && !user.isNewUser) {
      setCurrentStep(STEPS.REVIEW);
    }
  }, [currentStep, user]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError('');
  };

  const validateStep = (step: number, updatedData?: Partial<FormData>): boolean => {
    setError('');
    const dataToValidate = updatedData ? { ...formData, ...updatedData } : formData;
    switch (step) {
      case STEPS.CATEGORY:
        if (!dataToValidate.category) {
          setError('Please select a category');
          return false;
        }
        return true;
      case STEPS.BUY_RENT:
        if (!dataToValidate.buyOrRent) {
          setError('Please select Buy or Rent');
          return false;
        }
        return true;
      case STEPS.BUDGET_AREA:
        if (!dataToValidate.budget.trim()) {
          setError('Please enter your budget');
          return false;
        }
        if (!dataToValidate.area.trim()) {
          setError('Please enter the area');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = (immediateUpdates?: Partial<FormData>) => {
    if (immediateUpdates) {
      updateFormData(immediateUpdates);
    }
    if (!validateStep(currentStep, immediateUpdates)) {
      return;
    }
    
    // After ADDITIONAL_INFO, check if user is logged in
    if (currentStep === STEPS.ADDITIONAL_INFO) {
      if (!user || user.isNewUser) {
        // User not logged in, go to LOGIN step
        setCurrentStep(STEPS.LOGIN);
        return;
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.REVIEW));
  };

  const handleBack = () => {
    // If on LOGIN step and going back, go to ADDITIONAL_INFO
    if (currentStep === STEPS.LOGIN) {
      setCurrentStep(STEPS.ADDITIONAL_INFO);
    } else if (currentStep === STEPS.REVIEW) {
      // From REVIEW, go back to ADDITIONAL_INFO (skip LOGIN since user is already logged in)
      setCurrentStep(STEPS.ADDITIONAL_INFO);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, STEPS.CATEGORY));
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // User should already be logged in at this point (went through LOGIN step)
    if (!user || user.isNewUser) {
      setError('Please log in to submit your request');
      // Redirect to LOGIN step
      setCurrentStep(STEPS.LOGIN);
      return;
    }

    setIsLoading(true);
    try {
      const sizeValue = formData.size ? `${formData.size} ${formData.sizeUnit}` : undefined;
      await requestService.createRequest(user.id, {
        category: formData.category,
        buyOrRent: formData.buyOrRent,
        budget: formData.budget,
        area: formData.area,
        bed: formData.bed.length > 0 ? formData.bed.join(', ') : undefined,
        size: sizeValue,
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
    // Calculate progress: CATEGORY -> BUY_RENT -> BUDGET_AREA -> BED_SIZE -> ADDITIONAL_INFO -> LOGIN -> REVIEW
    const totalSteps = STEPS.REVIEW - 1; // Exclude SUCCESS
    return ((currentStep - 1) / totalSteps) * 100;
  };

  return {
    STEPS,
    currentStep,
    formData,
    isLoading,
    error,
    user,
    updateFormData,
    handleNext,
    handleBack,
    handleSubmit,
    getProgressPercentage,
    navigate,
  };
};

