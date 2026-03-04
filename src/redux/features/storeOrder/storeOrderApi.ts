import { api } from "@/redux/api/apiSlice";

export const storeOrderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrder: builder.query({
      query: () => ({
        url: "get-all-ebook",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    oderCount: builder.query({
      query: () => ({
        url: "order-count",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    totalIncome: builder.query({
      query: () => ({
        url: "total-order",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getMonthlySales: builder.query({
      query: () => "monthly-sales",
    }),
    getYearlySales: builder.query({
      query: (year) => `yearly?year=${year}`,
    }),
  }),
});

export const {
  useOderCountQuery,
  useTotalIncomeQuery,
  useGetAllOrderQuery,
  useGetMonthlySalesQuery,
  useGetYearlySalesQuery
} = storeOrderApi;
