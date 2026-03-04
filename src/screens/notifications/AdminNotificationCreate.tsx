import { useCreateAdminNotificationMutation } from '@/redux/features/notificationsApi/notificationsApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiXCircle } from 'react-icons/fi';

const roles = ['pastor', 'Super Admin', 'admin staff', 'operatives', 'adhoc'];

const AdminNotificationCreate: React.FC = () => {
  const [create, { isLoading }] = useCreateAdminNotificationMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: '',
    targetRoles: [] as string[],
    excludeSuperAdmin: false,
  });

  const handleRoleToggle = (role: string) => {
    setForm(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation: require at least one target role
    if (form.targetRoles.length === 0) {
      alert('Please select at least one target role.');
      return;
    }
    try {
      await create(form).unwrap();
      navigate('/dashboard/manage-notification');
    } catch (err) {
      console.error('Failed to create notification', err);
      alert('Failed to create notification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Notification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to send a new notification to selected roles.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., System Maintenance"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Write your notification message here..."
              />
            </div>

            {/* Type (optional) */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type (optional)
              </label>
              <input
                type="text"
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., info, warning, update"
              />
            </div>

            {/* Target Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Roles <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {roles.map(role => (
                  <label
                    key={role}
                    className={`
                      inline-flex items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all
                      ${
                        form.targetRoles.includes(role)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.targetRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
              {form.targetRoles.length === 0 && (
                <p className="mt-2 text-sm text-red-600">Please select at least one role.</p>
              )}
            </div>

            {/* Exclude Super Admin */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="excludeSuperAdmin"
                checked={form.excludeSuperAdmin}
                onChange={(e) => setForm({ ...form, excludeSuperAdmin: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="excludeSuperAdmin" className="ml-2 block text-sm text-gray-700">
                Exclude Super Admin (if selected above)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center items-center px-6 py-3 bg-[#1969fe] hover:bg-blue-700 text-white font-medium rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 -ml-1" size={20} />
                    Create Notification
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/manage-notification')}
                className="inline-flex justify-center items-center px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-[6px] transition-colors"
              >
                <FiXCircle className="mr-2 -ml-1" size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationCreate;