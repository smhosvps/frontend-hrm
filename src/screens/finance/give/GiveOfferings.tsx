import { useState, useMemo } from "react";
import { useGetAllOfferingQuery } from "@/redux/features/give/offeringApi";
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaDownload } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";

type SortKeys = "type" | "amount" | "name" | "createdAt" | "branch";
type SortOrder = "asc" | "desc";
type OfferingType = "all" | "anonymous" | "offering" | "evangelism" | "tithe";
type CurrencyFilter = "all" | "USD" | "NGN";

export default function GiveOfferings() {
  const { data, isLoading } = useGetAllOfferingQuery({});
  const [sortKey, setSortKey] = useState<SortKeys>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedType, setSelectedType] = useState<OfferingType>("all");
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>("all");

  const handleSort = (key: SortKeys) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!data?.offerings) return [];
    
    return data.offerings.filter((item:any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || item.type.toLowerCase() === selectedType;
      const matchesCurrency = currencyFilter === "all" || item.currency === currencyFilter;
      
      return matchesSearch && matchesType && matchesCurrency;
    });
  }, [data?.offerings, searchTerm, selectedType, currencyFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortKey, sortOrder]);

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

  const handleCSVExport = () => {
    const headers = "Name,Amount,Currency,Type,Branch,Date\n";
    const csvContent = sortedData
      .map((item) => {
        const name = item.type === "anonymous" ? "Anonymous" : `"${item.name}"`;
        return `${name},${item.amount},${item.currency},${item.type},"${
          item.branch
        }",${new Date(item.createdAt).toLocaleDateString()}`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offerings_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as OfferingType);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="anonymous">Anonymous</option>
            <option value="offering">Offering</option>
            <option value="evangelism">Evangelism</option>
            <option value="tithe">Tithe</option>
          </select>

          <select
            value={currencyFilter}
            onChange={(e) => {
              setCurrencyFilter(e.target.value as CurrencyFilter);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Currencies</option>
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={handleCSVExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload />
            Export CSV
          </button>

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
                    { key: "amount", label: "Amount" },
                    { key: "type", label: "Type" },
                    { key: "branch", label: "Branch" },
                    { key: "createdAt", label: "Date" },
                    { key: "detail", label: "Detail" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {header.key !== "detail" ? (
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort(header.key as SortKeys)}
                        >
                          {header.label}
                          {header.key !== "detail" && <SortIndicator sortKey={header.key as SortKeys} />}
                        </div>
                      ) : (
                        header.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((offering) => (
                  <tr key={offering._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {offering.type === "anonymous" ? "Anonymous" : offering.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {offering.currency === "NGN" ? "₦" : "$"}
                        {offering.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium capitalize rounded-full bg-blue-100 text-blue-800">
                        {offering.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {offering.branch}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(offering.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {offering.user ? (
                        <Link to={`/finance-dashboard/see-giver/${offering.user}`}>
                          <EyeIcon className="text-green-500 hover:text-green-700" />
                        </Link>
                      ) : (
                        <EyeOffIcon className="text-gray-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No offerings found
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