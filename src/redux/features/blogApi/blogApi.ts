import { api } from "@/redux/api/apiSlice";

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'blog-post',
    }),
    getPostById: builder.query({
      query: (id) => `blog-post/${id}`,
    }),
  })
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery
} = blogApi;