/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  Calendar,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Phone,
  Mail,
  User,
  Key,
  Eye,
  EyeOff,
  Users,
  CalendarDays,
  MapPinned,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/redux/features/user/userApi";
import logo from "../../assets/footerlogo.png";

// Validation regex
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // International phone number format
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Roles (excluding Super Admin for registration)
const ROLES = [
  { value: "pastor", label: "Pastor" },
  { value: "admin staff", label: "Admin Staff" },
  { value: "operatives", label: "Operatives" },
  { value: "adhoc", label: "Adhoc" }
];

// Departments
const DEPARTMENTS = [
  "Administration",
  "Finance",
  "Technical",
  "Media",
  "Welfare",
  "Youth",
  "Children",
  "Prayer",
  "Evangelism",
  "Discipleship",
  "Counseling",
  "Facility Management"
];

// Marital Status
const MARITAL_STATUS = [
  "Single",
  "Married",
  "Divorced",
  "Widowed"
];

// Genders
const GENDERS = [
  "Male",
  "Female"
];

// Church Branches (example list)
const CHURCH_BRANCHES = [
  "Headquarters",
  "Port Harcourt Main",
  "Abuja",
  "Lagos",
  "Kaduna",
  "Enugu",
  "Calabar",
  "Warri",
  "Ibadan",
  "Benin",
  "Online"
];

