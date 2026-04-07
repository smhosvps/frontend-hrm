/* eslint-disable @typescript-eslint/no-explicit-any */

import { Posting } from '@/hooks/use-postings';
import { useGetUsersQuery } from '@/redux/features/user/userApi';
import { useState } from 'react';

interface PostingFormProps {
  onSubmit: (data: Omit<Posting, 'id'>) => void;
  onCancel: () => void;
  initialData?: Posting;
  submitLabel?: string;
}

const locationOptions = [
  'Main Gate/Desk',
  'Main Gate/Desk Assistant',
  'Admin Front',
  'Admin Front 1st Floor',
  'Back Gate',
  'Generator House Kilo',
  'Patrol Reliever',
  'Control Room',
  'OutGate',
  'Plot 16',
  'Plot 27',
  'Success Court',
  'Glorius Court',
  'Orazi Church',
  'Orazi Event Centre',
  'Iwofe',
  'Tombia Extention',
  'Amaechi Drive',
  'Ada George',
];

export function PostingForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Create Posting',
}: PostingFormProps) {
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery({});

  const [formData, setFormData] = useState<Omit<Posting, 'id'>>({
    location: initialData?.location || '',
    shift: initialData?.shift || 'DAY',
    operativeOnDuty: initialData?.operativeOnDuty || '',
    offDuty: initialData?.offDuty || '',
    reliever: initialData?.reliever || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.operativeOnDuty.trim())
      newErrors.operativeOnDuty = 'Operative name is required';
    if (!formData.offDuty.trim()) newErrors.offDuty = 'Off duty dates are required';
    if (!formData.reliever.trim()) newErrors.reliever = 'Reliever is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        location: '',
        shift: 'DAY',
        operativeOnDuty: '',
        offDuty: '',
        reliever: '',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Helper to get user full name
  const getUserFullName = (user: any) => `${user.firstName} ${user.lastName}`;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        {initialData ? 'Edit Posting' : 'Create New Posting'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Location - Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location/Beat
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Shift - Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Shift
          </label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DAY">DAY</option>
            <option value="NIGHT">NIGHT</option>
          </select>
        </div>

        {/* Operative On Duty - User Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Operative On Duty
          </label>
          <select
            name="operativeOnDuty"
            value={formData.operativeOnDuty}
            onChange={handleChange}
            disabled={isLoadingUsers}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.operativeOnDuty ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select operative</option>
            {users.map((user: any) => (
              <option key={user._id} value={getUserFullName(user)}>
                {getUserFullName(user)} ({user.role})
              </option>
            ))}
          </select>
          {errors.operativeOnDuty && (
            <p className="text-red-500 text-sm mt-1">{errors.operativeOnDuty}</p>
          )}
        </div>

        {/* Off Duty Dates - Text input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Off Duty Dates
          </label>
          <input
            type="text"
            name="offDuty"
            value={formData.offDuty}
            onChange={handleChange}
            placeholder="e.g., 15th - 16th APRIL"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.offDuty ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.offDuty && (
            <p className="text-red-500 text-sm mt-1">{errors.offDuty}</p>
          )}
        </div>

        {/* Reliever - User Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reliever
          </label>
          <select
            name="reliever"
            value={formData.reliever}
            onChange={handleChange}
            disabled={isLoadingUsers}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reliever ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select reliever</option>
            {users.map((user: any) => (
              <option key={user._id} value={getUserFullName(user)}>
                {getUserFullName(user)} ({user.role})
              </option>
            ))}
          </select>
          {errors.reliever && (
            <p className="text-red-500 text-sm mt-1">{errors.reliever}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-[6px] hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-[6px] hover:bg-blue-800 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}