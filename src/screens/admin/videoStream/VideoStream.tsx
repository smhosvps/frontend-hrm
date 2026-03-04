import {
  useCreateVideoStreamMutation,
  useDeleteVideoStreamMutation,
  useGetVideoStreamsQuery,
  useUpdateVideoStreamMutation,
} from "@/redux/features/streams/videoStreamApi";
import { useState } from "react";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

type Props = {};

export default function VideoStream({}: Props) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const {
    data: videoStreams,
    isLoading,
    isError,
    refetch,
  } = useGetVideoStreamsQuery({});
  const [createVideoStream] = useCreateVideoStreamMutation();
  const [updateVideoStream] = useUpdateVideoStreamMutation();
  const [deleteVideoStream] = useDeleteVideoStreamMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStream, setCurrentStream] = useState<any>({
    facebook: "",
    youtube: "",
    salvation_tv: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateVideoStream(currentStream).unwrap();
        toast.success("Stream updated successfully");
      } else {
        await createVideoStream(currentStream).unwrap();
        toast.success("Stream created successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this stream?")) {
      try {
        await deleteVideoStream(id).unwrap();
        toast.success("Stream deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Delete failed. Please try again.");
      }
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentStream({ facebook: "", youtube: "", salvation_tv: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (stream: any) => {
    setIsEditMode(true);
    setCurrentStream(stream);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load video streams
      </div>
    );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVideoStreams =
    videoStreams?.stream?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil(
    (videoStreams?.stream?.length || 0) / itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Social Streams
        </h1>
        {videoStreams?.stream?.length === 0 && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add New Stream</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Facebook", "YouTube", "Salvation TV", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedVideoStreams.map((stream: any) => (
                <tr key={stream._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stream.facebook}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stream.youtube}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stream.salvation_tv}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex gap-3">
                    <button
                      onClick={() => openEditModal(stream)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(stream._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedVideoStreams.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No video streams found
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-500">
          Showing {paginatedVideoStreams.length} results
        </span>
      </div>

      <Modal isOpen={isModalOpen}>
        <div className="p-6 space-y-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Video Stream" : "Create New Video Stream"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["facebook", "youtube", "salvation_tv"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type="text"
                  value={currentStream[field] || ""}
                  onChange={(e) =>
                    setCurrentStream({
                      ...currentStream,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 outline-none transition-all"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              {isEditMode ? "Update Stream" : "Create Stream"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

const Modal = ({ isOpen, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full relative max-w-md bg-white rounded-xl shadow-2xl animate-in zoom-in-95">
        {children}
      </div>
    </div>
  );
};
