// services/securityPostingApi.ts
import { api } from "@/redux/api/apiSlice";


export interface Posting {
  id: string;
  location: string;
  shift: 'DAY' | 'NIGHT';
  operativeOnDuty: string;
  offDuty: string;
  reliever: string;
}

export interface PostingBatch {
  _id: string;
  organization: string;
  department: string;
  title: string;
  period: string;
  resumptionTime: string;
  closingTime: string;
  createdAt: string;
}

export const securityPostingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPostings: builder.query<Posting[], void>({
      query: () => 'security-postings',

    }),
    addPosting: builder.mutation<Posting, Omit<Posting, 'id'>>({
      query: (newPosting) => ({
        url: 'security-postings',
        method: 'POST',
        body: newPosting,
      }),
    }),
    updatePosting: builder.mutation<Posting, { id: string; data: Omit<Posting, 'id'> }>({
      query: ({ id, data }) => ({
        url: `security-postings/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePosting: builder.mutation<void, string>({
      query: (id) => ({
        url: `security-postings/${id}`,
        method: 'DELETE',
      }),
    }),
    getBatch: builder.query<PostingBatch, void>({
      query: () => 'security-postings/batch',
    }),
    updateBatch: builder.mutation<PostingBatch, Partial<PostingBatch>>({
      query: (data) => ({
        url: 'security-postings/batch',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPostingsQuery,
  useAddPostingMutation,
  useUpdatePostingMutation,
  useDeletePostingMutation,
    useGetBatchQuery,
  useUpdateBatchMutation,
} = securityPostingApi;