/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, KeyboardEvent, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { 
  Loader2, 
  Mail, 
  Clock,
  CheckCircle2,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActivationMutation, useResendOtpMutation } from "@/redux/features/user/userApi"
import { toast } from "react-toastify"
import logo from "../../assets/footerlogo.png"

export default function OTPVerificationScreen() {
  const [activation, { isLoading: isActivationLoading }] = useActivationMutation()
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation()
  const [otp, setOtp] = useState(["", "", "", "", "",])
  const location = useLocation()
  const navigate = useNavigate()
  const storedEmail = location.state?.email
  const [email, setEmail] = useState(storedEmail)
  const [countdown, setCountdown] = useState(60)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  console.log(email)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!storedEmail) {
      navigate("/signin")
    } else {
      setEmail(storedEmail)
    }
  }, [storedEmail, navigate])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 5) {
        inputRefs[index + 1].current?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")
    if (otpString.length !== 5) {
      setError("Please enter a valid 5-digit OTP")
      return
    }
    setError("")
    try {
      const result = await activation({ otp: otpString, email }).unwrap()
      if (result?.success) {
        toast.success("Account verified successfully!")
        navigate("/signin")
      }
    } catch (err: any) {
      setError(err?.data?.message || "Verification failed. Please try again.")
      toast.error("Verification failed. Please try again.")
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    try {
      await resendOtp({ email }).unwrap()
      setCountdown(60)
      toast.success("OTP resent successfully!")
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
      console.log(err)
      toast.error("Failed to resend OTP. Please try again.")
    }
  }

  // Format email for display (mask part of it)
  const maskEmail = (email: string) => {
    if (!email) return ""
    const [username, domain] = email.split("@")
    if (username.length <= 3) return email
    const maskedUsername = username.slice(0, 3) + "***" + username.slice(-1)
    return `${maskedUsername}@${domain}`
  }

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
          className={`absolute top-1/4 -left-8 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/20 to-indigo-300/20 blur-3xl transition-all duration-1000 ${
            mounted
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
          }`}
        />
        <div
          className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-sky-300/20 to-blue-300/20 blur-3xl transition-all duration-1000 delay-300 ${
            mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/10 via-indigo-200/10 to-sky-200/10 blur-3xl transition-all duration-1000 delay-500 ${
            mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />

        {/* Floating Icons - Blue Theme */}
        <div
          className={`absolute top-32 left-12 text-blue-500/20 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
        </div>
        <div
          className={`absolute top-52 right-20 text-indigo-500/20 transition-all duration-700 delay-900 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
        </div>
        <div
          className={`absolute bottom-40 left-32 text-sky-500/20 transition-all duration-700 delay-1100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
        </div>
        <div
          className={`absolute bottom-52 right-32 text-blue-500/20 transition-all duration-700 delay-1300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
        </div>

        {/* Animated Gradient Orbs - Blue Colors */}
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-blue-400/10 rounded-full animate-pulse delay-1000" />

        {/* Additional Stained Glass Effects */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-300 via-indigo-300 to-sky-300 rotate-45 transform origin-center" 
               style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 opacity-10">
          <div className="w-full h-full bg-gradient-to-tl from-sky-300 via-blue-300 to-indigo-300 rotate-12 transform origin-center"
               style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)" }} />
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="absolute top-6 left-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Login
            </Link>
          </div>
        <div className="w-full max-w-md mx-auto">
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
                  Email Verification
                </h1>
              </div>
            </div>
          </div>

          {/* OTP Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            
            {/* Email Info */}
            {email && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-medium">Verification code sent to:</p>
                  <p className="text-sm font-semibold text-blue-900 break-all">
                    {maskEmail(email)}
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-sm text-blue-700/70">
                Please enter the 6-digit code sent to your email address
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-900 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 focus:border-blue-500 rounded-xl bg-white/80 text-blue-900"
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in fade-in">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Timer Info */}
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-xl">
                <Clock className="w-4 h-4" />
                <span>Code expires in <span className="font-bold">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span></span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] py-6"
                disabled={isActivationLoading}
              >
                {isActivationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Verify Account
                  </>
                )}
              </Button>
            </form>

            {/* Resend OTP Section */}
            <div className="mt-6 text-center border-t border-blue-100 pt-6">
              <p className="text-sm text-blue-700 mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isResendLoading}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 transition-all duration-200"
              >
                {isResendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : countdown > 0 ? (
                  `Resend available in ${countdown}s`
                ) : (
                  'Resend Verification Code'
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600/70">
                Check your spam folder if you don't see the email in your inbox
              </p>
            </div>

            {/* Scripture Verse */}
            <div className="mt-6 text-center text-sm text-blue-700 border-t border-blue-100 pt-4">
              <p className="italic">"Whatever you do, work at it with all your heart, as working for the Lord"</p>
              <p className="text-xs mt-1">- Colossians 3:23</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
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
  )
}