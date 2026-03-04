import { api } from "@/redux/api/apiSlice";

export const ananimousApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllOfflineTithe: builder.query({
            query: () => ({
                url: "all-offline-tithes",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getAllOfflineTitheCount: builder.query({
            query: () => ({
                url: "count-offline-tithe",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getTotalOfflineTitheIncome: builder.query({
            query: () => ({
                url: "income-offline-tithe",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getTitheByNumber: builder.query({
            query: (tithe_number) => `/get-my-tithes/${tithe_number}`,
        }),
    })
})

export const {
   useGetAllOfflineTitheQuery,
   useGetTotalOfflineTitheIncomeQuery,
   useGetAllOfflineTitheCountQuery,
   useGetTitheByNumberQuery
} = ananimousApi;