// Nigerian States
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function RegisterScreen() {
  const [register, { isLoading }] = useRegisterMutation<any>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("pastor");
  const [selectedState, setSelectedState] = useState("");

  console.log(selectedState)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "pastor",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state_of_origin: "",
    Local_of_origin: "",
    department: "",
    year_of_employment: "",
    marital_status: "",
    cv_link: "",
    church_branch: "",
    country: "Nigeria",
    bio: "",
    register_source: "web",
    register_device: navigator.userAgent
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate minimum date for 18 years old
  const getMinDateOfBirth = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  const validateInputs = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    // Required fields for all roles
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Date of Birth validation (minimum 18 years)
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // State of origin validation
    if (!formData.state_of_origin) {
      newErrors.state_of_origin = "State of origin is required";
    }

    // LGA validation
    if (!formData.Local_of_origin.trim()) {
      newErrors.Local_of_origin = "Local government is required";
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    // Year of employment validation
    if (!formData.year_of_employment) {
      newErrors.year_of_employment = "Year of employment is required";
    } else {
      const year = parseInt(formData.year_of_employment);
      const currentYear = new Date().getFullYear();
      if (year < 1950 || year > currentYear) {
        newErrors.year_of_employment = `Year must be between 1950 and ${currentYear}`;
      }
    }

    // Marital status validation
    if (!formData.marital_status) {
      newErrors.marital_status = "Marital status is required";
    }

    // CV link validation (optional but if provided, must be valid URL)
    if (formData.cv_link && !URL_REGEX.test(formData.cv_link)) {
      newErrors.cv_link = "Please enter a valid URL";
    }

    // Role-specific validations
    if (formData.role === "pastor") {
      if (!formData.church_branch) {
        newErrors.church_branch = "Church branch is required for pastors";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required for pastors";
      } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Invalid phone number format (use country code +234...)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const result = await register({
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        email: formData.email.toLowerCase().trim(),
        phoneNumber: formData.phoneNumber.trim(),
        Local_of_origin: formData.Local_of_origin.trim(),
        role: formData.role,
        register_source: "web",
        register_device: navigator.userAgent
      }).unwrap();

      if (result?.success) {
        navigate("/otp-verification", {
          state: { email: formData.email },
          replace: true
        });
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Registration failed. Please try again.";
      setErrors({
        form: errorMessage.includes("already exists")
          ? "Account already exists. Please sign in."
          : errorMessage
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Special handling for state selection
    if (field === "state_of_origin") {
      setSelectedState(value);
    }

    if (field === "role") {
      setSelectedRole(value);
      setFormData(prev => ({ ...prev, role: value }));
    }

    // Clear field-specific error when user types
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Special Designed Background Elements - Blue Theme (Same as Sign In) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stained Glass Effect Pattern - Blue Tones */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0px, transparent 20%),
                               radial-gradient(circle at 70% 60%, rgba(37, 99, 235, 0.3) 0px, transparent 25%),
                               radial-gradient(circle at 40% 80%, rgba(29, 78, 216, 0.2) 0px, transparent 30%),
                               repeating-linear-gradient(45deg, transparent 0px, transparent 20px, rgba(59, 130, 246, 0.1) 20px, rgba(59, 130, 246, 0.1) 40px)`,
            }}
          />
        </div>

        {/* Geometric Pattern - Church Window Inspired in Blue */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #1e3a8a 1px, transparent 1px),
                               linear-gradient(to bottom, #1e3a8a 1px, transparent 1px),
                               radial-gradient(circle at 50% 50%, #1e3a8a 2px, transparent 2px)`,
              backgroundSize: "60px 60px, 60px 60px, 30px 30px",
            }}
          />
        </div>

        {/* Gradient Orbs - Blue Colors */}
        <div
          className={`absolute top-1/4 -left-8 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/20 to-indigo-300/20 blur-3xl transition-all duration-1000 ${mounted
            ? "translate-x-0 opacity-100"
            : "-translate-x-20 opacity-0"
            }`}
        />
        <div
          className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-sky-300/20 to-blue-300/20 blur-3xl transition-all duration-1000 delay-300 ${mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/10 via-indigo-200/10 to-sky-200/10 blur-3xl transition-all duration-1000 delay-500 ${mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
        />

        {/* Floating Icons - Blue Theme */}
        <div
          className={`absolute top-32 left-12 text-blue-500/20 transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
        </div>
        <div
          className={`absolute top-52 right-20 text-indigo-500/20 transition-all duration-700 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
        </div>
        <div
          className={`absolute bottom-40 left-32 text-sky-500/20 transition-all duration-700 delay-1100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
        </div>
        <div
          className={`absolute bottom-52 right-32 text-blue-500/20 transition-all duration-700 delay-1300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
        </div>

        {/* Animated Gradient Orbs - Blue Colors */}
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-blue-400/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main Content - Responsive Scrollable Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="relative">
                <Link
                  to="/"
                  className="inline-block transform transition-transform hover:scale-105"
                >
                  <img
                    src={logo}
                    alt="Salvation Ministries Logo"
                    className="rounded-2xl h-16 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
                  />
                </Link>
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl mb-2 font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  Salvation Ministries HRM
                </h1>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-base sm:text-lg text-blue-800/70 max-w-lg mx-auto">
                Create an account to access the Human Resource Management System
              </p>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl mb-8">
            {errors.form && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in fade-in" role="alert" aria-live="polite">
                <p className="text-red-700">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>

                {/* Name Fields - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-blue-900">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.firstName}
                      type="text"
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      id="firstName"
                      placeholder="Enter first name"
                      className={`w-full ${errors.firstName ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-blue-900">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.lastName}
                      type="text"
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      id="lastName"
                      placeholder="Enter last name"
                      className={`w-full ${errors.lastName ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="middleName" className="block text-sm font-medium text-blue-900">
                      Middle Name
                    </label>
                    <Input
                      value={formData.middleName}
                      type="text"
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      id="middleName"
                      placeholder="Enter middle name (optional)"
                      className="w-full border-blue-200 bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Email and Phone - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        id="email"
                        placeholder="your.email@example.com"
                        autoComplete="username"
                        className={`w-full pl-10 ${errors.email ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-blue-900">
                      Phone Number {selectedRole === "pastor" && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <Input
                        value={formData.phoneNumber}
                        type="tel"
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        id="phoneNumber"
                        placeholder="+2348000000000"
                        className={`w-full pl-10 ${errors.phoneNumber ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                  </div>
                </div>

                {/* Date of Birth, Gender, Marital Status - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-blue-900">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        id="dateOfBirth"
                        max={getMinDateOfBirth()}
                        className={`w-full pl-10 ${errors.dateOfBirth ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-blue-900">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      id="gender"
                      className={`w-full p-2.5 rounded-xl border ${errors.gender ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500`}
                    >
                      <option value="">Select Gender</option>
                      {GENDERS.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="marital_status" className="block text-sm font-medium text-blue-900">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.marital_status}
                      onChange={(e) => handleInputChange('marital_status', e.target.value)}
                      id="marital_status"
                      className={`w-full p-2.5 rounded-xl border ${errors.marital_status ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500`}
                    >
                      <option value="">Select Marital Status</option>
                      {MARITAL_STATUS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.marital_status && <p className="text-red-500 text-xs">{errors.marital_status}</p>}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Address Information
                </h2>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-blue-900">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                      <MapPinned className="w-4 h-4" />
                    </div>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      id="address"
                      placeholder="Enter your street address"
                      className={`w-full pl-10 ${errors.address ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-blue-900">
                      City
                    </label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      id="city"
                      placeholder="Enter your city"
                      className="w-full p-2.5 border-blue-200 bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state_of_origin" className="block text-sm font-medium text-blue-900">
                      State of Origin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state_of_origin}
                      onChange={(e) => handleInputChange('state_of_origin', e.target.value)}
                      id="state_of_origin"
                      className={`w-full p-2.5 rounded-xl border ${errors.state_of_origin ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500`}
                    >
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state_of_origin && <p className="text-red-500 text-xs">{errors.state_of_origin}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="Local_of_origin" className="block text-sm font-medium text-blue-900">
                      Local Government Area <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <MapPinned className="w-4 h-4" />
                      </div>
                      <Input
                        type="text"
                        value={formData.Local_of_origin}
                        onChange={(e) => handleInputChange('Local_of_origin', e.target.value)}
                        id="Local_of_origin"
                        placeholder="Enter your local government area"
                        className={`w-full pl-10 ${errors.Local_of_origin ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.Local_of_origin && <p className="text-red-500 text-xs">{errors.Local_of_origin}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-blue-900">
                      Country
                    </label>
                    <Input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      id="country"
                      placeholder="Nigeria"
                      className="w-full border-blue-200 p-2.5 bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information Section */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Employment Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-blue-900">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      id="role"
                      className="w-full p-2.5 rounded-xl border border-blue-200 bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      {ROLES.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-medium text-blue-900">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      id="department"
                      className={`w-full p-2.5 rounded-xl border ${errors.department ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500`}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="year_of_employment" className="block text-sm font-medium text-blue-900">
                      Year of Employment <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <Input
                        type="date"
                        value={formData.year_of_employment}
                        onChange={(e) => handleInputChange('year_of_employment', e.target.value)}
                        id="year_of_employment"
                        placeholder="YYYY"
                        min="1950"
                        max={new Date().getFullYear()}
                        className={`w-full pl-10 p-2.5 ${errors.year_of_employment ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.year_of_employment && <p className="text-red-500 text-xs">{errors.year_of_employment}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cv_link" className="block text-sm font-medium text-blue-900">
                      CV/Resume Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <Input
                        type="url"
                        value={formData.cv_link}
                        onChange={(e) => handleInputChange('cv_link', e.target.value)}
                        id="cv_link"
                        placeholder="https://example.com/my-cv.pdf"
                        className={`w-full pl-10 ${errors.cv_link ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                      />
                    </div>
                    {errors.cv_link && <p className="text-red-500 text-xs">{errors.cv_link}</p>}
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === "pastor" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="space-y-2">
                      <label htmlFor="church_branch" className="block text-sm font-medium text-blue-900">
                        Church Branch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.church_branch}
                        onChange={(e) => handleInputChange('church_branch', e.target.value)}
                        id="church_branch"
                        className={`w-full p-2.5 rounded-xl border ${errors.church_branch ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500`}
                      >
                        <option value="">Select Church Branch</option>
                        {CHURCH_BRANCHES.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                      {errors.church_branch && <p className="text-red-500 text-xs">{errors.church_branch}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Security Section */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Account Security
                </h2>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      id="password"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      minLength={8}
                      className={`w-full pl-10 pr-10 ${errors.password ? "border-red-500" : "border-blue-200"} bg-white/80 text-blue-900 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 rounded-xl`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  <p className="text-xs text-blue-600">Minimum 8 characters required</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2 pt-4">
                <label htmlFor="bio" className="block text-sm font-medium text-blue-900">
                  Brief Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  id="bio"
                  rows={3}
                  placeholder="Tell us a little about yourself..."
                  className="w-full p-3 rounded-xl border border-blue-200 bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] py-6"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Register
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-blue-700">
                Already have an account?{" "}
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center text-sm text-blue-700">
              <p className="italic">"Whatever you do, work at it with all your heart, as working for the Lord"</p>
              <p className="text-xs mt-1">- Colossians 3:23</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2 pb-8">
            <p className="text-xs text-blue-700/60">
              Salvation Ministries HRM • © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Background Adjustments */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-100/20 to-transparent pointer-events-none" />
    </div>
  );
}