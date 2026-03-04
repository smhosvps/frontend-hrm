"use client";

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Shield,
  Users,
  BarChart3,
  Building2,
  ShieldCheck,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  BellDotIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "./redux/api/apiSlice";

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(45, 90, 61, 0.4);
    }
    50% {
      box-shadow: 0 0 30px rgba(45, 90, 61, 0.6);
    }
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes floatShape1 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(20px, -20px) rotate(5deg);
    }
  }

  @keyframes floatShape2 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-15px, 15px) rotate(-5deg);
    }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes wave {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInTop {
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-down {
    animation: fadeInDown 0.8s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .animate-gradient-shift {
    animation: gradientShift 15s ease infinite;
    background-size: 200% 200%;
  }

  .animate-float-shape-1 {
    animation: floatShape1 25s ease-in-out infinite;
  }

  .animate-float-shape-2 {
    animation: floatShape2 20s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }

  .animate-wave {
    animation: wave 20s linear infinite;
  }

  .animate-rotate-slow {
    animation: rotate 60s linear infinite;
  }

  .animate-sparkle {
    animation: sparkle 2s ease-in-out infinite;
  }

  .animate-slide-in-top {
    animation: slideInTop 0.3s ease-out forwards;
  }

  .delay-100 {
    animation-delay: 0.1s;
  }

  .delay-200 {
    animation-delay: 0.2s;
  }

  .delay-300 {
    animation-delay: 0.3s;
  }

  .delay-400 {
    animation-delay: 0.4s;
  }

  .delay-500 {
    animation-delay: 0.5s;
  }

  /* Responsive text sizes */
  @media (max-width: 640px) {
    .responsive-heading {
      font-size: 2rem;
      line-height: 1.2;
    }
    
    .responsive-subheading {
      font-size: 1rem;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .responsive-heading {
      font-size: 3rem;
    }
  }

  /* Touch-friendly buttons */
  @media (max-width: 768px) {
    .touch-button {
      min-height: 48px;
      padding: 12px 24px;
    }
  }

  /* Mobile menu overlay */
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 40;
  }
`;

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery();
  const navigate = useNavigate();

  const user = userData?.user;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        mobileMenu &&
        menuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    // Clear user session/token
    localStorage.removeItem("token");
    sessionStorage.removeItem("verificationEmail");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Check if user is logged in and verified
  const isLoggedInAndVerified = user && user.isVerified;

  // Check user role for dashboard access
  const isAdmin =
    user && (user.role === "admin" || user.role === "Super Admin");
  const isStaff = user && user.role === "staff";

  // Helper function to get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "staff":
        return "Staff";
      default:
        return role;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay animate-fade-in-down"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
                    alt="Logo"
                    className=""
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-green-700">FMWUD</h1>
                  <p className="text-xs text-gray-500">Staff Database</p>
                </div>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden md:flex gap-4">
                {isUserLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
                  </div>
                ) : isLoggedInAndVerified ? (
                  <div className="flex items-center gap-4">
                    {/* User Info */}
                    <div className="hidden lg:flex items-center gap-2 bg-green-50 border border-green-200 rounded-[6px] px-3 py-1">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>

                    {/* Dashboard Button */}
                    {isAdmin ? (
                      <Link to="/admin-dashboard">
                        <Button className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button text-sm md:text-base flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : isStaff ? (
                      <Link to="/dashboard">
                        <Button className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button text-sm md:text-base flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : null}

                    {/* Logout Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 rounded-[6px] items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  // Show login/register buttons for non-logged in users
                  <div className="flex gap-4">
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="border-[#187339] rounded-[6px] text-[#187339] hover:bg-green-50 bg-transparent touch-button text-sm lg:text-base"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button text-sm lg:text-base">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center gap-2">
                {isLoggedInAndVerified && (
                  <div className="flex items-center gap-2 mr-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700 truncate max-w-[100px]">
                      {user.firstName}
                    </span>
                  </div>
                )}

                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100 visible"
                : "-translate-y-4 opacity-0 invisible"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              {isUserLoading ? (
                <div className="flex flex-col items-center py-8">
                  <div className="animate-pulse bg-gray-200 rounded h-10 w-full mb-4"></div>
                  <div className="animate-pulse bg-gray-200 rounded h-10 w-full"></div>
                </div>
              ) : isLoggedInAndVerified ? (
                <>
                  {/* User Profile Section */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-[6px]">
                        <div className="text-lg font-bold text-green-700">
                          Active
                        </div>
                        <div className="text-xs text-gray-600">Status</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-[6px]">
                        <div className="text-lg font-bold text-blue-700">
                          {user.staffId || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">Staff ID</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="space-y-2">
                    <Link
                      to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-[50px] bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <LayoutDashboard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Access your workspace
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-[50px] bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Settings className="w-5 h-5  text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Profile Settings
                        </div>
                        <div className="text-sm text-gray-600">
                          Manage your account
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-[50px] bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <BellDotIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium  text-green-600">
                          Notification
                        </div>
                        <div className="text-sm text-gray-600">
                          See all notifications
                        </div>
                      </div>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors group mt-4"
                    >
                      <div className="w-10 h-10 rounded-[50px] bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-red-600">Logout</div>
                        <div className="text-sm text-red-500">
                          Sign out of your account
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                // Mobile menu for non-logged in users
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Welcome to FMWUD Portal
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Secure staff management system for Federal Ministry of
                      Works and Urban Development
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button">
                        Create Account
                      </Button>
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 bg-transparent rounded-[6px] font-medium touch-button"
                      >
                        Staff Login
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Quick Links
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="#"
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-xs text-gray-600">About</div>
                      </a>
                      <a
                        href="#"
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-xs text-gray-600">Help</div>
                      </a>
                      <a
                        href="#"
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-xs text-gray-600">Contact</div>
                      </a>
                      <a
                        href="#"
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-xs text-gray-600">FAQs</div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-slide-in-left flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6 animate-fade-in-down w-fit">
                  <Shield className="w-4 h-4" />
                  Official Government Portal
                </div>

                <h1 className="responsive-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-green-900 mb-4 sm:mb-6 leading-tight animate-fade-in-up">
                  Federal Ministry of Works & Urban Development
                  <span className="block text-[#187339] mt-2">
                    Staff Portal
                  </span>
                </h1>

                <p className="responsive-subheading text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed animate-fade-in-up delay-100">
                  Secure, efficient, and professional staff database management
                  system for the Federal Ministry of Works and Urban
                  Development, Nigeria.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-fade-in-up delay-200">
                  {isUserLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
                    </div>
                  ) : isLoggedInAndVerified ? (
                    <div className="flex items-center gap-4">
                      {isAdmin ? (
                        <Link to="/admin-dashboard">
                          <Button className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button text-sm sm:text-base flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Button>
                        </Link>
                      ) : isStaff ? (
                        <Link to="/dashboard">
                          <Button className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-shadow touch-button text-sm sm:text-base flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Button>
                        </Link>
                      ) : null}

                      {/* Logout Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="border-red-300 hidden md:flex text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 rounded-[6px] items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:gap-4">
                      <Link
                        to="/register"
                        className="w-full sm:w-auto flex-1 sm:flex-none"
                      >
                        <Button
                          size={isMobile ? "default" : "lg"}
                          className="bg-gradient-to-r from-[#187339] to-emerald-600 hover:from-[#197c3d] hover:to-emerald-700 w-full sm:w-auto rounded-[6px] text-white shadow-lg hover:shadow-xl transition-all touch-button"
                        >
                          Get Started Today
                        </Button>
                      </Link>
                      <Link
                        to="/login"
                        className="w-full sm:w-auto flex-1 sm:flex-none"
                      >
                        <Button
                          size={isMobile ? "default" : "lg"}
                          variant="outline"
                          className="border-2 border-green-600 text-green-600 hover:bg-green-50 bg-transparent w-full sm:w-auto rounded-[6px] font-medium touch-button"
                        >
                          Staff Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 sm:mt-12 animate-fade-in-up delay-300">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-[#187339]">
                      5000+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Staff Members
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-[#187339]">
                      99.9%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Uptime
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-[#187339]">
                      24/7
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Support
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-green-200/50 shadow-2xl animate-slide-in-right">
                  {/* Floating Elements */}
                  <div className="absolute -top-3 -right-3 w-24 h-24 bg-green-100/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-emerald-100/20 rounded-full blur-xl"></div>

                  <div className="relative z-10">
                    {/* Staff Images Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      {[
                        {
                          title: "Staff Member",
                          image:
                            "https://img.freepik.com/free-photo/smiling-businessman-signing-contract_23-2147626425.jpg?semt=ais_hybrid&w=740&q=80",
                        },
                        {
                          title: "Staff Member",
                          image:
                            "https://prod.cdn-medias.africabusinessplus.com/cdn-cgi/image/q=auto,f=auto,metadata=none,width=664,height=498,fit=cover/https://prod.cdn-medias.africabusinessplus.com/medias/2025/03/03/ab20250303-nomination-aziz-diallo-canal-afrique.jpg",
                        },
                        {
                          title: "Staff Member",
                          image:
                            "https://theglasshammer.com/wp-content/uploads/2018/02/5094317586.jpg",
                        },
                      ].map((staff, index) => (
                        <div
                          key={index.toString()}
                          className="relative h-24 sm:h-32 md:h-40 w-full rounded-xl border-4 border-white shadow-lg overflow-hidden group animate-float"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Staff Image */}
                          <img
                            src={staff.image}
                            alt={staff.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs font-medium text-center">
                              {staff.title}
                            </p>
                          </div>

                          {/* Hover Effect Indicator */}
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        {
                          title: "Dashboard Access",
                          description: "Manage your professional profile",
                          staff:
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhZmYlMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
                        },
                        {
                          title: "Verification System",
                          description: "Secure credential validation",
                          staff:
                            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhZmYlMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
                        },
                        {
                          title: "Admin Controls",
                          description: "Advanced management tools",
                          staff:
                            "https://images.unsplash.com/photo-1522202176988-66273c2fd55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhZmYlMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
                        },
                      ].map((feature, idx) => (
                        <div
                          key={idx}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-green-800">
                                {feature.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute top-0 left-0 w-16 h-16 border-2 border-green-200/30 rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-2 border-emerald-200/30 rounded-full animate-ping delay-700"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 py-12 sm:py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16 animate-fade-in-down">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-700 mb-3 sm:mb-4">
                Features
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
               See our comprehensive process for our staff data enrollment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: Shield,
                  title: "Secure Access",
                  description:
                    "Industry-standard security protocols protect all staff data and credentials",
                },
                {
                  icon: Users,
                  title: "Staff Profiles",
                  description:
                    "Complete professional profiles with verification and credential management",
                },
                {
                  icon: CheckCircle2,
                  title: "Verification",
                  description:
                    "Streamlined credential verification process for all staff members",
                },
                {
                  icon: BarChart3,
                  title: "Admin Dashboard",
                  description:
                    "Advanced analytics and management tools for administrators",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 border border-green-200 rounded-xl p-5 sm:p-6 lg:p-8 hover:border-green-400 transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <feature.icon className="w-10 sm:w-12 h-10 sm:h-12 text-green-600 mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-semibold text-green-700 mb-2 sm:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative z-10 py-12 sm:py-20 lg:py-32 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-in-left">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-700 leading-tight">
                  Streamline Staff Management
                </h3>
                {[
                  "Centralized staff database management",
                  "Automated verification workflows",
                  "Real-time profile updates",
                  "Comprehensive admin reporting",
                  "Secure data protection",
                  "Multi-level access controls",
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 sm:gap-4 items-start animate-fade-in-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className="text-base sm:text-lg text-gray-700 font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border-2 border-green-200 p-6 sm:p-8 lg:p-10 shadow-lg animate-slide-in-right w-full">
                <h4 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 sm:mb-6 animate-fade-in-down">
                  Why Choose Our Portal?
                </h4>
                <div className="space-y-3 sm:space-y-4 text-gray-700">
                  <p className="animate-fade-in-up delay-100 text-sm sm:text-base">
                    <span className="font-semibold text-green-700">
                      Official Government System:
                    </span>{" "}
                    Trusted by the Federal Ministry of Works and Urban
                    Development for secure staff management.
                  </p>
                  <p className="animate-fade-in-up delay-200 text-sm sm:text-base">
                    <span className="font-semibold text-green-700">
                      Professional Development:
                    </span>{" "}
                    Support staff growth with comprehensive profile management
                    and credentials tracking.
                  </p>
                  <p className="animate-fade-in-up delay-300 text-sm sm:text-base">
                    <span className="font-semibold text-green-700">
                      Data Security:
                    </span>{" "}
                    Enterprise-grade security protocols ensure all information
                    remains confidential and protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Special Background Design */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Wave Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0 bg-repeat-x animate-wave"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='200' viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 C 100 50, 200 150, 300 100 S 500 50, 600 100' stroke='%23187339' fill='none' stroke-width='2'/%3E%3Cpath d='M0 120 C 100 70, 200 170, 300 120 S 500 70, 600 120' stroke='%23187339' fill='none' stroke-width='1.5' opacity='0.7'/%3E%3C/svg%3E")`,
                  backgroundSize: "400px 200px",
                  height: "100%",
                }}
              ></div>
            </div>

            {/* Rotating Gear Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 opacity-5 animate-rotate-slow">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-[#187339]"
              >
                <path d="M50,15 C57,15 63,18 67,22 C71,26 74,32 74,39 C74,46 71,52 67,56 C63,60 57,63 50,63 C43,63 37,60 33,56 C29,52 26,46 26,39 C26,32 29,26 33,22 C37,18 43,15 50,15 Z M50,20 C44,20 39,23 35,27 C31,31 28,36 28,42 C28,48 31,53 35,57 C39,61 44,64 50,64 C56,64 61,61 65,57 C69,53 72,48 72,42 C72,36 69,31 65,27 C61,23 56,20 50,20 Z M60,30 L65,35 L60,40 L55,35 Z M40,30 L45,35 L40,40 L35,35 Z M50,40 L55,45 L50,50 L45,45 Z"></path>
              </svg>
            </div>

            <div
              className="absolute bottom-10 right-10 w-24 h-24 opacity-5 animate-rotate-slow"
              style={{ animationDirection: "reverse" }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full fill-[#187339]"
              >
                <path d="M50,15 C57,15 63,18 67,22 C71,26 74,32 74,39 C74,46 71,52 67,56 C63,60 57,63 50,63 C43,63 37,60 33,56 C29,52 26,46 26,39 C26,32 29,26 33,22 C37,18 43,15 50,15 Z M50,20 C44,20 39,23 35,27 C31,31 28,36 28,42 C28,48 31,53 35,57 C39,61 44,64 50,64 C56,64 61,61 65,57 C69,53 72,48 72,42 C72,36 69,31 65,27 C61,23 56,20 50,20 Z M60,30 L65,35 L60,40 L55,35 Z M40,30 L45,35 L40,40 L35,35 Z M50,40 L55,45 L50,50 L45,45 Z"></path>
              </svg>
            </div>

            {/* Sparkling Dots */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#187339] rounded-full animate-sparkle"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + i * 7}%`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.3,
                }}
              ></div>
            ))}

            {/* Floating Icons */}
            <div className="absolute top-1/4 right-1/4 opacity-10 animate-float">
              <Building2 className="w-16 h-16 text-[#187339]" />
            </div>
            <div className="absolute bottom-1/3 left-1/4 opacity-10 animate-float delay-300">
              <FileCheck className="w-12 h-12 text-[#187339]" />
            </div>
          </div>

          {/* Main CTA Content */}
          {/* CTA Section - Special Background Design */}
          <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Wave Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0 bg-repeat-x animate-wave"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='200' viewBox='0 0 400 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 C 100 50, 200 150, 300 100 S 500 50, 600 100' stroke='%23187339' fill='none' stroke-width='2'/%3E%3Cpath d='M0 120 C 100 70, 200 170, 300 120 S 500 70, 600 120' stroke='%23187339' fill='none' stroke-width='1.5' opacity='0.7'/%3E%3C/svg%3E")`,
                    backgroundSize: "400px 200px",
                    height: "100%",
                  }}
                ></div>
              </div>

              {/* Rotating Gear Elements */}
              <div className="absolute top-10 left-10 w-32 h-32 opacity-5 animate-rotate-slow">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full fill-[#187339]"
                >
                  <path d="M50,15 C57,15 63,18 67,22 C71,26 74,32 74,39 C74,46 71,52 67,56 C63,60 57,63 50,63 C43,63 37,60 33,56 C29,52 26,46 26,39 C26,32 29,26 33,22 C37,18 43,15 50,15 Z M50,20 C44,20 39,23 35,27 C31,31 28,36 28,42 C28,48 31,53 35,57 C39,61 44,64 50,64 C56,64 61,61 65,57 C69,53 72,48 72,42 C72,36 69,31 65,27 C61,23 56,20 50,20 Z M60,30 L65,35 L60,40 L55,35 Z M40,30 L45,35 L40,40 L35,35 Z M50,40 L55,45 L50,50 L45,45 Z"></path>
                </svg>
              </div>

              <div
                className="absolute bottom-10 right-10 w-24 h-24 opacity-5 animate-rotate-slow"
                style={{ animationDirection: "reverse" }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full fill-[#187339]"
                >
                  <path d="M50,15 C57,15 63,18 67,22 C71,26 74,32 74,39 C74,46 71,52 67,56 C63,60 57,63 50,63 C43,63 37,60 33,56 C29,52 26,46 26,39 C26,32 29,26 33,22 C37,18 43,15 50,15 Z M50,20 C44,20 39,23 35,27 C31,31 28,36 28,42 C28,48 31,53 35,57 C39,61 44,64 50,64 C56,64 61,61 65,57 C69,53 72,48 72,42 C72,36 69,31 65,27 C61,23 56,20 50,20 Z M60,30 L65,35 L60,40 L55,35 Z M40,30 L45,35 L40,40 L35,35 Z M50,40 L55,45 L50,50 L45,45 Z"></path>
                </svg>
              </div>

              {/* Sparkling Dots */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#187339] rounded-full animate-sparkle"
                  style={{
                    left: `${10 + i * 10}%`,
                    top: `${20 + i * 7}%`,
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.3,
                  }}
                ></div>
              ))}

              {/* Floating Icons */}
              <div className="absolute top-1/4 right-1/4 opacity-10 animate-float">
                <Building2 className="w-16 h-16 text-[#187339]" />
              </div>
              <div className="absolute bottom-1/3 left-1/4 opacity-10 animate-float delay-300">
                <FileCheck className="w-12 h-12 text-[#187339]" />
              </div>
            </div>

            {/* Main CTA Content */}
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-[#187339]/90 to-emerald-700/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 animate-fade-in-down">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-white font-medium text-sm sm:text-base">
                      Official & Secure
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-down leading-tight">
                    Ready to Get Started?
                  </h3>

                  {/* <div className="relative mb-6 sm:mb-8 animate-fade-in-up">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                  <p className="relative text-sm sm:text-base lg:text-lg text-white/90 animate-fade-in-up delay-100 mb-4 sm:mb-6">
                    Join thousands of staff members managing their professional
                    profiles securely
                  </p>
                </div> */}

                  {/* Responsive Button Group */}
                  <div className="w-full animate-fade-in-up delay-200">
                    {isUserLoading ? (
                      <div className="flex justify-center">
                        <div className="animate-pulse bg-white/20 rounded-lg h-12 w-48"></div>
                      </div>
                    ) : isLoggedInAndVerified ? (
                      <div className="flex justify-center">
                        {isAdmin ? (
                          <Link
                            to="/admin-dashboard"
                            className="w-full sm:w-auto"
                          >
                            <Button className="bg-white text-[#187339] hover:bg-white/90 w-full rounded-[6px] touch-button font-semibold shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base py-3 sm:py-6 px-6 sm:px-8 flex items-center justify-center gap-2">
                              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Go to Admin Dashboard</span>
                            </Button>
                          </Link>
                        ) : isStaff ? (
                          <Link to="/dashboard" className="w-full sm:w-auto">
                            <Button className="bg-white text-[#187339] hover:bg-white/90 w-full rounded-[6px] touch-button font-semibold shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base py-3 sm:py-6 px-6 sm:px-8 flex items-center justify-center gap-2">
                              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Go to My Dashboard</span>
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                        <Link to="/register" className="flex-1">
                          <Button
                            size="lg"
                            className="bg-white text-[#187339] hover:bg-white/90 w-full rounded-[6px] touch-button font-semibold shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base py-3 sm:py-6"
                          >
                            <span className="group-hover:scale-105 transition-transform inline-block">
                              Create Account Now
                            </span>
                          </Button>
                        </Link>
                        <Link to="/login" className="flex-1">
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/20 bg-transparent w-full rounded-[6px] touch-button font-semibold backdrop-blur-sm group text-sm sm:text-base py-3 sm:py-6"
                          >
                            <span className="group-hover:translate-x-1 transition-transform inline-block">
                              Sign In to Dashboard →
                            </span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Additional Info for Non-logged in Users */}
                  {!isLoggedInAndVerified && !isUserLoading && (
                    <p className="text-white/80 text-xs sm:text-sm mt-4 sm:mt-6 text-center animate-fade-in-up delay-300">
                      Register now to access your professional staff profile and
                      management tools
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>

        {/* Footer - Special Background Design */}
        {/* Footer - Premium Special Design */}
        <footer className="relative overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated 3D Grid */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(45deg, #0d5a27 1px, transparent 1px),
                          linear-gradient(-45deg, #0d5a27 1px, transparent 1px),
                          linear-gradient(45deg, #187339 2px, transparent 2px)`,
                  backgroundSize: "60px 60px, 60px 60px, 120px 120px",
                  animation: "wave 40s linear infinite",
                }}
              ></div>
            </div>

            {/* Floating 3D Cubes */}
            <div className="absolute top-1/4 left-10 w-16 h-16 opacity-10 animate-float">
              <div className="w-full h-full transform rotate-45 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-2xl"></div>
            </div>

            <div className="absolute bottom-1/3 right-20 w-12 h-12 opacity-10 animate-float delay-300">
              <div className="w-full h-full transform rotate-12 bg-gradient-to-tr from-[#187339] to-emerald-500 rounded-lg shadow-xl"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-10 left-1/4 w-24 h-24 bg-emerald-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-1/3 w-32 h-32 bg-[#187339]/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

            {/* Shimmering Lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent animate-pulse-slow delay-500"></div>
          </div>

          {/* Premium Footer Content */}
          <div className="relative z-10 bg-gradient-to-b from-[#0d5a27] via-[#187339] to-emerald-900">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>

            {/* Animated Corner Accents */}
            <div className="absolute top-0 left-0 w-48 h-48">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent rounded-br-full border-r-2 border-b-2 border-emerald-300/20"></div>
              <div className="absolute top-4 left-4 w-6 h-6 bg-emerald-300/10 rounded-full animate-ping"></div>
            </div>

            <div className="absolute bottom-0 right-0 w-48 h-48">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-400/10 via-transparent to-transparent rounded-tl-full border-l-2 border-t-2 border-emerald-300/20"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 bg-emerald-300/10 rounded-full animate-ping delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              {/* Enhanced Footer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">
                {/* Enhanced Logo Column */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
                            alt="Logo"
                            className="w-10 h-10"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          NG
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          FMWUD
                        </h3>
                        <p className="text-emerald-100/70 text-sm font-medium">
                          Staff Database System
                        </p>
                      </div>
                    </div>

                    <p className="text-emerald-100/80 text-sm leading-relaxed pl-2 border-l-2 border-emerald-400/30">
                      Official staff management portal for the Federal Ministry
                      of Works and Urban Development, Nigeria. Building the
                      future through excellence in public service.
                    </p>
                  </div>
                </div>

                {/* Enhanced Quick Links */}
                <div className="animate-fade-in-up delay-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <h5 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Quick Links</span>
                    </h5>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { label: "Staff Login", path: "/login" },
                      {
                        label: "New Registration",
                        path: "/register",
                      },
                      { label: "Help Center", path: "#" },
                      { label: "FAQs", path: "#" },
                    ].map((link, idx) => (
                      <li key={idx} className="group">
                        <Link
                          to={link.path}
                          className="flex items-center gap-3 text-emerald-100/80 hover:text-white transition-all duration-300 group-hover:translate-x-2"
                        >
                          <span className="text-sm font-medium relative">
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enhanced Resources */}
                <div className="animate-fade-in-up delay-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse delay-300"></div>
                    <h5 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Resources</span>
                    </h5>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { label: "Documentation" },
                      { label: "Training Materials" },
                      { label: "Policy Updates" },
                      { label: "Annual Reports" },
                    ].map((resource, idx) => (
                      <li key={idx} className="group">
                        <a
                          href="#"
                          className="flex items-center gap-3 text-emerald-100/80 hover:text-white transition-all duration-300 group-hover:translate-x-2"
                        >
                          <span className="text-sm font-medium relative">
                            {resource.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enhanced Contact Info */}
                <div className="animate-fade-in-up delay-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse delay-500"></div>
                    <h5 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Contact Us</span>
                    </h5>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 group">
                      <Building2 className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-emerald-100/80 text-sm font-medium">
                          Federal Secretariat Complex
                        </p>
                        <p className="text-emerald-100/60 text-xs">
                          Phase 1, Abuja, Nigeria
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <svg
                        className="w-5 h-5 text-emerald-300 flex-shrink-0 group-hover:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      <a
                        href="mailto:support@fmwud.gov.ng"
                        className="text-emerald-100/80 hover:text-white text-sm font-medium transition-colors"
                      >
                        support@fmwud.gov.ng
                      </a>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <svg
                        className="w-5 h-5 text-emerald-300 flex-shrink-0 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a
                        href="tel:+2348030000000"
                        className="text-emerald-100/80 hover:text-white text-sm font-medium transition-colors"
                      >
                        +234 (0) 803 000 0000
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Animated Divider */}
              <div className="relative my-10 sm:my-12">
                <div className=" inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
              </div>

              {/* Enhanced Bottom Footer */}
              <div className="flex flex-col lg:flex-row justify-center items-center gap-6 ">
                <div className="text-center lg:text-left">
                  <p className="text-emerald-100/70 text-sm">
                    &copy; {new Date().getFullYear()} Federal Ministry of Works
                    & Urban Development, Nigeria.
                  </p>
                  <p className="text-emerald-100/50 text-xs mt-2">
                    All rights reserved. Official Government Portal of the
                    Federal Republic of Nigeria.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-300/30 rounded-full animate-float pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
