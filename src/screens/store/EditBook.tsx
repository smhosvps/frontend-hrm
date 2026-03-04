"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useEditProductXMutation, useGetAllProductQuery } from "../../redux/features/product/productApi"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type Props = {}

interface ImageData {
  public_id: string
  url: string
}

export default function EditBook({}: Props) {
  const [editProductX, { isLoading, isSuccess, error }] = useEditProductXMutation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, refetch } = useGetAllProductQuery({}, { refetchOnMountOrArgChange: true })

  const [productData, setProductData] = useState<any>({
    price: "",
    price_in_dollar: "",
    discount: "",
    name: "",
    category: "",
    isApprove: false,
    pdf_link: "",
    audio_link: "",
    desc: "",
    discountedPrice: "",
    discountedPriceInDollar: "",
  })

  const [images, setImages] = useState<(ImageData | File)[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"details" | "images">("details")

  useEffect(() => {
    const productDataFind = data?.find((i: any) => i?._id === id)
    if (productDataFind) {
      setProductData({
        name: productDataFind?.name,
        desc: productDataFind?.desc,
        price: productDataFind?.price,
        price_in_dollar: productDataFind?.price_in_dollar || "",
        discount: productDataFind?.discount,
        category: productDataFind?.category,
        isApprove: productDataFind?.isApprove,
        pdf_link: productDataFind?.pdf_link,
        audio_link: productDataFind?.audio_link,
        discountedPrice: "",
        discountedPriceInDollar: "",
      })

      if (productDataFind.images && Array.isArray(productDataFind.images)) {
        setImages(productDataFind.images)
        setImagePreviews(productDataFind.images.map((img: ImageData) => img.url))
      }
    }
  }, [data, id])

  // Calculate discounted price in Naira
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

      setProductData((prev:any) => ({
        ...prev,
        discountedPrice: calculatedDiscountedPrice.toFixed(2),
      }))
    } else {
      setProductData((prev:any) => ({
        ...prev,
        discountedPrice: "",
      }))
    }
  }, [productData.price, productData.discount])

  // Calculate discounted price in Dollar
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

      setProductData((prev:any) => ({
        ...prev,
        discountedPriceInDollar: calculatedDiscountedPriceInDollar.toFixed(2),
      }))
    } else {
      setProductData((prev:any) => ({
        ...prev,
        discountedPriceInDollar: "",
      }))
    }
  }, [productData.price_in_dollar, productData.discount])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked }: any = e.target
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement("canvas")
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width))
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width *= maxHeight / height))
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }))
          } else {
            reject(new Error("Image resizing failed."))
          }
        }, file.type)
      }

      img.onerror = () => {
        reject(new Error("Image loading failed."))
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = Array.from(e.target.files || [])
    const resizedFiles = await Promise.all(files.map((file) => resizeImage(file, 500, 500)))
    const newImages = [...images]
    newImages[index] = resizedFiles[0]
    setImages(newImages)

    const previews = resizedFiles.map((file) => URL.createObjectURL(file))
    const newImagePreviews = [...imagePreviews]
    newImagePreviews[index] = previews[0]
    setImagePreviews(newImagePreviews)
  }

  const handleAddImageInput = () => {
    setImages([...images, null as unknown as ImageData | File])
    setImagePreviews([...imagePreviews, ""])
  }

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return
    const newImages = images.filter((_, i) => i !== index)
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newImagePreviews)
  }

  const handleSubmitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Remove empty image inputs
    const filteredImages = images.filter((image) => image !== null)

    // Convert images to base64
    const base64Images = await Promise.all(
      filteredImages.map(
        (file) =>
          new Promise<string | undefined>((resolve, reject) => {
            if (file instanceof File) {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onloadend = () => resolve(reader.result as string)
              reader.onerror = (error) => reject(error)
            } else {
              resolve(file?.url) // for initial images already present
            }
          }),
      ),
    )

    const productPayload = {
      ...productData,
      images: base64Images,
    }

    await editProductX({ id, productPayload })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product updated successfully")
      refetch()
      navigate("/store-dashboard/books")
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any
        toast.error(errorMessage.data.message)
      }
    }
  }, [isLoading, isSuccess, error, refetch, navigate])

  return (
    <div className="p-4 rounded-md bg-white container mx-auto">
      <div className="">
        <div className="flex border-b border-gray-200 mb-5">
          <button
            className={`w-1/2 text-center py-3 text-base ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("details")}
          >
            Product Details
          </button>
          <button
            className={`w-1/2 text-center text-base py-3 ${activeTab === "images" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("images")}
          >
            Image Upload
          </button>
        </div>
        {activeTab === "details" ? (
          <form onSubmit={handleSubmitData}>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-full">
                <label htmlFor="name" className="text-gray-600 text-base">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  value={productData.name}
                  id="name"
                  placeholder="Eg. the real you"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="category" className="text-gray-600 text-base">
                  Category
                </label>
                <select
                  name="category"
                  required
                  onChange={handleChange}
                  value={productData.category}
                  id="category"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
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
                  <option value="eBook">eBook</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3 mt-5">
              <div className="w-full">
                <label htmlFor="price" className="text-gray-600 text-base">
                  Price (NGN)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  onChange={handleChange}
                  value={productData.price}
                  id="price"
                  placeholder="Eg. 100"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
              <div className="w-full">
                <label htmlFor="price_in_dollar" className="text-gray-600 text-base">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price_in_dollar"
                  required
                  onChange={handleChange}
                  value={productData.price_in_dollar}
                  id="price_in_dollar"
                  placeholder="Eg. 10"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3 mt-5">
              <div className="w-full">
                <label htmlFor="discount" className="text-gray-600 text-base">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  required
                  onChange={handleChange}
                  value={productData.discount}
                  id="discount"
                  placeholder="Eg. 10"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="pdf_link" className="text-gray-600 text-base">
                  PDF link
                </label>
                <input
                  type="text"
                  name="pdf_link"
                  onChange={handleChange}
                  value={productData.pdf_link}
                  id="pdf_link"
                  placeholder="Eg. https://example.com/ebook.pdf"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full">
                <label htmlFor="audio_link" className="text-gray-600 text-base">
                  Audio link
                </label>
                <input
                  type="text"
                  name="audio_link"
                  onChange={handleChange}
                  value={productData.audio_link}
                  id="audio_link"
                  placeholder="Eg. https://example.com/therealyou.mp3"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="w-full my-5">
              <label htmlFor="desc" className="text-gray-600 text-base">
                Description
              </label>
              <textarea
                name="desc"
                required
                onChange={handleChange}
                value={productData.desc}
                id="desc"
                placeholder="Eg. this is a brief description of the book"
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-48"
              />
            </div>

            <div className="w-full my-5">
              <label htmlFor="isApprove" className="text-gray-600 text-base">
                Approval Status
              </label>
              <div className="mt-3 flex gap-3 items-center">
                <input
                  type="checkbox"
                  name="isApprove"
                  checked={productData.isApprove}
                  onChange={handleChange}
                  id="isApprove"
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="isApprove" className="text-gray-600">
                  Approved
                </label>
              </div>
            </div>
            <div className="mt-4">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full border text-base border-blue-700 bg-transparent hover:bg-blue-700 hover:text-white text-blue-700 font-bold py-2 px-4 rounded mt-4 transition duration-300"
              >
                {isLoading ? "Loading..." : "Update Product"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitData}>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden border border-gray-300">
                    {preview && (
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="object-cover w-full h-full"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {images.length > 1 && index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageInput}
                className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md text-base text-gray-600 cursor-pointer border border-gray-300 hover:bg-gray-200 transition duration-300"
              >
                + Add Image
              </button>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full border text-base border-blue-700 bg-transparent hover:bg-blue-700 hover:text-white text-blue-700 font-bold py-2 px-4 rounded mt-4 transition duration-300"
              >
                {isLoading ? "Loading..." : "Update Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

