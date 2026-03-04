import { api } from "@/redux/api/apiSlice"

export const inspirationApi = api.injectEndpoints({
    endpoints: (builder) => ({
    getLatestInspiration: builder.query({
      query: () => "latest-live-inspiration",
    }),
    getAllInspirations: builder.query({
      query: () => "all-inspiration",
    }),
    createInspiration: builder.mutation({
      query: (newInspiration) => ({
        url: "create-inspiration",
        method: "POST",
        body: newInspiration,
      }),

    }),
    updateInspiration: builder.mutation({
      query: ({ _id, ...patch }) => ({
        url: `update-inspiration/${_id}`,
        method: "PUT",
        body: patch,
      }),

    }),
    deleteInspiration: builder.mutation({
      query: (id) => ({
        url: `delete-inspiration/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetLatestInspirationQuery,
  useGetAllInspirationsQuery,
  useCreateInspirationMutation,
  useUpdateInspirationMutation,
  useDeleteInspirationMutation,
} = inspirationApi

