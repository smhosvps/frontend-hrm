/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  IdCard,
  Shield,
  Clock,
  ChevronLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Hash,
  Globe,
  Home,
  Users,
  Award,
  Activity,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetUserDetailsFcmQuery,
  useUpdateUserFcmMutation,
} from "@/redux/features/user/userApi";

const WORK_LOCATIONS = [
  "Headquarters - Abuja",
  "Lagos Regional Office",
  "Port Harcourt Office",
  "Kano Regional Office",
  "Enugu Regional Office",
  "Ibadan Office",
  "Kaduna Office",
  "Maiduguri Office",
  "Owerri Office",
  "Calabar Office",
  "Field Operation",
  "Remote Work",
];

const DEPARTMENTS = [
  "Administration",
  "Finance & Accounts",
  "Human Resources",
  "Operations",
  "Planning & Design",
  "Construction",
  "Maintenance",
  "Urban Development",
  "Research & Development",
  "IT & Systems",
];

const DESIGNATIONS = [
  "Director",
  "Deputy Director",
  "Senior Manager",
  "Manager",
  "Supervisor",
  "Officer",
  "Junior Officer",
  "Support Staff",
  "Consultant",
  "Coordinator",
];

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUserDetailsFcmQuery(id!);
  const [updateUser, { isLoading: updating }] = useUpdateUserFcmMutation();

  const [formData, setFormData] = useState({
    role: "",
    reason_for_rejection: "",
    currentEmploymentStatus: "",
    is_approved: "",
    status: "",
    designation: "",
    department_or_station: "",
    currentEmploymentLocation: "",
    year_of_retirement: "",
  });

  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setFormData({
        role: user.role || "",
        reason_for_rejection: user.reason_for_rejection || "",
        currentEmploymentStatus: user.currentEmploymentStatus || "",
        is_approved: user.is_approved || "",
        status: user.status || "",
        designation: user.designation || "",
        department_or_station: user.department_or_station || "",
        currentEmploymentLocation: user.currentEmploymentLocation || "",
        year_of_retirement: user.year_of_retirement || "",
      });
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.is_approved === "rejected" &&
      !formData.reason_for_rejection.trim()
    ) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await updateUser({ id: id!, ...formData }).unwrap();
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        {/* Enhanced Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Geometric Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #187339 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, #187339 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
          
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/5 via-green-300/3 to-teal-200/4 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-green-300/4 via-emerald-200/3 to-teal-300/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-200/3 to-emerald-300/2 rounded-full blur-3xl animate-float-slow"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(90deg, transparent 95%, #10b981 100%),
                                linear-gradient(180deg, transparent 95%, #10b981 100%)`,
              backgroundSize: '30px 30px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `floatParticle ${15 + Math.random() * 15}s infinite ease-in-out ${Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Loader2 className="w-12 h-12 text-green-400 mx-auto" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-pulse">
              Loading User Details
            </h3>
            <p className="text-gray-500">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        {/* Enhanced Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #187339 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, #187339 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-red-200/3 via-rose-300/2 to-pink-200/4 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-orange-300/4 via-amber-200/3 to-yellow-300/5 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-96">
          <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              User Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-[6px] font-medium transition-all duration-200 group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #187339 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #187339 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/5 via-green-300/3 to-teal-200/4 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-green-300/4 via-emerald-200/3 to-teal-300/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-200/3 to-emerald-300/2 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, #10b981 100%),
                              linear-gradient(180deg, transparent 95%, #10b981 100%)`,
            backgroundSize: '30px 30px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${15 + Math.random() * 15}s infinite ease-in-out ${Math.random() * 5}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Light Beams */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-green-400/10 to-transparent transform -translate-x-1/2 animate-beam"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-beam-horizontal"></div>
      </div>


      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Glass Effect */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-xl border border-white/50 py-6">
          {/* Header Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-emerald-50/10 to-teal-50/5"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-200/10 to-emerald-200/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-green-200/5 to-emerald-200/3 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="group border-green-200 bg-white/80 hover:bg-green-50 hover:border-green-300 text-green-700 rounded-[6px] font-medium transition-all duration-200 shadow-sm hover:shadow backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Users
              </Button>
            </div>

            {/* User Header Info */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                  <span className="ml-3 text-xl text-emerald-600 font-medium">
                    ({user.staffId})
                  </span>
                </h1>
                <p className="text-lg text-emerald-700 font-medium mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {user.designation || "No designation"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[5px] border border-green-100 shadow-sm">
                    <Building className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.department_or_station || "No department"}
                    </span>
                  </div>
                  {user.currentEmploymentLocation && (
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[5px] border border-green-100 shadow-sm">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {user.currentEmploymentLocation}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              <div className="relative group">
                {user.avatar?.url ? (
                  <>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl cursor-pointer group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={user.avatar.url}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=10b981&color=fff&size=160`;
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white p-1.5 rounded-full shadow-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Glass Effect */}
        <div className="backdrop-blur-xl rounded-2xl border border-white/50 shadow-md md:p-">
          <Tabs defaultValue="admin" className="space-y-6">
            {/* Enhanced Tabs List */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-emerald-50/20 rounded-lg"></div>
              <TabsList className="relative grid grid-cols-3 max-w-md bg-white/80 backdrop-blur-sm border border-green-100">
                <TabsTrigger value="admin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white transition-all duration-200 rounded-[6px]">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Controls
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white transition-all duration-200 rounded-[6px]">
                  <User className="w-4 h-4 mr-2" />
                  User Details
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white transition-all duration-200 rounded-[6px]">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Admin Controls Tab */}
            <TabsContent value="admin">
              <form onSubmit={handleSubmit}>
                <Card className="border border-green-100/50 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
                      <Shield className="w-5 h-5 text-green-600" />
                      Admin Controls
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update user permissions, status, and approval settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Role */}
                      <div className="space-y-3">
                        <Label htmlFor="role" className="text-gray-700 font-medium">User Role</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => handleChange("role", value)}
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            <SelectItem value="staff" className="hover:bg-green-50 cursor-pointer">Staff</SelectItem>
                            <SelectItem value="admin" className="hover:bg-green-50 cursor-pointer">Admin</SelectItem>
                            <SelectItem value="Super Admin" className="hover:bg-green-50 cursor-pointer">
                              Super Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status */}
                      <div className="space-y-3">
                        <Label htmlFor="status" className="text-gray-700 font-medium">Account Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleChange("status", value)}
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            <SelectItem value="active" className="hover:bg-green-50 cursor-pointer">Active</SelectItem>
                            <SelectItem value="pending" className="hover:bg-green-50 cursor-pointer">Pending</SelectItem>
                            <SelectItem value="deleted" className="hover:bg-green-50 cursor-pointer">Deleted</SelectItem>
                            <SelectItem value="pending-deletion" className="hover:bg-green-50 cursor-pointer">
                              Pending Deletion
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Approval Status */}
                      <div className="space-y-3">
                        <Label htmlFor="is_approved" className="text-gray-700 font-medium">Approval Status</Label>
                        <Select
                          value={formData.is_approved}
                          onValueChange={(value) =>
                            handleChange("is_approved", value)
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select approval" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            <SelectItem value="approved" className="hover:bg-green-50 cursor-pointer">Approved</SelectItem>
                            <SelectItem value="pending" className="hover:bg-green-50 cursor-pointer">Pending</SelectItem>
                            <SelectItem value="rejected" className="hover:bg-green-50 cursor-pointer">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Current Employment Status */}
                      <div className="space-y-3">
                        <Label htmlFor="currentEmploymentStatus" className="text-gray-700 font-medium">
                          Employment Status
                        </Label>
                        <Select
                          value={formData.currentEmploymentStatus}
                          onValueChange={(value) =>
                            handleChange("currentEmploymentStatus", value)
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            <SelectItem value="alive" className="hover:bg-green-50 cursor-pointer">Alive</SelectItem>
                            <SelectItem value="retired" className="hover:bg-green-50 cursor-pointer">Retired</SelectItem>
                            <SelectItem value="deceased" className="hover:bg-green-50 cursor-pointer">Deceased</SelectItem>
                            <SelectItem value="suspended" className="hover:bg-green-50 cursor-pointer">Suspended</SelectItem>
                            <SelectItem value="terminated" className="hover:bg-green-50 cursor-pointer">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Designation */}
                      <div className="space-y-3">
                        <Label htmlFor="designation" className="text-gray-700 font-medium">Designation</Label>
                        <Select
                          value={formData.designation}
                          onValueChange={(value) =>
                            handleChange("designation", value)
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            {DESIGNATIONS.map((designation) => (
                              <SelectItem key={designation} value={designation} className="hover:bg-green-50 cursor-pointer">
                                {designation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Department */}
                      <div className="space-y-3">
                        <Label htmlFor="department_or_station" className="text-gray-700 font-medium">Department</Label>
                        <Select
                          value={formData.department_or_station}
                          onValueChange={(value) =>
                            handleChange("department_or_station", value)
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            {DEPARTMENTS.map((department) => (
                              <SelectItem key={department} value={department} className="hover:bg-green-50 cursor-pointer">
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Work Location */}
                      <div className="space-y-3">
                        <Label htmlFor="currentEmploymentLocation" className="text-gray-700 font-medium">
                          Work Location
                        </Label>
                        <Select
                          value={formData.currentEmploymentLocation}
                          onValueChange={(value) =>
                            handleChange("currentEmploymentLocation", value)
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border border-gray-200 bg-white focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 hover:border-green-300">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-lg">
                            {WORK_LOCATIONS.map((location) => (
                              <SelectItem key={location} value={location} className="hover:bg-green-50 cursor-pointer">
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Reason for Rejection */}
                    {formData.is_approved === "rejected" && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <Label
                          htmlFor="reason_for_rejection"
                          className="flex items-center gap-2 text-amber-600 font-medium"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Reason for Rejection *
                        </Label>
                        <Textarea
                          id="reason_for_rejection"
                          value={formData.reason_for_rejection}
                          onChange={(e) =>
                            handleChange("reason_for_rejection", e.target.value)
                          }
                          placeholder="Provide detailed reason for rejection..."
                          className="min-h-[100px] rounded-xl border border-amber-200 bg-amber-50/50 focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200"
                          required
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-gray-100 pt-6 bg-gray-50/50">
                    <div>
                      {user.is_approved === "approved" && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          User is currently approved
                        </div>
                      )}
                      {user.is_approved === "rejected" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          <XCircle className="w-4 h-4" />
                          User is currently rejected
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={updating}
                      className="bg-green-600  hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-[6px] px-6"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* User Details Tab */}
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <Card className="border border-green-100/50 rounded-xl shadow transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <User className="w-5 h-5 text-green-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {[
                      {
                        icon: User,
                        label: "Full Name",
                        value: `${user.firstName} ${user.middleName || ""} ${
                          user.lastName
                        }`.trim(),
                        color: "text-green-600",
                      },
                      { icon: Mail, label: "Email", value: user.email, color: "text-blue-600" },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: user.phoneNumber || "N/A",
                        color: "text-purple-600",
                      },
                      {
                        icon: Calendar,
                        label: "Date of Birth",
                        value: user.dateOfBirth || "N/A",
                        color: "text-amber-600",
                      },
                      {
                        icon: Users,
                        label: "Gender",
                        value: user.gender || "N/A",
                        color: "text-pink-600",
                      },
                      {
                        icon: MapPin,
                        label: "Address",
                        value: user.address || "N/A",
                        color: "text-indigo-600",
                      },
                      {
                        icon: Globe,
                        label: "State of Origin",
                        value: user.state_of_origin || "N/A",
                        color: "text-teal-600",
                      },
                      {
                        icon: Home,
                        label: "Local Government",
                        value: user.Local_of_origin || "N/A",
                        color: "text-emerald-600",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group hover:bg-gray-50/50 p-2 rounded-lg transition-colors duration-200">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color.replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform duration-200`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="font-medium text-gray-900 truncate" title={item.value}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Professional Info Card */}
                <Card className="border border-green-100/50 shadow rounded-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {[
                      { icon: IdCard, label: "Staff ID", value: user.staffId, color: "text-green-600" },
                      {
                        icon: Briefcase,
                        label: "Designation",
                        value: user.designation || "N/A",
                        color: "text-blue-600",
                      },
                      {
                        icon: Building,
                        label: "Department",
                        value: user.department_or_station || "N/A",
                        color: "text-purple-600",
                      },
                      {
                        icon: MapPin,
                        label: "Work Location",
                        value: user.currentEmploymentLocation || "N/A",
                        color: "text-amber-600",
                      },
                      {
                        icon: Shield,
                        label: "Current Status",
                        value: user.currentEmploymentStatus || "N/A",
                        color: "text-red-600",
                      },
                      {
                        icon: Calendar,
                        label: "Year of Appointment",
                        value: user.year_of_appointment || "N/A",
                        color: "text-teal-600",
                      },
                      {
                        icon: Calendar,
                        label: "Year of Retirement",
                        value: user.year_of_retirement || "N/A",
                        color: "text-indigo-600",
                      },
                      {
                        icon: Clock,
                        label: "Member Since",
                        value: formatDate(user.createdAt),
                        color: "text-emerald-600",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group hover:bg-gray-50/50 p-2 rounded-lg transition-colors duration-200">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color.replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform duration-200`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="font-medium text-gray-900 truncate" title={item.value}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Official Numbers Card */}
                <Card className="lg:col-span-2 border border-green-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Hash className="w-5 h-5 text-green-600" />
                      Official Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: "IPPS", value: user.ipps, icon: FileText, color: "bg-green-500" },
                        { label: "NIN", value: user.nin, icon: IdCard, color: "bg-blue-500" },
                        { label: "TIN", value: user.tin, icon: FileText, color: "bg-purple-500" },
                        { label: "NHF", value: user.nhf, icon: Shield, color: "bg-amber-500" },
                        { label: "NHI", value: user.nhi, icon: Shield, color: "bg-red-500" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-[5px] ${item.color} shadow-md`}>
                                <item.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{item.value || "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="border border-green-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Activity className="w-5 h-5 text-green-600" />
                    Account Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-[6px] shadow">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Account Created</p>
                          <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        Initial registration
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="p-2 bg-blue-500  rounded-[6px] shadow">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Last Updated</p>
                          <p className="text-sm text-gray-500">{formatDate(user.updatedAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Profile modification
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-[6px] shadow">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Verification Status</p>
                          <p className="text-sm text-gray-500">{user.isVerified ? "Verified" : "Pending"}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        user.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {user.isVerified ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-[6px] shadow">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Registration Source</p>
                          <p className="text-sm text-gray-500">{user.register_source || "N/A"}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-800 rounded-full truncate max-w-[100px]">
                        {user.register_device?.split(" ")[0] || "Unknown"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
   
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes float-shape-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(30px, -20px) rotate(120deg) scale(1.1); }
          66% { transform: translate(-20px, 30px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes float-shape-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 20px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.2); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -10px) scale(1.1); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.5); opacity: 0.8; }
          50% { transform: translateY(-40px) translateX(-10px) scale(1.2); opacity: 0.4; }
          75% { transform: translateY(-20px) translateX(20px) scale(0.8); opacity: 0.6; }
        }
        
        @keyframes beam {
          0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
          50% { opacity: 0.1; transform: translateX(-50%) scaleY(1); }
          100% { opacity: 0; transform: translateX(-50%) scaleY(0); }
        }
        
        @keyframes beam-horizontal {
          0% { opacity: 0; transform: translateY(-50%) scaleX(0); }
          50% { opacity: 0.1; transform: translateY(-50%) scaleX(1); }
          100% { opacity: 0; transform: translateY(-50%) scaleX(0); }
        }
        
        .animate-float-shape-1 {
          animation: float-shape-1 25s ease-in-out infinite;
        }
        
        .animate-float-shape-2 {
          animation: float-shape-2 30s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 35s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-beam {
          animation: beam 8s ease-in-out infinite;
        }
        
        .animate-beam-horizontal {
          animation: beam-horizontal 10s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Glass effect enhancement */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
               {/* Recent Activity Footer */}
        <div className="my-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Last updated: {formatDate(user?.updatedAt)} •
            <span className="text-green-600 font-medium ml-2">
              Ministry of Urban Development
            </span>
            {user?.register_source && (
              <span className="text-gray-400 text-xs ml-4">
                • Registered via: {user.register_source}
              </span>
            )}
          </p>
        </div>
    </div>
  );
}