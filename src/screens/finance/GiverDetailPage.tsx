import { useState, useMemo } from "react";
import { useGetUserOfferingsQuery } from "@/redux/features/give/offeringApi";
import { useGetDetailUserQuery } from "@/redux/features/user/userApi";
import { Link, useParams } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaEnvelope } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaNairaSign, FaDollarSign } from "react-icons/fa6";
import { MapPinIcon, PhoneIcon } from "lucide-react";

type SortKeys = "createdAt" | "type" | "amount" | "currency";
type SortOrder = "asc" | "desc";

export default function GiverDetailPage() {
  const { id } = useParams();
  const userId = id || "";
  const {
    data: offerings,
    isLoading,
    isError,
  } = useGetUserOfferingsQuery(userId);
  const { data: userDetail, isLoading: userLoading } =
    useGetDetailUserQuery(userId);

  // State management
  const [sortKey, setSortKey] = useState<SortKeys>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const handleSort = (key: SortKeys) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const processedData = useMemo(() => {
    if (!offerings?.data) return [];

    return offerings.data
      .filter(
        (offering: any) =>
          (selectedCurrency === "all" ||
            offering.currency === selectedCurrency) &&
          (selectedType === "all" ||
            offering.type.toLowerCase() === selectedType)
      )
      .sort((a: any, b: any) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (sortKey === "amount") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }

        if (sortKey === "createdAt") {
          return sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [offerings, sortKey, sortOrder, selectedCurrency, selectedType]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const currentData = processedData.slice(
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

  if (isLoading || userLoading) {
    return (
      <div className="p-6">
        <Skeleton height={40} count={5} className="mb-2" />
      </div>
    );
  }

  if (isError || !userDetail) {
    return <div className="p-6 text-red-500">Error loading giver details</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-screen">
      {/* User Details Section */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-6">
          {userDetail?.avatar?.url ? (
            <img
              src={userDetail?.avatar?.url}
              alt="User avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">
                {userDetail?.firstName[0]}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
              <div className="space-y-2">
                <h1 className="text-xl font-bold">
                  {userDetail?.firstName}'s Profile
                </h1>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-blue-600" />
                  <a
                    href={`mailto:${userDetail?.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {userDetail.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-blue-600" />
                  <a
                    href={`tel:${userDetail?.phoneNumber}`}
                    className="text-gray-700"
                  >
                    {userDetail?.phoneNumber || "Not provided"}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    {userDetail?.address || "Address not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Membership Details</h2>
              <div className="space-y-2">
                {userDetail?.membership?.length > 0 ? (
                  userDetail?.membership?.map((member: any) => (
                    <Link to={`/finance-dashboard/my-tithes/${member?.tithe_number}`} className="space-y-2 mb-2">
                      <div
                        key={member._id}
                        className="bg-white p-3 rounded border mb-1"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">
                            {member.type}
                          </span>
                          {member.tithe_number && (
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              #{member.tithe_number}
                            </span>
                          )}
                        </div>
                        {member.organization && (
                          <p className="text-sm text-gray-600">
                            {member.organization}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No memberships registered
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Memberships</h2>
            <div className="space-y-2">
              {userDetail.membership?.map((member: any) => (
                <div key={member._id} className="bg-white p-3 rounded border">
                  <p className="font-medium">{member.type}</p>
                  <p className="text-sm text-gray-600">{member.organization || 'Personal'}</p>
                  <p className="text-sm text-gray-600">Tithe #: {member.tithe_number}</p>
                </div>
              ))}
            </div>
          </div> */}
        {/* Filters and Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setSelectedCurrency(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Currencies</option>
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="tithe">Tithe</option>
              <option value="offering">Offering</option>
              <option value="anonymous">Anonymous</option>
              <option value="prophet offering">Prophet Offering</option>
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
              className="px-3 py-2 border rounded-lg"
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

      {/* Offerings Table */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {[
                  { key: "createdAt", label: "Date" },
                  { key: "type", label: "Type" },
                  { key: "amount", label: "Amount" },
                  { key: "currency", label: "Currency" },
                  { key: "branch", label: "Branch" },
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
              {currentData.map((offering: any) => (
                <tr key={offering._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(offering.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                    {offering.type}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {offering.currency === "NGN" ? (
                        <FaNairaSign className="mr-1 text-gray-500" />
                      ) : (
                        <FaDollarSign className="mr-1 text-gray-500" />
                      )}
                      {offering.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {offering?.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {offering?.branch}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentData.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No offerings found for this user
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, processedData.length)} of{" "}
            {processedData.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>

            <span className="px-4 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
