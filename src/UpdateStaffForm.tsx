"use client"

import { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  Save,  
  AlertCircle, 
  CheckCircle,
  Loader2
} from "lucide-react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useGetStaffFormByIdQuery, useUpdateStaffFormMutation } from "./redux/features/staffFormsAPi/staffFormsApi"

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

export default function UpdateStaffForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const formDataFromState = location.state?.form

  const { data, isLoading: isLoadingForm } = useGetStaffFormByIdQuery(id || '')
  const [updateForm, { isLoading: isUpdating }] = useUpdateStaffFormMutation()

  const [formData, setFormData] = useState({
    surname: '',
    otherNames: '',
    email: '',
    personalPhone: '',
    officialPhone: '',
    accountBank: '',
    position: '',
    department: '',
    pastorChoice: '',
    stateOfResidence: '',
    region: '',
    country: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Initialize form data
  useEffect(() => {
    if (formDataFromState) {
      setFormData({
        surname: formDataFromState.surname || '',
        otherNames: formDataFromState.otherNames || '',
        email: formDataFromState.email || '',
        personalPhone: formDataFromState.personalPhone || '',
        officialPhone: formDataFromState.officialPhone || '',
        accountBank: formDataFromState.accountBank || '',
        position: formDataFromState.position || '',
        department: formDataFromState.department || '',
        pastorChoice: formDataFromState.pastorChoice || '',
        stateOfResidence: formDataFromState.stateOfResidence || '',
        region: formDataFromState.region || '',
        country: formDataFromState.country || '',
      })
    } else if (data?.data) {
      setFormData({
        surname: data.data.surname || '',
        otherNames: data.data.otherNames || '',
        email: data.data.email || '',
        personalPhone: data.data.personalPhone || '',
        officialPhone: data.data.officialPhone || '',
        accountBank: data.data.accountBank || '',
        position: data.data.position || '',
        department: data.data.department || '',
        pastorChoice: data.data.pastorChoice || '',
        stateOfResidence: data.data.stateOfResidence || '',
        region: data.data.region || '',
        country: data.data.country || '',
      })
    }
  }, [formDataFromState, data])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic validation
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required'
    if (!formData.otherNames.trim()) newErrors.otherNames = 'Other names are required'
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.personalPhone.trim()) newErrors.personalPhone = 'Personal phone is required'
    if (!formData.officialPhone.trim()) newErrors.officialPhone = 'Official phone is required'
    if (!formData.accountBank.trim()) newErrors.accountBank = 'Account & bank details are required'
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.region.trim()) newErrors.region = 'Region is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'

    // Nigeria-specific validation
    if (formData.country === 'Nigeria' && !formData.stateOfResidence.trim()) {
      newErrors.stateOfResidence = 'State of residence is required for Nigeria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      const updateData = { ...formData }
      
      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData]
        }
      })

      const response = await updateForm({
        id: id || '',
        data: updateData
      }).unwrap()

      if (response.success) {
        setSubmitSuccess(true)
        toast.success('Form updated successfully!')
        
        // Redirect after success
        setTimeout(() => {
          navigate(`/search-form-by-email`)
        }, 2000)
      } else {
        toast.error(response.message || 'Failed to update form')
      }
    } catch (error:any) {
      console.error('Update error:', error)
      
      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.status === 400) {
        toast.error('Validation error. Please check your inputs.')
      } else {
        toast.error('Failed to update form. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoadingForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Update Staff Form</h1>
              <p className="text-blue-100 mt-1">Update your information below</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Form updated successfully!</p>
                <p className="text-sm mt-1">Redirecting you to the form details...</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.surname ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.surname}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Names <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="otherNames"
                  value={formData.otherNames}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.otherNames ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.otherNames && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otherNames}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled // Email shouldn't be changed
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="personalPhone"
                  value={formData.personalPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.personalPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.personalPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.personalPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Official Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="officialPhone"
                  value={formData.officialPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.officialPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.officialPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.officialPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account No & Bank <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountBank"
                  value={formData.accountBank}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.accountBank ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.accountBank && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accountBank}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">
              Employment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.position ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.position}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pastor Type
                </label>
                <select
                  name="pastorChoice"
                  value={formData.pastorChoice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Not a Pastor</option>
                  <option value="Senior Pastor">Senior Pastor</option>
                  <option value="Associate Pastor">Associate Pastor</option>
                  <option value="Youth Pastor">Youth Pastor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">
              Location Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.country ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.country}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.region ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.region}
                  </p>
                )}
              </div>

              {formData.country === 'Nigeria' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State of Residence <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stateOfResidence"
                    value={formData.stateOfResidence}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.stateOfResidence ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.stateOfResidence && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.stateOfResidence}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="stateOfResidence"
                    value={formData.stateOfResidence}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Form
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Email address cannot be changed for security reasons</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Your form will be re-verified after updates</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>All required fields must be filled</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}