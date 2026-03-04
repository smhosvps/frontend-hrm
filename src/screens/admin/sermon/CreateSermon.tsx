import { useCreateSermonMutation } from '@/redux/features/sermon/sermonApi'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function CreateSermon() {
  const [createSermon, { isLoading, isSuccess, error }] = useCreateSermonMutation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    thumbnail: '',
    category: '',
    ministering: '',
    videoId: '',
    isApprove: 'False'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const resizedImage = await resizeAndCompressImage(file)
        setFormData(prev => ({ ...prev, thumbnail: resizedImage }))
      } catch (error) {
        console.error('Error processing image:', error)
        toast.error('Failed to process image')
      }
    }
  }

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          let { width, height } = img

          if (width > height) {
            if (width > 800) {
              height *= 800 / width
              width = 800
            }
          } else {
            if (height > 800) {
              width *= 800 / height
              height = 800
            }
          }
          canvas.width = width
          canvas.height = height

          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader()
              reader.readAsDataURL(blob)
              reader.onloadend = () => {
                const base64data = reader.result as string
                resolve(base64data)
              }
            } else {
              reject(new Error('Failed to create blob'))
            }
          }, 'image/jpeg', 0.7)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createSermon(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success('Sermon created successfully')
      navigate('/dashboard/sermon')
    }
    if (error && 'data' in error) {
      toast.error((error.data as any).message)
    }
  }, [isSuccess, error, navigate])

  return (
    <div className="p-4 rounded-md bg-white container mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-800 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label htmlFor="desc" className="block text-gray-800 mb-1">
            Description
          </label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            required
            maxLength={1500}
            rows={4}
            className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter description (max 1500 characters)"
          ></textarea>
        </div>

        <div>
          <label htmlFor="ministering" className="block text-gray-800 mb-1">
            Ministering
          </label>
          <input
            type="text"
            id="ministering"
            name="ministering"
            value={formData.ministering}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter name of minister"
          />
        </div>

        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            <label htmlFor="category" className="block text-gray-800 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Faith">Faith</option>
              <option value="Abundance">Abundance</option>
              <option value="Family">Family</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="isApprove" className="block text-gray-800 mb-1">
              Approve
            </label>
            <select
              id="isApprove"
              name="isApprove"
              value={formData.isApprove}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="False">False</option>
              <option value="True">True</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="videoId" className="block text-gray-800 mb-1">
            Video ID
          </label>
          <input
            type="text"
            id="videoId"
            name="videoId"
            value={formData.videoId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter video ID"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-gray-800 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-200"
          />
        </div>

        {formData.thumbnail && (
          <div className="mt-2">
            <img
              src={formData.thumbnail}
              alt="Thumbnail preview"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Sermon'}
          </button>
        </div>
      </form>
    </div>
  )
}