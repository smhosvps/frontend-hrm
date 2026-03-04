"use client"

import { useParams } from "react-router-dom"
import { useGetAllProductQuery } from "../../redux/features/product/productApi"
import { FaFilePdf } from "react-icons/fa6"
import { FaDollarSign } from "react-icons/fa"
import { FaNairaSign } from "react-icons/fa6"
import Loader from "@/components/loader/Loader"

type Props = {}

export default function BookDetails({}: Props) {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetAllProductQuery({}, { refetchOnMountOrArgChange: true })
  const productDataFind = data?.find((i: any) => i?._id === id)

 
  const formatNaira = (num: any) => {
    if (!num) return "₦0.00"
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(num)
  }

  const formatDollar = (num: any) => {
    if (!num) return "$0.00"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  // Calculate discounted prices
  const calculateDiscountedPrice = (price: number, discount: number) => {
    if (!price || !discount) return price
    const discountAmount = price * (discount / 100)
    return price - discountAmount
  }

  const discountedPriceNaira = calculateDiscountedPrice(productDataFind?.price, productDataFind?.discount)

  const discountedPriceDollar = calculateDiscountedPrice(productDataFind?.price_in_dollar, productDataFind?.discount)

  return (
    <div className="bg-white container mx-auto p-6 rounded-lg shadow-md">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {productDataFind?.images?.map((image: any, index: number) => (
                <img
                  key={index}
                  src={image.url || "/placeholder.svg"}
                  alt={`Image of ${productDataFind?.name}`}
                  className="h-auto w-full rounded-lg object-cover shadow-sm border border-gray-200 aspect-square"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{productDataFind?.name}</h1>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {productDataFind?.category}
              </span>
              {productDataFind?.isApprove ? (
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full ml-2">
                  Approved
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full ml-2">
                  Not Approved
                </span>
              )}
            </div>

            {/* Price Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 flex items-center">
                    <FaNairaSign className="mr-1" /> Price (NGN)
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-700">{formatNaira(productDataFind?.price)}</span>
                    {productDataFind?.discount > 0 && (
                      <span className="text-green-600 font-medium">
                        Discounted: {formatNaira(discountedPriceNaira)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 flex items-center">
                    <FaDollarSign className="mr-1" /> Price (USD)
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-700">
                      {formatDollar(productDataFind?.price_in_dollar)}
                    </span>
                    {productDataFind?.discount > 0 && (
                      <span className="text-green-600 font-medium">
                        Discounted: {formatDollar(discountedPriceDollar)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {productDataFind?.discount > 0 && (
                <div className="bg-green-50 p-2 rounded text-center">
                  <span className="text-green-700 font-medium">{productDataFind?.discount}% Discount Applied</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{productDataFind?.desc}</p>
            </div>

            {/* PDF Link */}
            {productDataFind?.pdf_link && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">PDF Document</h3>
                <a
                  href={productDataFind?.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FaFilePdf className="text-red-600 text-2xl mr-3" />
                  <div className="flex flex-col">
                    <span className="font-medium">View PDF Document</span>
                    <span className="text-sm text-gray-600 truncate max-w-xs">{productDataFind?.pdf_link}</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

