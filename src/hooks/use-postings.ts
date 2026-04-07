import {
  Posting,
  useAddPostingMutation,
  useDeletePostingMutation,
  useGetPostingsQuery,
  useUpdatePostingMutation,
} from "@/redux/features/securityPostingApi/securityPostingApi";

export const usePostings = () => {
  const {
    data: postings = [],
    isLoading,
    error,
    refetch,
  } = useGetPostingsQuery();
  const [addPostingMutation] = useAddPostingMutation();
  const [updatePostingMutation] = useUpdatePostingMutation();
  const [deletePostingMutation] = useDeletePostingMutation();

  const addPosting = async (newPosting: Omit<Posting, "id">) => {
    return await addPostingMutation(newPosting).unwrap();
  };

  const updatePosting = async (
    id: string,
    updatedPosting: Omit<Posting, "id">
  ) => {
    return await updatePostingMutation({ id, data: updatedPosting }).unwrap();
  };

  const deletePosting = async (id: string) => {
    await deletePostingMutation(id).unwrap();
  };

  return {
    postings,
    isLoading,
    error,
    addPosting,
    updatePosting,
    deletePosting,
    refetch,
  };
};

export type { Posting };
