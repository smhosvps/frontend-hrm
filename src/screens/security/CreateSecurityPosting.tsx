
import { useState } from 'react';
import { usePostings, Posting } from '@/hooks/use-postings';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { PostingTable } from '@/components/PostingTable';
import { PostingForm } from '@/components/PostingForm';
import BatchForm from '@/components/BatchForm';


export default function CreateSecurityPosting() {
  const { postings, addPosting, updatePosting, deletePosting } = usePostings();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'manage' | 'batch'>('view');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAddPosting = async (data: Omit<Posting, 'id'>) => {
    await addPosting(data);
    setActiveTab('view');
  };

  const handleUpdatePosting = async (data: Omit<Posting, 'id'>) => {
    if (editingId !== null) {
      await updatePosting(editingId, data);
      setEditingId(null);
      setActiveTab('manage');
    }
  };

  const handleDeletePosting = async (id: string) => {
    await deletePosting(id);
    setShowDeleteConfirm(null);
  };

  const editingPosting = editingId ? postings.find(p => p.id === editingId) : undefined;

  return (
    <div className="min-h-screen py-4 lg:py-10">
      <div className="px-0 lg:px-4">
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg shadow p-4">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-2 font-semibold rounded-[6px] transition-colors ${
              activeTab === 'view'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            View All Postings
          </button>
          <button
            onClick={() => { setActiveTab('create'); setEditingId(null); }}
            className={`px-6 py-2 font-semibold rounded-[6px] transition-colors flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Plus size={18} /> Create Posting
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 font-semibold rounded-[6px] transition-colors ${
              activeTab === 'manage'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Manage Postings
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 py-2 font-semibold rounded-[6px] transition-colors ${
              activeTab === 'batch'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Edit Posting Info
          </button>
        </div>

        {activeTab === 'view' && <PostingTable postings={postings} isAdmin={false} />}

        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <PostingForm
              onSubmit={handleAddPosting}
              onCancel={() => setActiveTab('view')}
              submitLabel="Create Posting"
            />
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            {editingId ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                {editingPosting && (
                  <PostingForm
                    initialData={editingPosting}
                    onSubmit={handleUpdatePosting}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Update Posting"
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-blue-900">All Postings ({postings.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-800 text-white">
                        <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">LOCATION</th>
                        <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm">SHIFT</th>
                        <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">OPERATIVE</th>
                        <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm">OFF DUTY</th>
                        <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">RELIEVER</th>
                        <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postings.map((posting, index) => (
                        <tr
                          key={posting.id}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-blue-100 transition-colors`}
                        >
                          <td className="border border-gray-400 px-4 py-3 font-semibold text-blue-900 text-sm">
                            {posting.location}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 text-center font-bold text-teal-600 text-sm">
                            {posting.shift}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 font-semibold text-gray-900 text-sm">
                            {posting.operativeOnDuty}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 text-center font-semibold text-red-600 text-sm">
                            {posting.offDuty}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 font-semibold text-gray-900 text-sm">
                            {posting.reliever}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setEditingId(posting.id)}
                                className="p-2 bg-blue-500 text-white rounded-[6px] hover:bg-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(posting.id)}
                                className="p-2 bg-red-500 text-white rounded-[6px] hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {postings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No postings found. Create one to get started!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'batch' && <BatchForm />}

        {showDeleteConfirm !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this posting? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePosting(showDeleteConfirm)}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}