import { useState, useEffect } from "react"
import { 
  Search, 
  Mail, 
  User, 
  Edit, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Copy,
  Calendar,
  Phone,
  MapPin,
  Building,
  Globe
} from "lucide-react"

import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css'
import { useSearchByEmailQuery } from "./redux/features/staffFormsAPi/staffFormsApi"

export default function SearchByEmail() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [copied, setCopied] = useState(false)

  const { data, isLoading, error } = useSearchByEmailQuery(
    searchEmail,
    {
      skip: !searchEmail, // Skip query if no email to search
    }
  )

  const form = data?.data
  const success = data?.success
  const message = data?.message

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter an email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setSearchEmail(email)
    setHasSearched(true)
  }

  const handleReset = () => {
    setEmail("")
    setSearchEmail("")
    setHasSearched(false)
  }

  const handleUpdate = () => {
    if (form) {
      navigate(`/update-form/${form._id}`, { state: { form } })
    }
  }

  const handleCopyEmail = () => {
    if (form?.email) {
      navigator.clipboard.writeText(form.email)
      setCopied(true)
      toast.success("Email copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  // Clear previous results when email input changes
  useEffect(() => {
    if (email !== searchEmail) {
      setHasSearched(false)
    }
  }, [email, searchEmail])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Find Your Form</h1>
                <p className="text-blue-100 mt-2">Search your form using your email address</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-8 border-b">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Mail className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Search by Email</h2>
                <p className="text-gray-600">
                  Enter the email address you used when submitting your staff form. We'll retrieve your form details instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-lg"
                    disabled={isLoading}
                    required
                    autoComplete="email"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Make sure to enter the exact email you used during form submission
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search My Form
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-5 h-5" />
                  Clear
                </button>
              </div>
            </form>

            {/* Search Tips */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Search Tips
              </h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>Check for typos in your email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>Use the email you provided during form submission</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                  <span>If you used multiple emails, try each one</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching for your form</h3>
                <p className="text-gray-600">Please wait while we retrieve your information...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-50 border-b border-red-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">Form Not Found</h3>
                      <p className="text-red-700">
                        {message || "We couldn't find any form associated with this email address."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">What to do next:</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Double-check your email address for typos</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Try a different email address you might have used</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Contact support if you believe this is an error</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - Form Found */}
            {success && form && !isLoading && (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-emerald-600 text-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-full">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Form Found!</h2>
                          <p className="text-green-100 mt-1">
                            We found your staff form. Here are your details:
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleUpdate}
                          className="px-6 py-3 bg-white text-green-700 font-semibold rounded-[5px] hover:bg-green-50 flex items-center gap-2 transition"
                        >
                          <Edit className="w-4 h-4" />
                          Update Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Personal Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Personal Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Full Name
                            </label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {form.surname}, {form.otherNames}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email Address
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a 
                                href={`mailto:${form.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {form.email}
                              </a>
                              <button
                                onClick={handleCopyEmail}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title={copied ? "Copied!" : "Copy email"}
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Personal Phone
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a 
                                href={`tel:${form.personalPhone}`}
                                className="text-gray-900 hover:text-blue-600"
                              >
                                {form.personalPhone}
                              </a>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Official Phone
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">
                                {form.officialPhone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employment Information Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          Employment Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {form.position}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {form.department || 'Not Specified'}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pastor Type
                            </label>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                form.pastorChoice === 'Senior Pastor' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : form.pastorChoice === 'Associate Pastor'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {form.pastorChoice || 'Not a Pastor'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bank Details
                            </label>
                            <p className="mt-1 text-gray-900">
                              {form.accountBank}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Actions */}
                  <div className="space-y-6">
                    {/* Location Information Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Location Information
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">{form.country}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Region
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">{form.region}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            State/Province
                          </label>
                          <p className="mt-1 text-gray-900">
                            {form.stateOfResidence || 'Not Specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Timeline
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted On
                          </label>
                          <p className="mt-1 text-gray-900">{formatDate(form.submittedAt)}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Modified
                          </label>
                          <p className="mt-1 text-gray-900">
                            {formatDate(form.lastModified || form.submittedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Quick Actions
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        <button
                        onClick={handleUpdate}
                          className="w-full py-3 px-4 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 transition"
                        >
                          <Edit className="w-4 h-4" />
                          Update My Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Form Verified
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    ✓ Complete
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    📄 Document Uploaded
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-[5px] hover:border-blue-300 hover:shadow-md transition">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600">
                Email us at support@salvationministries.com for assistance
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-[5px] hover:border-blue-300 hover:shadow-md transition">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Submission Issues</h4>
              <p className="text-sm text-gray-600">
                If you can't find your form, you may need to resubmit
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-[5px] hover:border-blue-300 hover:shadow-md transition">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-3">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Privacy</h4>
              <p className="text-sm text-gray-600">
                Your information is secure and only accessible to you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}