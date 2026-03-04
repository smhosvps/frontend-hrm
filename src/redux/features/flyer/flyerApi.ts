import { api } from "@/redux/api/apiSlice";


export const sliderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createFlyer: builder.mutation({
            query: (data) => ({
                url: "create-flyer",
                method: "POST",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllFlyer: builder.query({
            query: () => ({
                url: "all-flyer",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteFlyer: builder.mutation({
            query: (id) => ({
                url: `delete-flyer/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
        editFlyer: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-flyer/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),
    })
})

export const {
    useCreateFlyerMutation,
    useDeleteFlyerMutation,
    useEditFlyerMutation,
    useGetAllFlyerQuery
} = sliderApi;