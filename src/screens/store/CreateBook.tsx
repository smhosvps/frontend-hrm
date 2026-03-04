"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useCreateProductMutation } from "../../redux/features/product/productApi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { IoAddOutline, IoCloseOutline } from "react-icons/io5"

type Props = {}

export default function CreateBook({}: Props) {
  const navigate = useNavigate()
  const [createProduct, { isLoading, isSuccess, error }] = useCreateProductMutation()
  const [productData, setProductData] = useState({
    price: "",
    discount: "",
    name: "",
    category: "",
    isApprove: false,
    pdf_link: "",
    audio_link: "",
    desc: "",
    price_in_dollar: "",
    discountedPrice: "",
    discountedPriceInDollar: "",
    images: [],
  })

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<"details" | "images">("details")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked }: any = e.target
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prevImages) => [...prevImages, ...files])
    setUploadProgress((prevProgress) => [...prevProgress, ...files.map(() => 0)])
  }

  const removeImage = (index: number) => {
    setImageFiles((prevImages) => prevImages.filter((_, i) => i !== index))
    setUploadProgress((prevProgress) => prevProgress.filter((_, i) => i !== index))
  }

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          let width = img.width
          let height = img.height

          // Resize the image to 500px
          if (width > height) {
            if (width > 500) {
              height *= 500 / width
              width = 500
            }
          } else {
            if (height > 500) {
              width *= 500 / height
              height = 500
            }
          }
          canvas.width = width
          canvas.height = height

          ctx?.drawImage(img, 0, 0, width, height)

          // Compress the image to 500kB
          let quality = 0.9
          let base64 = canvas.toDataURL("image/jpeg", quality)
          while (base64.length / 1024 > 500 && quality > 0.1) {
            quality -= 0.1
            base64 = canvas.toDataURL("image/jpeg", quality)
          }
          resolve(base64)
        }
        img.onerror = () => reject(new Error("Failed to load image"))
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (productData?.isApprove && imageFiles?.length === 0) {
      alert("You cannot approve a product without images.")
      return
    }

    if (!productData?.name) {
      return toast.error("Enter your product name")
    }
    if (!productData?.price) {
      return toast.error("Enter your product price in Naira")
    }
    if (!productData?.discount) {
      return toast.error("Enter your product name")
    }
    if (!productData?.price_in_dollar) {
      return toast.error("Enter price in dollar")
    }
    if (!productData?.desc) {
      return toast.error("Enter your product price")
    }
    if (!productData?.category) {
      return toast.error("Enter your product price")
    }

    // Resize and compress images to base64 with progress tracking
    const imagesBase64 = await Promise.all(
      imageFiles.map(async (file, index) => {
        setUploadProgress((prevProgress) => {
          const newProgress = [...prevProgress]
          newProgress[index] = 0
          return newProgress
        })
        const base64Image = await resizeAndCompressImage(file!)
        setUploadProgress((prevProgress) => {
          const newProgress = [...prevProgress]
          newProgress[index] = 100
          return newProgress
        })
        return base64Image
      }),
    )

    // Prepare the product data
    const finalProductData = {
      ...productData,
      images: imagesBase64,
    }

    await createProduct(finalProductData)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully")
      navigate("/store-dashboard/books")
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any
        toast.error(errorMessage.data.message)
      }
    }
  }, [isLoading, isSuccess, error, navigate])

  useEffect(() => {
    if (
      productData.price &&
      productData.discount &&
      !isNaN(Number(productData.price)) &&
      !isNaN(Number(productData.discount))
    ) {
      const originalPrice = Number(productData.price)
      const discountPercentage = Number(productData.discount)
      const discountAmount = originalPrice * (discountPercentage / 100)
      const calculatedDiscountedPrice = originalPrice - discountAmount

      setProductData((prev) => ({
        ...prev,
        discountedPrice: calculatedDiscountedPrice.toFixed(2),
      }))
    } else {
      setProductData((prev) => ({
        ...prev,
        discountedPrice: "",
      }))
    }
  }, [productData.price, productData.discount])

  useEffect(() => {
    if (
      productData.price_in_dollar &&
      productData.discount &&
      !isNaN(Number(productData.price_in_dollar)) &&
      !isNaN(Number(productData.discount))
    ) {
      const originalPriceInDollar = Number(productData.price_in_dollar)
      const discountPercentage = Number(productData.discount)
      const discountAmount = originalPriceInDollar * (discountPercentage / 100)
      const calculatedDiscountedPriceInDollar = originalPriceInDollar - discountAmount

      setProductData((prev) => ({
        ...prev,
        discountedPriceInDollar: calculatedDiscountedPriceInDollar.toFixed(2),
      }))
    } else {
      setProductData((prev) => ({
        ...prev,
        discountedPriceInDollar: "",
      }))
    }
  }, [productData.price_in_dollar, productData.discount])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Product</h1>
        <p className="text-gray-600">Fill in the product details and upload images</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex">
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Product Details
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "images" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("images")}
          >
            Product Images
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  required
                  value={productData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select Category</option>
                  <option value="New Releases">New Releases</option>
                  <option value="Faith">Faith</option>
                  <option value="Family">Family</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Wisdom">Wisdom</option>
                  <option value="Favour">Favour</option>
                  <option value="Praise">Praise</option>
                  <option value="Divine Health">Divine Health</option>
                  <option value="Restoration">Restoration</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price (NGN)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {productData.discountedPrice && (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">Original: ₦{Number(productData.price).toLocaleString()}</span>
                    <span className="ml-2 text-green-600 font-medium">
                      Discounted: ₦{Number(productData.discountedPrice).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  name="price_in_dollar"
                  required
                  value={productData.price_in_dollar}
                  onChange={handleInputChange}
                  placeholder="Enter dollar price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {productData.discountedPriceInDollar && (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-500">
                      Original: ${Number(productData.price_in_dollar).toLocaleString()}
                    </span>
                    <span className="ml-2 text-green-600 font-medium">
                      Discounted: ${Number(productData.discountedPriceInDollar).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount" // Changed from 'offer' to 'discount'
                  required
                  value={productData.discount}
                  onChange={handleInputChange}
                  placeholder="Enter discount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                name="desc"
                required
                value={productData.desc}
                onChange={handleInputChange}
                placeholder="Enter detailed product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">PDF URL</label>
              <input
                type="text"
                name="pdf_link" // Changed from 'pdf' to 'pdf_link'
                value={productData.pdf_link}
                onChange={handleInputChange}
                placeholder="https://example.com/book.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Audio URL</label>
              <input
                type="text"
                name="audio_link" // Changed from 'pdf' to 'pdf_link'
                value={productData.audio_link}
                onChange={handleInputChange}
                placeholder="https://example.com/therealyou.mp3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isApprove"
                id="isApprove"
                checked={productData.isApprove}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isApprove" className="text-sm font-medium text-gray-700">
                Approve this product
              </label>
            </div>
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <div className="mt-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex flex-col items-center text-gray-500">
                    <IoAddOutline className="w-8 h-8 mb-2" />
                    <span className="text-sm">Click to upload images</span>
                    <span className="text-xs text-gray-400">(JPEG, PNG up to 5MB)</span>
                  </div>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={URL.createObjectURL(file!) || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {uploadProgress[index] < 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white font-medium">{uploadProgress[index]}%</div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <IoCloseOutline className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

