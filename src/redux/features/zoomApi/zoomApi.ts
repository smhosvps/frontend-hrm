import { api } from "@/redux/api/apiSlice";

export const zoomApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create meeting (Admin/Instructor only)
 createMeeting: builder.mutation({
      query: (meetingData) => ({
        url: 'create-meeting',
        method: 'POST',
        body: meetingData, // now includes targetRoles, excludeSuperAdmin
      }),
    }),
    // Get all meetings
    getAdminMeetings: builder.query({
      query: () => "meetings",
    }),
    // Get single meeting
    getMeeting: builder.query({
      query: (meetingId) => `meetings/${meetingId}`,
    }),

    // Delete meeting (Admin/Instructor only)
    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `delete-meeting/${meetingId}`,
        method: "DELETE",
      }),
    }),

    // update meeting
    updateMeeting: builder.mutation({
      query: ({ id, ...meetingData }) => ({
        url: `update-meeting/${id}`,
        method: "PUT",
        body: meetingData,
      }),
    }),
    getUserMeetings: builder.query({
      query: () => "user-zoom-meetings",
    }),
    acknowledgeMeeting: builder.mutation({
      query: (receiptId) => ({
        url: `acknowledge-meeting/${receiptId}/acknowledge`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useGetAdminMeetingsQuery,
  useGetMeetingQuery,
  useDeleteMeetingMutation,
  useUpdateMeetingMutation,
    useGetUserMeetingsQuery,
  useAcknowledgeMeetingMutation,
} = zoomApi;
