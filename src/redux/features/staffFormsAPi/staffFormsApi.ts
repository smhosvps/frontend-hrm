import { api } from "@/redux/api/apiSlice";

export const stafformsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStaffForm: builder.mutation({
      query: (formData) => ({
        url: 'staff-forms',
        method: 'POST',
        body: formData,
      }),
    }),
    
    getAllStaffForms: builder.query({
      query: () => ({
        url: 'staff-forms',
      }),
    }),
    
    getStaffFormById: builder.query({
      query: (id) => `staff-forms/${id}`,
    }),
    
    searchByEmail: builder.query({
      query: (email) => ({
        url: 'staff-forms/search/email',
        params: { email },
      }),
    }),
    
    updateStaffForm: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff-forms/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    
    deleteStaffForm: builder.mutation({
      query: (id) => ({
        url: `staff-forms/${id}`,
        method: 'DELETE',
      }),
    }),
    
    bulkDeleteStaffForms: builder.mutation({
      query: (ids) => ({
        url: 'staff-forms',
        method: 'DELETE',
        body: ids,
      }),
    }),
  }),
});

export const {
  useCreateStaffFormMutation,
  useGetAllStaffFormsQuery,
  useGetStaffFormByIdQuery,
  useSearchByEmailQuery,
  useUpdateStaffFormMutation,
  useDeleteStaffFormMutation,
  useBulkDeleteStaffFormsMutation,
} = stafformsApi;