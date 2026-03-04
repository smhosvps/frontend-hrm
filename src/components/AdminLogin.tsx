/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"
import { useEffect, useState } from "react"
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useLoginMutation } from "@/redux/api/apiSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setCredentials } from "@/redux/features/auth/authSlice"
import logo from "../assets/smhos-log.png"

interface AdminLoginProps {
    onLogin: (email: string) => void
    onBack: () => void
  }
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const PASSWORD_MIN_LENGTH = 8;

export default function AdminLogin({onBack }: AdminLoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, }] = useLoginMutation<any>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(() => {
      // Get attempts from localStorage or default to 0
      const stored = localStorage.getItem('loginAttempts');
      return stored ? parseInt(stored, 10) : 0;
    });
    const [lockout, setLockout] = useState(() => {
      // Get lockout status from localStorage
      const lockoutUntil = localStorage.getItem('lockoutUntil');
      if (lockoutUntil) {
        const lockoutTime = parseInt(lockoutUntil, 10);
        return Date.now() < lockoutTime;
      }
      return false;
    });
    const [remainingTime, setRemainingTime] = useState(0);

    // Lockout timer effect
    useEffect(() => {
      if (lockout) {
        const lockoutUntil = parseInt(localStorage.getItem('lockoutUntil') || '0', 10);
        const interval = setInterval(() => {
          const now = Date.now();
          const timeLeft = lockoutUntil - now;
          
          if (timeLeft <= 0) {
            clearInterval(interval);
            setLockout(false);
            setAttempts(0);
            localStorage.removeItem('lockoutUntil');
            localStorage.removeItem('loginAttempts');
            setError(null);
          } else {
            setRemainingTime(timeLeft);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [lockout]);

    // Store attempts and lockout in localStorage
    useEffect(() => {
      localStorage.setItem('loginAttempts', attempts.toString());
    }, [attempts]);

    const setLockoutWithStorage = (lockoutTime: number) => {
      setLockout(true);
      localStorage.setItem('lockoutUntil', lockoutTime.toString());
    };

    // Input validation
    const validateInputs = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.trim()) {
        setError("Email is required");
        return false;
      }

      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return false;
      }

      if (!password.trim()) {
        setError("Password is required");
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
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        setError(`Account is locked. Please try again in ${minutes}:${seconds.toString().padStart(2, '0')}`);
        return;
      }

      if (!validateInputs()) return;

      try {
        const userData = await login({ email, password }).unwrap();
        
        // Reset attempts on successful login
        setAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');
        
        dispatch(setCredentials(userData));
        navigate("/dashboard");
      } catch (err: any) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          setLockoutWithStorage(lockoutTime);
          
          const minutes = Math.floor(LOCKOUT_DURATION / 60000);
          const seconds = Math.floor((LOCKOUT_DURATION % 60000) / 1000);
          setError(`Too many failed attempts. Account locked for ${minutes} minutes ${seconds} seconds.`);
          return;
        }

        let errorMessage = "Invalid email or password";
        
        if (err?.data?.message) {
          if (err.data.message.includes("not found") || err.data.message.includes("Invalid credentials")) {
            errorMessage = `Invalid email or password. ${MAX_ATTEMPTS - newAttempts} attempts remaining`;
          } else if (err.data.message === "Account not verified") {
            navigate("/otp-verification", { state: { email } });
            return;
          } else {
            errorMessage = err.data.message;
          }
        }
        
        setError(errorMessage);
      }
    };

    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (error) setError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (error) setError(null);
    };

    const resetLoginAttempts = () => {
      setAttempts(0);
      setLockout(false);
      setError(null);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutUntil');
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-purple-200 py-8 px-2 md:px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border-2 border-purple-400 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-6 text-center">
          <div className="bg-blue-600 text-white px-6 py-4 flex flex-col items-center gap-4">
              <img src={logo} className="h-[45px] md:h-[60px]" />
         
          </div>
            <h1 className="text-2xl font-bold">SALVATION MINISTRIES STAFF DATABASE MANAGEMENT</h1>
            <p className="text-sm text-blue-100 mt-1">Admin Portal</p>
          </div>

          {/* Lockout Warning */}
          {lockout && (
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Account Temporarily Locked</p>
                  <p className="text-xs text-red-600">
                    Too many failed attempts. Please try again in {formatTime(remainingTime)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attempts Counter */}
          {attempts > 0 && !lockout && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">
                  <span className="font-semibold">{attempts}</span> failed attempt{attempts > 1 ? 's' : ''}
                </span>
                <span className="text-xs text-yellow-600">
                  {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining
                </span>
              </div>
              <div className="mt-2 h-2 bg-yellow-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">Admin Login</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Secure access to the administration panel
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Login Failed</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="admin@salvationministries.com"
                    disabled={lockout || isLoading}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    disabled={lockout || isLoading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={lockout || isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-gray-500">
                    Minimum {PASSWORD_MIN_LENGTH} characters
                  </span>
                  {password.length > 0 && (
                    <span className={`text-xs ${password.length >= PASSWORD_MIN_LENGTH ? 'text-green-600' : 'text-red-600'}`}>
                      {password.length}/{PASSWORD_MIN_LENGTH}
                    </span>
                  )}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={lockout || isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-[5px] hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Reset Attempts Button (for testing/demo) */}
              {(attempts > 0 || lockout) && process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={resetLoginAttempts}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset Login Attempts (Development Only)
                </button>
              )}
            </form>

            {/* Back Button */}
            <button
              onClick={onBack}
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-[5px] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Back to Menu
            </button>

            {/* Security Info */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security Information
              </h4>
              <ul className="space-y-2 text-xs text-blue-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Maximum {MAX_ATTEMPTS} login attempts allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Account locked for {LOCKOUT_DURATION / 60000} minutes after {MAX_ATTEMPTS} failed attempts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Passwords are encrypted and never stored in plain text</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-purple-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Protected by Advanced Security</span>
          </div>
        </div>
      </div>
    </div>
  )
}