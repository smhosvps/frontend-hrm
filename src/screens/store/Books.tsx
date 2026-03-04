
import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaSquarePlus } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Loader from "@/components/loader/Loader"
import { useGetAllProductQuery, useDeleteProductMutation } from "@/redux/features/product/productApi"
import { toast } from "react-toastify"
import { FiEye, FiEdit2 } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import { FaNairaSign } from "react-icons/fa6"
import { FaDollarSign } from "react-icons/fa"

export default function Books() {
  const { isLoading, data, refetch } = useGetAllProductQuery({})
  const [deleteProduct, { error, isSuccess, isLoading: isDeleting }] = useDeleteProductMutation()
  const [open, setOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredProducts =
    data?.filter((product: any) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  // Pagination logic
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  // Get current products
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const productList = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDelete = async () => {
    await deleteProduct(productId)
  }

  useEffect(() => {
    if (isSuccess) {
      refetch()
      toast.success("Product deleted successfully")
      setOpen(false)
    }
    if (error) {
      const errorMessage = error as any
      toast.error(errorMessage?.data?.message || "Error deleting product")
    }
  }, [isSuccess, error, refetch])

  const handleDownloadCSV = () => {
    const csvContent = [
      [
        "Name",
        "Category",
        "Status",
        "Discount (%)",
        "Price (₦)",
        "Discounted Price (₦)",
        "Price ($)",
        "Discounted Price ($)",
        "Created At",
      ],
      ...filteredProducts.map((product: any) => {
        const discountedPriceNaira = calculateDiscountedPrice(product.price, product.discount)
        const discountedPriceDollar = calculateDiscountedPrice(product.price_in_dollar, product.discount)

        return [
          `"${product.name}"`,
          `"${product.category}"`,
          `"${product.isApprove ? "Approved" : "Pending"}"`,
          `"${product.discount || 0}%"`,
          `"₦${formatNumber(product.price)}"`,
          `"₦${formatNumber(discountedPriceNaira)}"`,
          `"$${formatNumber(product.price_in_dollar)}"`,
          `"$${formatNumber(discountedPriceDollar)}"`,
          `"${new Date(product.createdAt).toLocaleDateString()}"`,
        ]
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, discount: number) => {
    if (!price || !discount) return price || 0
    const discountAmount = price * (discount / 100)
    return price - discountAmount
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    if (!num) return "0.00"
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

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

  if (isLoading) return <Loader />

  return (
    <div className="w-full bg-white rounded-md my-3 p-3">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded-l-lg w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2 bg-blue-500 text-white rounded-r-lg">
            <FaSearch />
          </button>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Download CSV
          </button>
          <Link
            to="/store-dashboard/create-book"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSquarePlus />
            Add Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaNairaSign className="mr-1" /> Price
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaNairaSign className="mr-1" /> Discounted
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaDollarSign className="mr-1" /> Price
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaDollarSign className="mr-1" /> Discounted
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productList.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? "No products match your search" : "No products available"}
                </td>
              </tr>
            ) : (
              productList.map((product: any) => {
                const discountedPriceNaira = calculateDiscountedPrice(product.price, product.discount)
                const discountedPriceDollar = calculateDiscountedPrice(product.price_in_dollar, product.discount)

                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.isApprove ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.isApprove ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.discount ? `${product.discount}%` : "0%"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">₦{formatNumber(product.price)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      ₦{formatNumber(discountedPriceNaira)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">${formatNumber(product.price_in_dollar)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      ${formatNumber(discountedPriceDollar)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Link
                        to={`/store-dashboard/book-detail/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <FiEye size={20} />
                      </Link>
                      <Link
                        to={`/store-dashboard/edit-book/${product._id}`}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                      >
                        <FiEdit2 size={20} />
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(true)
                          setProductId(product._id)
                          setProductToDelete(product)
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalProducts > 0 && (
        <div className="px-4 py-4 bg-white border-t border-gray-200 mt-2">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastProduct, totalProducts)}</span> of{" "}
                <span className="font-medium">{totalProducts}</span> products
              </span>
              <div className="ml-4">
                <select
                  className="border border-gray-300 rounded-md text-sm py-1 px-2"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  {[5, 10, 25, 50, 100].map((value) => (
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

      {/* Enhanced Delete Confirmation Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            ></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AiOutlineDelete className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold">{productToDelete?.name}</span>?
                        This action cannot be undone.
                      </p>
                    </div>
                    {productToDelete && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-1 font-medium">{productToDelete.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-1 font-medium">₦{formatNumber(productToDelete.price)}</span>
                          </div>
                          {productToDelete.discount > 0 && (
                            <div>
                              <span className="text-gray-500">Discount:</span>
                              <span className="ml-1 font-medium">{productToDelete.discount}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

