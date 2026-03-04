/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useArchiveAdminNotificationMutation,
  useGetAdminNotificationsQuery,
} from "@/redux/features/notificationsApi/notificationsApi";
import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiArchive } from "react-icons/fi";

const AdminNotificationList: React.FC = () => {
  const { data, isLoading, error } = useGetAdminNotificationsQuery();
  const [archive] = useArchiveAdminNotificationMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading notifications</p>
        <p className="text-sm">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-4 px-0 md:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Manage Notifications
        </h1>
        <Link
          to="/dashboard/create-notification"
          className="inline-flex items-center px-4 py-2 bg-[#1969fe] hover:bg-blue-700 text-white font-medium rounded-[6px] transition-colors duration-200"
        >
          <FiPlus className="mr-2 -ml-1" size={20} />
          Create New Notification
        </Link>
      </div>

      {/* Table container */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exclude Super Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.notifications.map((notif: any) => (
                <tr key={notif._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {notif.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notif.targetRoles.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notif.excludeSuperAdmin
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {notif.excludeSuperAdmin ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notif.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {notif.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notif.createdBy?.firstName} {notif.createdBy?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/detail-notification/${notif._id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-[6px] transition-colors mr-2"
                    >
                      <FiEye className="mr-1" size={16} />
                      View
                    </Link>
                    {notif.status === "active" && (
                      <button
                        onClick={() => archive(notif._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-[6px] transition-colors"
                      >
                        <FiArchive className="mr-1" size={16} />
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(!data?.notifications || data.notifications.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No notifications found. Click "Create New Notification" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationList;