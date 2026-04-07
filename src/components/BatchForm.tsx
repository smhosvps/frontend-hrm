'use client';

import { PostingBatch, useGetBatchQuery, useUpdateBatchMutation } from '@/redux/features/securityPostingApi/securityPostingApi';
import { useState, useEffect } from 'react';

export function BatchForm() {
  const { data: batch, isLoading, refetch } = useGetBatchQuery();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
  const [formData, setFormData] = useState<Partial<PostingBatch>>({
    organization: '',
    department: '',
    title: '',
    period: '',
    resumptionTime: '',
    closingTime: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (batch) {
      setFormData({
        organization: batch.organization,
        department: batch.department,
        title: batch.title,
        period: batch.period,
        resumptionTime: batch.resumptionTime,
        closingTime: batch.closingTime,
      });
    }
  }, [batch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBatch(formData).unwrap();
      setSuccessMsg('Batch information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update batch information');
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading batch info...</div>;

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-900">Posting Information</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded-[6px] hover:bg-blue-800"
          >
            Edit Information
          </button>
        </div>
        <div className="space-y-2 text-gray-700">
          <p><strong>Organization:</strong> {batch?.organization}</p>
          <p><strong>Department:</strong> {batch?.department}</p>
          <p><strong>Title:</strong> {batch?.title}</p>
          <p><strong>Period:</strong> {batch?.period}</p>
          <p><strong>Resumption Time:</strong> {batch?.resumptionTime}</p>
          <p><strong>Closing Time:</strong> {batch?.closingTime}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">Edit Posting Information</h3>
      {successMsg && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMsg}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Period</label>
          <input
            type="text"
            name="period"
            value={formData.period || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Resumption Time</label>
          <input
            type="text"
            name="resumptionTime"
            value={formData.resumptionTime || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Time</label>
          <input
            type="text"
            name="closingTime"
            value={formData.closingTime || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-[6px] hover:bg-blue-800 disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}