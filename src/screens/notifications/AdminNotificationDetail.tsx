/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetAdminNotificationDetailQuery } from '@/redux/features/notificationsApi/notificationsApi';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiUser,
  FiEye,
} from 'react-icons/fi';

const AdminNotificationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetAdminNotificationDetailQuery(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading notification</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { notification, stats, receipts }:any = data;

  return (
    <div className="p-4 md:p-6">
      {/* Back button */}
      <Link
        to="/dashboard/manage-notification"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" size={20} />
        Back to Notifications
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{notification.title}</h1>
        <p className="text-gray-600 flex items-center">
          <FiMail className="mr-2" size={18} />
          {notification.message}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="mr-2" size={20} />
            Target Information
          </h2>
          <dl className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Target Roles:</dt>
              <dd className="text-sm text-gray-900 mt-1 sm:mt-0">
                {notification.targetRoles.join(', ')}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Exclude Super Admin:</dt>
              <dd className="text-sm mt-1 sm:mt-0">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    notification.excludeSuperAdmin
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {notification.excludeSuperAdmin ? 'Yes' : 'No'}
                </span>
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Status:</dt>
              <dd className="text-sm mt-1 sm:mt-0">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    notification.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {notification.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUser className="mr-2" size={20} />
            Created By
          </h2>
          <dl className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Name:</dt>
              <dd className="text-sm text-gray-900 mt-1 sm:mt-0">
                {notification.createdBy?.firstName} {notification.createdBy?.lastName}
              </dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Email:</dt>
              <dd className="text-sm text-gray-900 mt-1 sm:mt-0">{notification.createdBy?.email}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <dt className="text-sm font-medium text-gray-500 sm:w-32">Created At:</dt>
              <dd className="text-sm text-gray-900 mt-1 sm:mt-0">
                {new Date(notification.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-5 flex items-center">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <FiUsers className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Receipts</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-5 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Read</p>
            <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
          </div>
        </div>
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-5 flex items-center">
          <div className="rounded-full bg-gray-100 p-3 mr-4">
            <FiClock className="text-gray-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Unread</p>
            <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
          </div>
        </div>
      </div>

      {/* User Receipts Table */}
      <div className="bg-white shadow-md rounded-[10px] overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiEye className="mr-2" size={20} />
            User Receipts
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((r: any) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.userId.firstName} {r.userId.lastName}
                    <span className="text-gray-500 text-xs block">{r.userId.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.userId.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        r.status === 'read'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.readAt ? new Date(r.readAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No receipts found for this notification.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination info (if needed) */}
        {data.pagination && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            Showing page {data.pagination.page} of {Math.ceil(stats.total / data.pagination.limit)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationDetail;