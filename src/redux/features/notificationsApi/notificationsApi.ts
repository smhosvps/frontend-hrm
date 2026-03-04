import { api } from "@/redux/api/apiSlice";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  type?: string;
  targetRoles: string[];
  excludeSuperAdmin: boolean;
  createdBy: User;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface NotificationReceipt {
  _id: string;
  notificationId: AdminNotification;
  userId: User;
  status: "unread" | "read";
  readAt?: string;
  createdAt: string;
}

export interface NotificationDetail extends AdminNotification {
  stats: { total: number; read: number; unread: number };
  receipts: Array<NotificationReceipt & { userId: User }>;
  pagination: { page: number; limit: number };
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Admin endpoints
    getAdminNotifications: builder.query<
      { notifications: AdminNotification[] },
      void
    >({
      query: () => "admin-manage-notification-get",
    }),
    getAdminNotificationDetail: builder.query<NotificationDetail, string>({
      query: (id) => `admin-manage-notification-get-details/${id}`,
    }),
    createAdminNotification: builder.mutation<
      AdminNotification,
      Partial<AdminNotification>
    >({
      query: (body) => ({
        url: "admin-manage-notification-create",
        method: "POST",
        body,
      }),
    }),
    archiveAdminNotification: builder.mutation<AdminNotification, string>({
      query: (id) => ({
        url: `admin-manage-notification-arch/${id}/archive`,
        method: "PATCH",
      }),
    }),

    // User endpoints
    getUserNotifications: builder.query<
      {
        notifications: Array<{
          _id: string;
          notification: AdminNotification;
          status: string;
          readAt?: string;
          receivedAt: string;
        }>;
      },
      void
    >({
      query: () => "get-user-notification",
    }),
    acknowledgeNotification: builder.mutation<
      { receipt: NotificationReceipt },
      { receiptId: string; userId: string }
    >({
      query: ({ receiptId, userId }) => ({
        url: `get-user-notification/${receiptId}/acknowledge/${userId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationDetailQuery,
  useCreateAdminNotificationMutation,
  useArchiveAdminNotificationMutation,
  useGetUserNotificationsQuery,
  useAcknowledgeNotificationMutation,
} = notificationApi;
