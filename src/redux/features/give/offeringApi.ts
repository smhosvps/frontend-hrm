import { api } from "@/redux/api/apiSlice";


export const offeringApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOffering: builder.query({
            query: () => ({
                url: "all-offering",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getAllCathedral: builder.query({
            query: () => ({
                url: "all-cathedral-seed",
                method: "GET",
                credentials: "include" as const 
            })
        }),
        getTotalOffering: builder.query({
            query: () => ({ 
                url: "income-offering", 
                method: "GET",
                credentials: "include" as const
            })
        }),
        getUserOfferings: builder.query({
            query: (userId) => `user-give-details/${userId}`,
        }),
    })
})

export const {
    useGetAllOfferingQuery,
    useGetAllCathedralQuery,
    useGetTotalOfferingQuery,
    useGetUserOfferingsQuery
} = offeringApi;