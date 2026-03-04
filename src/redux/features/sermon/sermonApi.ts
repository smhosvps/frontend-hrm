import { api } from "@/redux/api/apiSlice";

export const sermonApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createSermon: builder.mutation({
            query: (formData) => ({
                url: "create-sermon",
                method: "POST",
                body: formData,
                credentials: "include" as const
            })
        }),
        getAllSermon: builder.query({
            query: () => ({
                url: "all-sermon",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteSermon: builder.mutation({
            query: (id) => ({
                url: `delete-sermon/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
        editSermon: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-sermon/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllCountSermon: builder.query({
            query: () => ({
                url: "all-sermon-count",
                method: "GET",
                credentials: "include" as const
            })
        }),

    })
})

export const {
   useCreateSermonMutation,
   useGetAllSermonQuery,
   useDeleteSermonMutation,
   useEditSermonMutation,
   useGetAllCountSermonQuery
} = sermonApi;