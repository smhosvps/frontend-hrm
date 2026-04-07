import { api } from "@/redux/api/apiSlice";

export interface Query {
  _id: string;
  user: { _id: string; firstName: string; lastName: string; email: string };
  admin: { _id: string; firstName: string; lastName: string; email: string };
  title: string;
  content: string;
  response?: string;
  status: "pending" | "responded" | "closed";
  createdAt: string;
  updatedAt: string;
}


export const querriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQueries: builder.query<Query[], void>({
      query: () => "queries",
    }),
    getQueriesByUser: builder.query<Query[], string>({
      query: (userId) => `queries/${userId}`,
    }),
    createQuery: builder.mutation<
      Query,
      { user: string; title: string; content: string }
    >({
      query: (data) => ({
        url: "queries",
        method: "POST",
        body: data,
      }),
    }),
    updateQuery: builder.mutation<Query, { id: string; data: Partial<Query> }>({
      query: ({ id, data }) => ({
        url: `queries/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteQuery: builder.mutation<void, string>({
      query: (id) => ({
        url: `queries/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});




export const {
  useCreateQueryMutation,
  useDeleteQueryMutation,
  useGetQueriesByUserQuery,
  useGetQueriesQuery,
  useUpdateQueryMutation,
} = querriesApi;
