import { useState } from 'react';
import { Posting } from '@/hooks/use-postings';
import { useGetBatchQuery, useGetPostingsQuery } from '@/redux/features/securityPostingApi/securityPostingApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BarChart3, Moon, Sun, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PostingTableProps {
  postings?: Posting[];
  isAdmin?: boolean;
}

export function PostingTable({ postings: customPostings }: PostingTableProps) {
  const { data: fetchedPostings = [], isLoading: isLoadingPostings } = useGetPostingsQuery();
  const { data: batch, isLoading: isLoadingBatch } = useGetBatchQuery();
  const postings = customPostings || fetchedPostings;
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate statistics
  const totalPostings = postings.length;
  const dayShifts = postings.filter(p => p.shift === 'DAY').length;
  const nightShifts = postings.filter(p => p.shift === 'NIGHT').length;

  // Pagination calculations
  const totalPages = Math.ceil(totalPostings / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPostings = postings.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to first page
  };

  
 if ((isLoadingPostings || isLoadingBatch) && !customPostings) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header Section - dynamic from batch */}
        <div className="bg-white rounded-lg p-8 mb-8 relative">
          {/* Stats Icon Button */}
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="absolute top-4 right-4 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="View Statistics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">
              {batch?.organization || 'SALVATION MINISTRIES'}
            </h1>
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {batch?.department || 'DEPARTMENT OF CHURCH SECURITY (GLORIOUS OPERATIVES)'}
            </p>
            <div className="border-t-2 border-b-2 border-blue-900 py-4">
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                {batch?.title || 'TWO WEEKS POSTING'}
              </h2>
              <p className="text-sm font-semibold text-gray-700">
                {batch?.period || 'Sunday 5th - 18th April 2026'}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                RESUMPTION TIME: {batch?.resumptionTime || '00HRS'}, CLOSING: {batch?.closingTime || '00HRS'}
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm w-16">
                    S/N
                  </th>
                  <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">
                    BEATS/LOCATIONS
                  </th>
                  <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm">
                    SHIFT
                  </th>
                  <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">
                    OPERATIVES ON DUTY
                  </th>
                  <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-sm">
                    OFF DUTY
                  </th>
                  <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-sm">
                    RELIEVER
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPostings.map((posting, index) => (
                  <tr
                    key={posting.id}
                    className={`${
                      (startIndex + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-100 transition-colors`}
                  >
                    <td className="border border-gray-400 px-4 py-3 text-center font-semibold text-gray-700 text-sm">
                      {startIndex + index + 1}
                    </td>
                    <td className="border border-gray-400 px-4 py-3 font-semibold text-blue-900 text-sm">
                      {posting.location}
                    </td>
                    <td
                      className={`border border-gray-400 px-4 py-3 text-center font-bold text-sm ${
                        posting.shift === 'NIGHT' ? 'text-blue-600' : 'text-blue-600'
                      }`}
                    >
                      {posting.shift}
                    </td>
                    <td className="border border-gray-400 px-4 py-3 font-semibold text-gray-900 text-sm">
                      {posting.operativeOnDuty}
                    </td>
                    <td
                      className={`border border-gray-400 px-4 py-3 text-center font-semibold text-sm ${
                        posting.offDuty.includes('th') ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      {posting.offDuty}
                    </td>
                    <td
                      className={`border border-gray-400 px-4 py-3 font-semibold text-sm ${
                        posting.reliever === 'GO' ? 'text-teal-600 font-bold' : 'text-gray-900'
                      }`}
                    >
                      {posting.reliever}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPostings > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalPostings)} of {totalPostings} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-900 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Modal */}
        <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Posting Statistics
              </DialogTitle>
              <DialogDescription>
                Detailed breakdown of all security postings
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Shift Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-teal-700 mb-2">
                    <Sun className="w-5 h-5" />
                    <span className="font-semibold">Day Shifts</span>
                  </div>
                  <p className="text-3xl font-bold text-teal-600">{dayShifts}</p>
                  <p className="text-sm text-teal-500 mt-1">
                    {totalPostings > 0 ? ((dayShifts / totalPostings) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-indigo-700 mb-2">
                    <Moon className="w-5 h-5" />
                    <span className="font-semibold">Night Shifts</span>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{nightShifts}</p>
                  <p className="text-sm text-indigo-500 mt-1">
                    {totalPostings > 0 ? ((nightShifts / totalPostings) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              </div>

              {/* Quick Stats Footer */}
              <div className="border-t pt-4 text-center text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}