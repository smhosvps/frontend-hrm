import { api } from "@/redux/api/apiSlice"


export const videoStreamApi = api.injectEndpoints({
    endpoints: (builder) => ({
    getVideoStreams: builder.query({
      query: () => "all-video-stream",
    }),
    createVideoStream: builder.mutation({
      query: (newStream) => ({ 
        url: "create-social-stream",
        method: "POST",
        body: newStream,
      }),
    }),
    updateVideoStream: builder.mutation({
      query: ({ _id, ...patch }) => ({
        url: `update-social-stream/${_id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteVideoStream: builder.mutation({
      query: (id) => ({
        url: `delete-video-stream/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetVideoStreamsQuery,
  useCreateVideoStreamMutation,
  useUpdateVideoStreamMutation,
  useDeleteVideoStreamMutation,
} = videoStreamApi

