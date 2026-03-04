import { api } from "@/redux/api/apiSlice";

export const audioStreamApi = api.injectEndpoints({
    endpoints: (builder) => ({
    getAudioStreams: builder.query({
      query: () => "all-audio-stream",
    }),
    createAudioStream: builder.mutation({
      query: (newStream) => ({
        url: "create-audio-stream",
        method: "POST",
        body: newStream,
      }),
    }),
    updateAudioStream: builder.mutation({
      query: ({ _id, ...patch }) => ({
        url: `update-audio-stream/${_id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteAudioStream: builder.mutation<void, string>({
      query: (id) => ({
        url: `delete-audio-stream/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetAudioStreamsQuery,
  useCreateAudioStreamMutation,
  useUpdateAudioStreamMutation,
  useDeleteAudioStreamMutation,
} = audioStreamApi

