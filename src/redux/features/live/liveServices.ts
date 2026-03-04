import { api } from "@/redux/api/apiSlice";

export const liveApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createLiveFeed: builder.mutation({
            query: ({ info, status, videoId, country, flag }) => ({
                url: "create-live-stream",
                method: "POST",
                body: { info, status, videoId, country, flag},
                credentials: "include" as const
            })
        }),
        getLiveFeed: builder.query({
            query: () => ({
                url: "latest-live-stream",
                method: "GET",
                credentials: "include" as const
            })
        }),
        updateLiveFeed: builder.mutation({
            query: ({ id, info, status, videoId, country, flag }) => ({
                url: `update-live-stream/${id}`,
                method: "PUT",
                body: { info, status, videoId, country, flag },
                credentials: "include" as const
            })
        }),

        getAllLiveFeeds: builder.query({
            query: () => ({
                url: "all-live-stream",
                method: 'GET',
                credentials: "include" as const
            })
        }),
        deleteStream: builder.mutation({
            query: (id) => ({
                url: `delete-stream/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        })

    })
})

export const {
    useCreateLiveFeedMutation,
    useGetLiveFeedQuery,
    useUpdateLiveFeedMutation,
    useGetAllLiveFeedsQuery,
    useDeleteStreamMutation
} = liveApi;