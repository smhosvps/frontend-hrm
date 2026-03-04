/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgot_passwordMutation } from "@/redux/features/user/userApi";
import { ChevronLeft, Loader2, Mail, Shield, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/footerlogo.png"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgot_password, { isLoading }] = useForgot_passwordMutation();
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const result: any = await forgot_password({
        email: email.toLowerCase().trim(),
      }).unwrap();

      if (result?.success) {
        // Store email in sessionStorage for reset password
        sessionStorage.setItem("resetEmail", email);

        // Navigate to reset password page
        navigate("/reset-password", {
          state: { email },
          replace: true,
        });
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);

      let errorMessage = "Failed to send reset link. Please try again.";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 404) {
        errorMessage = "No account found with this email address.";
      } else if (err?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
    }
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
          {/* Back Button */}
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
                  Salvation Ministries HRM
                </h1>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <p className="text-base sm:text-lg text-blue-800/70 max-w-lg mx-auto">
                Enter your email to receive a password reset link
              </p>
            </div>
          </div>

          {/* Reset Password Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Key className="w-5 h-5" />
                  <h3 className="font-semibold">Reset Your Password</h3>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-900"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="your.email@salvationministries.org"
                      className="w-full pl-12 py-3.5 rounded-xl border border-blue-200 bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Enter the email address associated with your staff account
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Security Information Box */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-blue-900">
                        Security Information
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Reset link will be sent to your email</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Link expires in 30 minutes for security</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Check your spam folder if not received</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] py-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Send Reset Link
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-blue-100">
              <div className="text-center space-y-3">
                <p className="text-sm text-blue-700">
                  Remember your password?{" "}
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure password reset with 256-bit encryption</span>
                </div>
              </div>
            </div>

            {/* Scripture Verse */}
            <div className="mt-4 text-center text-sm text-blue-700">
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
  );
}