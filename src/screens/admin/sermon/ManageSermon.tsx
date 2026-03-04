import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSquarePlus } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { X, Loader2, Edit, Trash2, PlaySquare } from 'lucide-react'
import { useDeleteSermonMutation, useGetAllSermonQuery } from '@/redux/features/sermon/sermonApi'

interface Sermon {
  _id: string
  title: string
  category: string
  isApprove: boolean
  createdAt: string
  thumbnail: {
    url: string
  }
  videoId: string
}

export default function ManageSermon() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeModal, setActiveModal] = useState<'delete' | 'video' | null>(null)
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null)

  const { data, isLoading, refetch } = useGetAllSermonQuery({}, { refetchOnMountOrArgChange: true })
  const [deleteSermon] = useDeleteSermonMutation()

  const filteredSermons = data?.filter((sermon:any) => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSermons = filteredSermons.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage)

  const handleDelete = async () => {
    if (selectedSermon) {
      try {
        await deleteSermon(selectedSermon._id).unwrap()
        toast.success("Sermon deleted successfully")
        setActiveModal(null)
        refetch()
      } catch (error) {
        toast.error("Failed to delete sermon")
      }
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sermon Management</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search sermons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <Link 
            to="/dashboard/create-sermon"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <FaSquarePlus className="w-5 h-5" />
            <span>Create Sermon</span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Cover', 'Title', 'Category', 'Status', 'Created', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentSermons.map((sermon:any) => (
                <tr key={sermon._id} className="dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <img 
                      src={sermon.thumbnail?.url || "/noavatar.png"} 
                      alt="Thumbnail" 
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{sermon.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{sermon.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sermon.isApprove 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                    }`}>
                      {sermon.isApprove ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(sermon.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedSermon(sermon)
                        setActiveModal('video')
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      <PlaySquare className="w-5 h-5" />
                    </button>
                    <Link 
                      to={`/dashboard/edit-sermon/${sermon._id}`}
                      className="text-green-600 hover:text-green-900 dark:text-green-400"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedSermon(sermon)
                        setActiveModal('delete')
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentSermons.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No sermons found
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredSermons.length)}</span> of{' '}
              <span className="font-medium">{filteredSermons.length}</span> results
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
        {activeModal === 'delete' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">Delete Sermon</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this sermon?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {activeModal === 'video' && selectedSermon && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">Video Preview</h2>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedSermon.videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const Modal = ({ isOpen, onClose, children }: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        {children}
      </div>
    </div>
  )
}