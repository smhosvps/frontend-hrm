/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/api/apiSlice";
import { setCredentials } from "@/redux/features/auth/authSlice";
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Key,
  Church,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/footerlogo.png";

// Security configurations
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const PASSWORD_MIN_LENGTH = 8;
const WELCOME_DURATION = 60; // 60 seconds

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [countdown, setCountdown] = useState(WELCOME_DURATION);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Welcome screen countdown timer
  useEffect(() => {
    if (showWelcome && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setShowWelcome(false);
    }
  }, [showWelcome, countdown]);

  // Lockout timer
  useEffect(() => {
    if (lockout) {
      const timer = setTimeout(() => {
        setLockout(false);
        setAttempts(0);
      }, LOCKOUT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [lockout]);

  // Input validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockout) {
      setError("Too many failed attempts. Please try again in 5 minutes.");
      return;
    }

    if (!validateInputs()) return;

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      setAttempts(0);
      window.location.reload();
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockout(true);
        setError("Account temporarily locked due to multiple failed attempts");
        return;
      }

      const errorMessage = err?.data?.message || "Invalid email or password";

      if (errorMessage === "Please verify your account before logging in") {
        navigate("/otp-verification", { state: { email } });
      } else {
        setError(errorMessage);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
  };

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Special Designed Background Elements - Blue Theme */}
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
            mounted ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
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
        ></div>
        <div
          className={`absolute top-52 right-20 text-indigo-500/20 transition-all duration-700 delay-900 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        ></div>
        <div
          className={`absolute bottom-40 left-32 text-sky-500/20 transition-all duration-700 delay-1100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        ></div>
        <div
          className={`absolute bottom-52 right-32 text-blue-500/20 transition-all duration-700 delay-1300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        ></div>

        {/* Animated Gradient Orbs - Blue Colors */}
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-blue-400/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section - Always Visible */}
          {!showWelcome && (
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
                      className="rounded-2xl h-20 sm:h-24 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
                    />
                  </Link>
                </div>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl mb-2 font-bold bg-[#1969fe] bg-clip-text text-transparent">
                    Salvation Ministries <br />
                    HRM
                  </h1>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section - Shown for 60 seconds */}
          {showWelcome ? (
            <div className="w-full max-w-7xl mx-auto">
              {/* Countdown Timer */}
              <div className="flex justify-center md:justify-end mb-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-800">
                    Auto-redirect in {formatCountdown(countdown)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkipWelcome}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-3 py-1 h-auto text-xs font-semibold"
                  >
                    Skip <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Beautiful Welcome Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100/50 p-3 sm:p-10 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-200/20 to-blue-200/20 rounded-full blur-3xl -ml-20 -mb-20" />

                {/* Church Window Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 30%, #3b82f6 0px, transparent 8%),
                                       radial-gradient(circle at 80% 70%, #6366f1 0px, transparent 10%),
                                       repeating-linear-gradient(45deg, transparent 0px, transparent 20px, rgba(59, 130, 246, 0.1) 20px, rgba(59, 130, 246, 0.1) 40px)`,
                    }}
                  />
                </div>

                <div className="flex justify-center items-center">
                  <Link
                    to="/"
                    className="inline-block transform transition-transform hover:scale-105 mb-4"
                  >
                    <img
                      src={logo}
                      alt="Salvation Ministries Logo"
                      className="rounded-2xl h-16 sm:h-24 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
                    />
                  </Link>
                </div>

                {/* Welcome Title */}
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                  <span className="bg-[#1969fe] bg-clip-text text-transparent">
                    Welcome to Salvation Ministries HRM
                  </span>
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
                  The official Human Resource Management System for staff of
                  <span className="font-semibold text-[#1969fe]">
                    {" "}
                    Salvation Ministries
                  </span>
                </p>

                {/* Important Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-[#1969fe] p-6 rounded-2xl mb-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="bg-blue-100 p-2 flex rounded-full justify-center items-center">
                      <AlertCircle className="w-6 h-6 text-[#1969fe]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1969fe] text-lg mb-2 text-center ">
                        Important Membership Notice
                      </h3>
                      <p className="text-[#1969fe] leading-relaxed text-center">
                        This HRM portal is{" "}
                        <span className="font-bold">
                          exclusively for staffs of Salvation Ministries
                        </span>
                        . By proceeding, you confirm that you are a staff of the
                        ministry. Non-staffs will not be approved for access.
                        All registrations are subject to verification by the HR
                        department.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span>
                    Redirecting to sign in in {formatCountdown(countdown)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 animate-in fade-in rounded-2xl border border-red-500 bg-red-50"
                  >
                    <AlertCircle className="h-4 w-4 !text-red-700" />
                    <AlertTitle className="text-red-600">
                      Login Error
                    </AlertTitle>
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-blue-900"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-700" />
                        Email Address
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || lockout}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-blue-200 bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                        placeholder="your.email@salvationministries.org"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-blue-900"
                      >
                        <span className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-blue-700" />
                          Password
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none transition-colors"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <Key className="w-4 h-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading || lockout}
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-blue-200 bg-white/80 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-blue-600">
                      Minimum {PASSWORD_MIN_LENGTH} characters required
                    </p>
                  </div>

                  {/* Security Status */}
                  {attempts > 0 && attempts < MAX_ATTEMPTS && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Warning:</span> {attempts}{" "}
                        failed attempt{attempts > 1 ? "s" : ""}. Account will be
                        locked after {MAX_ATTEMPTS - attempts} more failed
                        attempt
                        {MAX_ATTEMPTS - attempts > 1 ? "s" : ""}.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading || lockout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed py-6"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Authenticating...
                      </span>
                    ) : lockout ? (
                      <span className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Account Locked
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Church className="w-5 h-5" />
                        Sign In to HRM Portal
                      </span>
                    )}
                  </Button>
                </form>

                {/* Additional Links */}
                <div className="mt-8 space-y-4">
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Register New User Link */}
                  <div className="text-center border-t border-blue-100 pt-4">
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors group"
                    >
                      Register New User
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer - Always Visible */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-blue-700/80">
              "Whatever you do, work at it with all your heart, as working for
              the Lord" — Colossians 3:23
            </p>
            <p className="text-xs text-blue-700/60">
              Salvation Ministries HRM • © {new Date().getFullYear()} All rights
              reserved
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
