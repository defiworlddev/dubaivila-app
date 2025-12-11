import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestForm } from '../../../hooks/requests/useRequestForm';
import { useUser } from '../../../context/UserContext';

interface LoginStepProps {
  form: ReturnType<typeof useRequestForm>;
}

export const LoginStep = ({ form }: LoginStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();
  const { formData } = form;

  const handleChange = (value: string) => {
    setPhoneNumber(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Create a serializable copy of formData
      const serializableFormData = {
        category: String(formData.category || ''),
        buyOrRent: String(formData.buyOrRent || ''),
        budget: String(formData.budget || ''),
        area: String(formData.area || ''),
        bed: Array.isArray(formData.bed) ? formData.bed.map(String) : [],
        size: String(formData.size || ''),
        sizeUnit: (formData.sizeUnit === 'm²' ? 'm²' : 'sqft') as 'sqft' | 'm²',
        additionalInfo: String(formData.additionalInfo || ''),
      };

      await login(phoneNumber);
      navigate('/verify', {
        state: {
          phoneNumber,
          returnPath: '/request/new',
          formData: serializableFormData,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
      <div>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">Login Required</h2>
        <p className="text-primary-700 mb-6">Please log in to continue with your request submission.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-primary-800 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="+971 50 123 4567"
            className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition text-primary-900 placeholder-primary-500 bg-white"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-primary-600">We'll send you a verification code via WhatsApp</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    </div>
  );
};

