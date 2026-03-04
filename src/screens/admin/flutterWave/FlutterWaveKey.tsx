
// src/components/ItemManager.tsx
import { useCreateFlutterKeyMutation, useGetFlutterKeyQuery, useUpdateFlutterKeyMutation } from '@/redux/features/flutterWaveApi/flutterwaveApi';
import React, { useState, useEffect } from 'react';


type Props = {}

export default function FlutterWaveKey({}: Props) {
  const { data, isLoading, isError, refetch } = useGetFlutterKeyQuery({});
  const [createItem, { isLoading: isCreating, isSuccess: createSuccess, error: createError }] = useCreateFlutterKeyMutation();
  const [updateFlutterKey, { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError }] = useUpdateFlutterKeyMutation();




  const item = data && data?.item

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    apiKey: '',
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item._id,
        name: item.name,
        apiKey: item.apiKey,
      });
    }
  }, [item]);

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      showNotification(
        createSuccess ? 'Item created successfully!' : 'Item updated successfully!',
        'success'
      );
      refetch();
    }
  }, [createSuccess, updateSuccess, refetch]);

  useEffect(() => {
    if (createError || updateError) {
      const error = (createError || updateError) as any;
      showNotification(
        error?.data?.error || 'An error occurred',
        'error'
      );
    }
  }, [createError, updateError]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateFlutterKey(formData); 
    } else {
      createItem(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load item data.</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {item ? 'Edit Flutterwave' : 'Create Flutterwave'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-600  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isCreating || isUpdating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCreating || isUpdating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : item ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>

      {item && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-sm md:text-xl font-semibold text-gray-900">Flutterwave API Key Details</h3>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p className='text-sm md:text-lg font-medium'>Name: {item?.name}</p>
            <p className='text-sm md:text-lg font-medium '>Api Key: <strong className='text-green-600'>{item?.apiKey}</strong></p>
            <p className='text-sm md:text-lg text-gray-600 font-medium'>Created: {new Date(item.createdAt || '').toLocaleString()}</p>
            <p className='text-sm md:text-lg text-gray-600 font-medium'>Last Updated: {new Date(item.updatedAt || '').toLocaleString()}</p>
          </div>
        </div>
      )}

      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
