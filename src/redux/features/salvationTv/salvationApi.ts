import { api } from "@/redux/api/apiSlice";

export const salvationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createTv: builder.mutation({
            query: ({
                url,
                isApprove,
                title,
                lang,
                thumbnail,
            }) => ({
                url: "create-channel",
                method: "POST",
                body: {
                    url,
                    isApprove,
                    title,
                    lang,
                    thumbnail
                },
                credentials: "include" as const
            })
        }),
        getTv: builder.query({
            query: () => ({
                url: "all-channel",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getTvAll: builder.query({
            query: () => ({
                url: "all-channel-users",
                method: "GET",
                credentials: "include" as const
            })
        }),
        editTv: builder.mutation({
            query: ({ idx, url,
                isApprove,
                thumbnail,
                title,
                lang }) => ({
                url: `edit-channel/${idx}`,
                method: "PUT",
                body:{url,
                    isApprove,
                    title,
                    thumbnail,
                    lang,
                },
                credentials: "include" as const
            })
        }),
        deleteTv: builder.mutation({
            query: (id) => ({
                url: `delete-channel/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),

    })
})

export const {
    useCreateTvMutation,
    useDeleteTvMutation,
    useEditTvMutation,
    useGetTvQuery, 
    useGetTvAllQuery
} = salvationApi;