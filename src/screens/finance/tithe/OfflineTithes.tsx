import { useState, useMemo } from "react";
import { useGetAllOfflineTitheQuery } from "@/redux/features/give/titheApi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SortKeys = "currency" | "amount" | "name" | "month" | "createdAt" | "tithe_number";
type SortOrder = "asc" | "desc";
type CurrencyFilter = "all" | "USD" | "NGN";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function OfflineTithes() {
  const { data, isLoading } = useGetAllOfflineTitheQuery({});
  const [sortKey, setSortKey] = useState<SortKeys>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleSort = (key: SortKeys) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!data?.offerings) return [];
    
    return [...data.offerings]
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.tithe_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCurrency = currencyFilter === "all" || item.currency === currencyFilter;
        const matchesDate = selectedDate ? 
          new Date(item.createdAt).toISOString().split('T')[0] === selectedDate : true;
        
        return matchesSearch && matchesCurrency && matchesDate;
      })
      .sort((a, b) => {
        if (sortKey === "month") {
          const monthA = MONTHS.indexOf(a.month);
          const monthB = MONTHS.indexOf(b.month);
          return sortOrder === "asc" ? monthA - monthB : monthB - monthA;
        }
        
        if (sortKey === "amount") {
          return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
        }
        
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        return sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [data?.offerings, searchTerm, currencyFilter, selectedDate, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIndicator = ({ sortKey: key }: { sortKey: SortKeys }) => {
    if (sortKey !== key) return <FaSort className="ml-2" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="ml-2" />
    ) : (
      <FaSortDown className="ml-2" />
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or tithe number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-4 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={currencyFilter}
            onChange={(e) => {
              setCurrencyFilter(e.target.value as CurrencyFilter);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Currencies</option>
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton height={50} count={5} className="mb-2" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: "name", label: "Name" },
                    { key: "tithe_number", label: "Tithe Number" },
                    { key: "amount", label: "Amount" },
                    { key: "currency", label: "Currency" },
                    { key: "month", label: "Month" },
                    { key: "branch", label: "Branch" },
                    { key: "createdAt", label: "Date" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                      onClick={() => handleSort(header.key as SortKeys)}
                    >
                      <div className="flex items-center">
                        {header.label}
                        <SortIndicator sortKey={header.key as SortKeys} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((tithe) => (
                  <tr key={tithe._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tithe.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tithe.tithe_number}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {tithe.currency === "NGN" ? "₦" : "$"}
                        {tithe.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium capitalize rounded-full bg-blue-100 text-blue-800">
                        {tithe.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tithe.month}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tithe.branch}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(tithe.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tithes found
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
              {sortedData.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>
              
              <span className="px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}