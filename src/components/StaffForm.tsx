import type React from "react"
import { useState } from "react"
import { AlertCircle, Upload, Camera, Loader2, CheckCircle } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCreateStaffFormMutation } from "@/redux/features/staffFormsAPi/staffFormsApi"
import logo from "../assets/smhos-log.png"

interface FormData {
  surname: string
  otherNames: string
  email: string
  personalPhone: string
  officialPhone: string
  accountBank: string
  position: string
  department: string
  pastorChoice: string
  stateOfResidence: string
  region: string
  country: string
}

interface Errors {
  [key: string]: boolean
}

interface StaffFormProps {
  onSubmit: () => void
  onBack: () => void
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja"
]

const COUNTRIES = [
  "Nigeria", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
  "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
  "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
]

export default function StaffForm({ onSubmit, onBack }: StaffFormProps) {
  const [formData, setFormData] = useState<FormData>({
    surname: "",
    otherNames: "",
    email: "",
    personalPhone: "",
    officialPhone: "",
    accountBank: "",
    position: "",
    department: "",
    pastorChoice: "",
    stateOfResidence: "",
    region: "",
    country: "",
  })

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const [passportBase64, setPassportBase64] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [createStaffForm] = useCreateStaffFormMutation()

  const requiredFields = [
    "surname",
    "otherNames",
    "email",
    "personalPhone",
    "officialPhone",
    "accountBank",
    "position",
    "pastorChoice",
    "region",
    "country",
  ]

  const isNigeria = formData.country === "Nigeria"
  const stateFieldRequired = isNigeria ? ["stateOfResidence"] : []
  const allRequiredFields = [...requiredFields, ...stateFieldRequired]

  const validateForm = () => {
    const newErrors: Errors = {}
    
    // Validate required fields
    allRequiredFields.forEach((field) => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = true
      }
    })

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true
    }

    // Validate passport photo
    if (!passportPhoto || !passportBase64) {
      newErrors.passport = true
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or WebP)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      
      setPassportPhoto(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPassportPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Convert to base64 for API submission
      try {
        const base64String = await convertToBase64(file)
        setPassportBase64(base64String)
      } catch (error) {
        toast.error('Failed to process image')
        return
      }
      
      // Clear error if exists
      if (errors.passport) {
        setErrors((prev) => ({
          ...prev,
          passport: false,
        }))
      }
    }
  }

  const handleTakePhoto = () => {
    // This would trigger camera access
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment' // Use back camera on mobile
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (target.files?.[0]) {
        const event = { target } as React.ChangeEvent<HTMLInputElement>
        await handlePassportUpload(event)
      }
    }
    input.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Prepare form data with base64 image
      const formDataToSubmit = {
        ...formData,
        passportPhoto: passportBase64
      }

      // Call RTK Query mutation
      const response = await createStaffForm(formDataToSubmit).unwrap()

      if (response.success) {
        toast.success('Form submitted successfully!')
        setSubmitSuccess(true)
        
        // Reset form after successful submission
        setTimeout(() => {
          handleClear()
          if (onSubmit) onSubmit()
        }, 2000)
      } else {
        toast.error(response.message || 'Failed to submit form')
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      
      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.status === 400) {
        toast.error('Validation error. Please check your inputs.')
      } else if (error?.status === 409) {
        toast.error('A form with this email already exists.')
      } else {
        toast.error('Failed to submit form. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setFormData({
      surname: "",
      otherNames: "",
      email: "",
      personalPhone: "",
      officialPhone: "",
      accountBank: "",
      position: "",
      department: "",
      pastorChoice: "",
      stateOfResidence: "",
      region: "",
      country: "",
    })
    setPassportPhoto(null)
    setPassportPreview(null)
    setPassportBase64(null)
    setErrors({})
    setSubmitSuccess(false)
  }

  const removePassportPhoto = () => {
    setPassportPhoto(null)
    setPassportPreview(null)
    setPassportBase64(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-purple-200 py-8 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] border-2 border-b-0 border-purple-400 overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex flex-col items-center gap-4">
              <img src={logo} className="h-[45px] md:h-[60px]" />
            <div>
              <h1 className="md:text-2xl font-bold text-center md:text-left">SALVATION MINISTRIES STAFF DATABASE MANAGEMENT</h1>
            </div>
          </div>

          {/* Form Info */}
          <div className="px-6 py-4 border-b border-purple-300">
            <h2 className="text-lg font-bold text-black mb-4">PASTORS/STAFF DATABASE</h2>
            <div className="text-xs text-gray-500 flex items-center gap-1">🔒 Not shared</div>
            <p className="text-red-600 text-xs mt-3">* Indicates required question</p>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Form submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Passport Photo Upload */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-4">
            <label className="text-sm font-medium text-black">
              Passport Photograph <span className="text-red-600">*</span>
              <span className="text-xs text-gray-500 block mt-1 font-normal">
                Please upload a recent passport-sized photo (JPEG, PNG, or WebP, max 5MB)
              </span>
            </label>
            
            {passportPreview ? (
              <div className="space-y-3">
                <div className="relative w-48 h-48 mx-auto border-2 border-purple-300 rounded-lg overflow-hidden">
                  <img
                    src={passportPreview}
                    alt="Passport preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => document.getElementById('passport-upload')?.click()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={removePassportPhoto}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Upload your passport photo</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => document.getElementById('passport-upload')?.click()}
                        className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={handleTakePhoto}
                        className="px-6 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">JPEG, PNG or WebP (max 5MB)</p>
                  </div>
                </div>
                <input
                  id="passport-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePassportUpload}
                  className="hidden"
                />
              </div>
            )}
            
            {errors.passport && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                Passport photo is required
              </div>
            )}
          </div>

          {/* Surname / Other names */}
          <div className="bg-white border-2 border-t-0 border-purple-400 p-6 space-y-3">
            <div>
              <label className="text-sm font-medium text-black">
                Surname <span className="text-red-600">*</span>
              </label>
              <label className="text-xs text-gray-500 ml-1">Other names *</label>
            </div>
            <input
              type="text"
              name="surname"
              placeholder="Your answer"
              value={formData.surname}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.surname && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Other names - continue from above */}
          <div className="bg-white border-2 border-t-0 border-purple-400 p-6 space-y-3 -mt-0">
            <input
              type="text"
              name="otherNames"
              placeholder="Your answer"
              value={formData.otherNames}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.otherNames && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Email */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your answer"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                {formData.email ? 'Invalid email format' : 'This is a required question'}
              </div>
            )}
          </div>

          {/* Personal Phone number */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Personal Phone number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="personalPhone"
              placeholder="Your answer"
              value={formData.personalPhone}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.personalPhone && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Official Phone number */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Official Phone number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="officialPhone"
              placeholder="Your answer"
              value={formData.officialPhone}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.officialPhone && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Account No & Bank */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Account No & Bank (Commercial bank) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="accountBank"
              placeholder="Your answer"
              value={formData.accountBank}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.accountBank && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Position */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Position <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="position"
              placeholder="Your answer"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.position && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Department */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">Department</label>
            <input
              type="text"
              name="department"
              placeholder="Your answer"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Pastor Choice */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              If you are a pastor, Choose any of the following <span className="text-red-600">*</span>
            </label>
            <select
              name="pastorChoice"
              value={formData.pastorChoice}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            >

              <option value="">Choose</option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="None">None</option>
            </select>
            {errors.pastorChoice && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* State of Residence */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              State of Residence {isNigeria && <span className="text-red-600">*</span>}
            </label>
            {isNigeria ? (
              <select
                name="stateOfResidence"
                value={formData.stateOfResidence}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="">Choose a state</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="stateOfResidence"
                placeholder="Enter your state/province"
                value={formData.stateOfResidence}
                onChange={handleChange}
                className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
              />
            )}
            {errors.stateOfResidence && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Region */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Region <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="region"
              placeholder="Your answer"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            />
            {errors.region && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Country */}
          <div className="bg-white border-2 border-purple-400 p-6 space-y-3 mt-4">
            <label className="text-sm font-medium text-black">
              Country <span className="text-red-600">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">Choose</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                This is a required question
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="bg-white border-2 border-t-0 border-purple-400 p-6 flex flex-col md:flex-row gap-4 mt-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isSubmitting}
              className="px-8 py-2 bg-gray-300 text-gray-700 font-medium rounded hover:bg-gray-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Clear form
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-8 py-2 bg-gray-300 text-gray-900 font-medium rounded hover:bg-gray-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
               Back to Menu
            </button>
          </div>

          {/* Footer */}
          <div className="bg-white border-2 border-t-0 border-purple-400 p-6 text-xs text-gray-600 space-y-2 mt-0 rounded-b-lg">
            <div className="pt-1">
              <p className="text-red-500">
                This content is created by You (user). Please dont abuse this form and only enter the right information. 
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          © 2026 - Salvation Ministries | All Rights Reserved
        </div>
      </div>
    </div>
  )
}