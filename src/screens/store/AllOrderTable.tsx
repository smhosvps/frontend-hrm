"use client"

import React, { useState } from "react"
import { FaEye, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { FaNairaSign, FaDollarSign } from "react-icons/fa6"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useGetAllOrderQuery } from "@/redux/features/storeOrder/storeOrderApi"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function AllOrderTable() {
  const { data, isLoading, isError } = useGetAllOrderQuery({})

  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  console.log(data, "gdgdg")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  }

  const toggleRowExpansion = (orderId: string) => {
    setExpandedRows((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const downloadPdf = (pdfUrl: string, bookName: string) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${bookName.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Pagination logic
  const totalOrders = data?.ebooks?.length || 0
  const totalPages = Math.ceil(totalOrders / itemsPerPage)

  // Get current orders
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = data?.ebooks?.slice(indexOfFirstOrder, indexOfLastOrder) || []

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  if (isLoading)
    return (
      <div className="container mx-auto p-4">
        <Skeleton height={40} count={5} className="mb-2" />
      </div>
    )

  if (isError)
    return <div className="container mx-auto p-4 text-red-500">Error loading orders. Please try again later.</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Book Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Date", "Amount", "Books", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}

              {currentOrders?.map((order: any) => (
                <React.Fragment key={order?._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order?._id?.slice(-8)}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(order?.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {order?.currency === "USD" ? (
                          <FaDollarSign className="mr-1 text-gray-500" />
                        ) : (
                          <FaNairaSign className="mr-1 text-gray-500" />
                        )}
                        <span className="font-medium">{order?.total_amount?.toLocaleString("en-US")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {order?.pdf?.length} {order?.pdf?.length === 1 ? "book" : "books"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="View order details"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => toggleRowExpansion(order?._id)}
                          className="text-gray-600 hover:text-gray-900"
                          aria-label={expandedRows.includes(order?._id) ? "Collapse row" : "Expand row"}
                        >
                          {expandedRows?.includes(order?._id) ? (
                            <FaChevronUp className="h-5 w-5" />
                          ) : (
                            <FaChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRows?.includes(order?._id) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Books in this order:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order?.books?.map((book:any) => (
                              <div
                                key={book._id}
                                className="flex flex-col md:flex-ro bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                              >
                                <div className="flex-shrink-0 h-16 w-16 mr-4">
                                  <img
                                    src={book?.image || "/placeholder.svg"}
                                    alt={book?.name}
                                    className="h-full w-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{book?.name}</p>
                                  <button
                                    onClick={() => downloadPdf(book?.pdf, book?.name)}
                                    className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                  >
                                    <FaDownload className="mr-1" />
                                    Download PDF
                                  </button>
                                </div>
                                <div className="text-xs mt-2 font-medium text-blue-500">{book?.audio_link}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalOrders > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastOrder, totalOrders)}</span> of{" "}
                  <span className="font-medium">{totalOrders}</span> orders
                </span>
                <div className="ml-4">
                  <select
                    className="border border-gray-300 rounded-md text-sm py-1 px-2"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    {[5, 10, 25, 50].map((value) => (
                      <option key={value} value={value}>
                        {value} per page
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex space-x-1">
                  {/* Show page numbers with ellipsis for many pages */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1

                    // Always show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNumber ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    }

                    // Show ellipsis for skipped pages
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNumber} className="px-2">
                          ...
                        </span>
                      )
                    }

                    return null
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label="Next page"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 overflow-auto my-11]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder?._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">{formatCurrency(selectedOrder?.total_amount, selectedOrder?.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="font-medium">{selectedOrder?.currency}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Books Purchased</h3>
                <div className="space-y-3">
                  {selectedOrder?.books?.map((book:any) => (
                    <div key={book?._id} className="flex items-center p-3 bg-gray-50 rounded">
                      <img
                        src={book?.image || "/placeholder.svg"}
                        alt={book?.name}
                        className="h-12 w-12 object-cover rounded mr-3"
                      />
                      <div>
                        <p className="font-medium">{book?.name}</p>
                        <button
                          onClick={() => downloadPdf(book?.pdf, book?.name)}
                          className="text-blue-600 text-sm hover:text-blue-800"
                        >
                          <FaDownload className="inline mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

