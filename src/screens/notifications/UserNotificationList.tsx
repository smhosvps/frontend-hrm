import { useGetUserQuery } from "@/redux/api/apiSlice";
import {
  useAcknowledgeNotificationMutation,
  useGetUserNotificationsQuery,
} from "@/redux/features/notificationsApi/notificationsApi";
import React, { useState } from "react";
import { FiBell, FiCheckCircle, FiClock } from "react-icons/fi";

const UserNotificationList: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetUserNotificationsQuery();
  const { data: userData } = useGetUserQuery();
  const [acknowledge] = useAcknowledgeNotificationMutation();
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const user = userData?.user;
  const userId = user?._id;

  const handleAcknowledge = async (receiptId: string) => {
    setAcknowledgingId(receiptId);
    try {
      await acknowledge({ receiptId, userId }).unwrap();
      // Manually refetch after successful acknowledgment
      refetch();
    } catch (err) {
      console.error("Failed to acknowledge", err);
    } finally {
      setAcknowledgingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-7xl mx-auto mt-8">
        <p className="font-medium">Failed to load notifications</p>
        <p className="text-sm">Please try again later.</p>
      </div>
    );
  }

  const notifications = data?.notifications || [];

  return (
    <div className="px-0 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
          My Notifications
        </h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
        </span>
      </div>

      {/* Notifications grid */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-1">
            When you receive notifications, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {notifications.map((item) => {
            const isUnread = item.status === "unread";
            const isThisAcknowledging = acknowledgingId === item._id;
            return (
              <div
                key={item._id}
                className={`bg-white/70 rounded-[6px] shadow-md border ${
                  isUnread ? "border-l-4 border-l-[#1969fe]" : "border-gray-200"
                } overflow-hidden hover:shadow-lg transition-shadow duration-200`}
              >
                <div className="p-4 sm:p-5">
                  {/* Header with title and status */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {item.notification.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isUnread
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isUnread ? (
                        <>
                          <FiClock className="mr-1" size={12} />
                          Unread
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="mr-1" size={12} />
                          Read
                        </>
                      )}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {item.notification.message}
                  </p>

                  {/* Footer: timestamp and action */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="text-xs text-gray-500">
                      <FiClock className="inline mr-1" size={12} />
                      Received: {new Date(item.receivedAt).toLocaleString()}
                    </div>
                    {isUnread ? (
                      <button
                        onClick={() => handleAcknowledge(item._id)}
                        disabled={isThisAcknowledging}
                        className={`inline-flex items-center px-3 py-1.5 justify-center md:justify-start bg-[#1969fe] hover:bg-blue-700 text-white text-sm font-medium rounded-[6px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          isThisAcknowledging ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isThisAcknowledging ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Acknowledging...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="mr-1.5" size={16} />
                            Mark as Read
                          </>
                        )}
                      </button>
                    ) : (
                      item.readAt && (
                        <span className="text-xs text-gray-400 flex items-center">
                          <FiCheckCircle className="mr-1" size={12} />
                          Read {new Date(item.readAt).toLocaleDateString()}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotificationList;