
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReset_passwordMutation } from "@/redux/features/user/userApi";
import logo from "../../assets/footerlogo.png"

export default function ResetPasswordScreen() {
  const [resetPassword, { isLoading }] = useReset_passwordMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmail = location.state?.email;
  const [email, setEmail] = useState(storedEmail || "");

  console.log(setEmail)
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!storedEmail) {
      navigate("/forgot-password");
    }
  }, [navigate, storedEmail]);

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be exactly 6 digits";
    }

    if (!newPassword) {
      newErrors.password = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) return;

    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword,
      }).unwrap();

      if (result?.success) {
        setSuccess("Password reset successfully! Redirecting to login...");

        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 400) {
        errorMessage = "Invalid OTP or expired. Please request a new one.";
      } else if (err?.status === 404) {
        errorMessage = "User not found. Please check your email.";
      } else if (err?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return ""
    const [username, domain] = email.split("@")
    if (username.length <= 3) return email
    const maskedUsername = username.slice(0, 3) + "***" + username.slice(-1)
    return `${maskedUsername}@${domain}`
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Special Designed Background Elements - Same as Sign In */}
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          
        <div className="absolute top-6 left-2 md:left-8 lg:left-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors bg-white/80 backdrop-blur-sm pr-2 md:px-3 py-2 rounded-lg shadow-sm border border-blue-100"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Sign In
            </Link>
          </div>

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
                  Reset Password
                </h1>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-base sm:text-lg text-blue-800/70 max-w-lg mx-auto">
                Enter the OTP sent to your email and create a new secure password
              </p>
            </div>
          </div>

          {/* Reset Password Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            
            {/* Email Info */}
            {email && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-medium">Password reset for:</p>
                  <p className="text-sm font-semibold text-blue-900 break-all">
                    {maskEmail(email)}
                  </p>
                </div>
              </div>
            )}

            {/* Error/Success Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in rounded-xl border border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 !text-red-700" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 animate-in fade-in rounded-xl border border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-blue-900"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-700" />
                    OTP Code *
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp)
                        setErrors((prev) => ({ ...prev, otp: "" }));
                    }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                      errors.otp ? "border-red-500" : "border-blue-200"
                    } bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
                <p className="text-xs text-blue-600">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-blue-900"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-700" />
                    New Password *
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <Shield className="w-4 h-4" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                      errors.password ? "border-red-500" : "border-blue-200"
                    } bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-blue-600">
                  Minimum 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-blue-900"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-700" />
                    Confirm Password *
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="Re-enter your password"
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-blue-200"
                    } bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-blue-600  hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed py-6"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </span>
                )}
              </Button>

              {/* Security Note */}
              <div className="pt-4 border-t border-blue-100">
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    All information is encrypted and secured with 256-bit SSL
                  </span>
                </div>
              </div>

              {/* Scripture Verse */}
              <div className="mt-4 text-center text-sm text-blue-700">
                <p className="italic">"Whatever you do, work at it with all your heart, as working for the Lord"</p>
                <p className="text-xs mt-1">- Colossians 3:23</p>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-blue-100">
              <div className="text-center">
                <p className="text-sm text-blue-700">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
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
  );
}