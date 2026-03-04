import { api } from "@/redux/api/apiSlice";

// Define types
export interface Schedule {
    _id: string;
    date: string;
    info: string;
    targetRoles: string[];
    excludeSuperAdmin: boolean;
    status: 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
    stats?: { total: number; read: number; unread: number };
}

export interface ScheduleReceipt {
    _id: string;
    scheduleId: Schedule;
    userId: any;
    status: 'unread' | 'read';
    readAt?: string;
    createdAt: string;
}

export const scheduleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Admin endpoints
        createSchedule: builder.mutation<Schedule, { info: string; date: string; targetRoles: string[]; excludeSuperAdmin: boolean }>({
            query: (body) => ({
                url: "admin-create-schedule",
                method: "POST",
                body,
                credentials: "include" as const,
            }),
        }),
        getAllSchedule: builder.query<{ schedules: Schedule[] }, void>({
            query: () => ({
                url: "admin-get-all-schedule",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        updateSchedule: builder.mutation<Schedule, { id: string; info?: string; date?: string; status?: 'active' | 'archived' }>({
            query: ({ id, ...body }) => ({
                url: `admin-edit-schedule/${id}`,
                method: "PUT",
                body,
                credentials: "include" as const,
            }),
        }),
        archiveSchedule: builder.mutation<Schedule, string>({
            query: (id) => ({
                url: `admin-archive-schedule/${id}`,
                method: "PATCH",
                credentials: "include" as const,
            }),
        }),
        deleteSchedule: builder.mutation<void, string>({
            query: (id) => ({
                url: `admin-delete-schedule/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
        }),

        // User endpoints
        getUserSchedules: builder.query<{ schedules: Array<{ _id: string; schedule: Schedule; status: string; readAt?: string; receivedAt: string }> }, void>({
            query: () => ({
                url: "all-user-schedule",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        acknowledgeSchedule: builder.mutation<{ receipt: ScheduleReceipt }, string>({
            query: (id) => ({
                url: `user-schedule/${id}/acknowledge`,
                method: "PATCH",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useCreateScheduleMutation,
    useGetAllScheduleQuery,
    useUpdateScheduleMutation,
    useArchiveScheduleMutation,
    useDeleteScheduleMutation,
    useGetUserSchedulesQuery,
    useAcknowledgeScheduleMutation,
} = scheduleApi;