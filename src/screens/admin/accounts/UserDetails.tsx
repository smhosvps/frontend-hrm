import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  Building,
  MapPinned,
  Shield,
  CheckCircle,
  XCircle,
  Briefcase,
  Heart,
  BookOpen,
  Link as LinkIcon,
  Globe,
  Users,
  Home,
  FileText,
} from "lucide-react";
import type React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: fetch, isLoading} = useGetUserByIdQuery(id);
  const navigate = useNavigate();

  console.log(fetch, "fetch");

  const [activeTab, setActiveTab] = useState("personal");

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!fetch?.user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center mx-auto">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">User Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Link to="/admin/users">Return to User Management</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = fetch.user;

  const getInitials = () => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoItem = ({
    label,
    value,
    icon: Icon,
    className = "",
  }: {
    label: string;
    value?: string | number | null;
    icon: React.ElementType;
    className?: string;
  }) =>
    value ? (
      <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-[6px] ${className}`}>
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium truncate">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4">
      <div className="">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit border-blue-200 text-blue-600 hover:bg-blue-50 rounded-[6px] text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <Button
              variant={activeTab === "personal" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("personal")}
              className={activeTab === "personal" ? "bg-blue-600" : "border-blue-200 text-blue-600"}
            >
              <User className="mr-2 h-4 w-4" />
              Personal
            </Button>
            <Button
              variant={activeTab === "work" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("work")}
              className={activeTab === "work" ? "bg-blue-600" : "border-blue-200 text-blue-600"}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Work
            </Button>
            <Button
              variant={activeTab === "location" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("location")}
              className={activeTab === "location" ? "bg-blue-600" : "border-blue-200 text-blue-600"}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card */}
          <Card className={`${activeTab === "personal" || window.innerWidth >= 1024 ? "block" : "hidden"} lg:block lg:col-span-1 border-blue-100`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                {user.avatar?.url ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md mb-4">
                    <img
                      src={user.avatar.url}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-4 border-4 border-blue-100">
                    <AvatarFallback className="text-xl sm:text-2xl bg-blue-100 text-blue-600">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <h2 className="text-lg sm:text-xl font-bold break-words">
                  {user.firstName} {user.middleName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">{user.email}</p>

                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize">
                    {user.role}
                  </Badge>
                  {user.isSuspended && (
                    <Badge variant="destructive">Suspended</Badge>
                  )}
                  {user.isAccountApproved ? (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      Pending Approval
                    </Badge>
                  )}
                </div>

                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm break-all">{user.email}</span>
                  </div>
                  {user.phone_Number && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{user.phone_Number}</span>
                    </div>
                  )}
                </div>

                <hr className="w-full border-t border-gray-200 my-4" />

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    <div className="flex items-center gap-1">
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium text-green-600">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs sm:text-sm font-medium text-red-600">
                            Not Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className={`${activeTab === "personal" || window.innerWidth >= 1024 ? "block" : "hidden"} lg:block lg:col-span-2 border-blue-100`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoItem label="First Name" value={user.firstName} icon={User} />
                <InfoItem label="Last Name" value={user.lastName} icon={User} />
                <InfoItem label="Middle Name" value={user.middleName} icon={User} />
                <InfoItem label="Email" value={user.email} icon={Mail} />
                <InfoItem label="Phone Number" value={user.phone_Number} icon={Phone} />
                <InfoItem label="Gender" value={user.gender} icon={Users} />
                <InfoItem label="Date of Birth" value={formatDate(user.dateOfBirth)} icon={Calendar} />
                <InfoItem label="Marital Status" value={user.marital_status} icon={Heart} />
                <InfoItem label="State of Origin" value={user.state_of_origin} icon={MapPin} />
                <InfoItem label="LGA" value={user.Local_of_origin} icon={MapPinned} />
                <InfoItem label="Nationality" value={user.country} icon={Globe} />
                <InfoItem label="Bio" value={user.bio} icon={BookOpen} className="col-span-2" />
              </div>
            </CardContent>
          </Card>

          {/* Work Information Card */}
          <Card className={`${activeTab === "work" || window.innerWidth >= 1024 ? "block" : "hidden"} lg:block lg:col-span-3 border-blue-100`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Work & Department
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <InfoItem label="Department" value={user.department} icon={Building} />
                <InfoItem label="Year of Employment" value={user.year_of_employment} icon={Calendar} />
                <InfoItem label="Church Branch" value={user.church_branch} icon={Home} />
                <InfoItem label="CV Link" value={user.cv_link} icon={LinkIcon} />
                <InfoItem label="Role" value={user.role} icon={Shield} />
                <InfoItem label="Register Source" value={user.register_source} icon={Globe} />
              </div>
            </CardContent>
          </Card>

          {/* Location & Address Card */}
          <Card className={`${activeTab === "location" || window.innerWidth >= 1024 ? "block" : "hidden"} lg:block lg:col-span-3 border-blue-100`}>
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Address & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <InfoItem label="Address" value={user.address} icon={Home} />
                <InfoItem label="City" value={user.city} icon={MapPin} />
                <InfoItem label="Country" value={user.country} icon={Globe} />
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics Card */}
          <Card className="lg:col-span-3 border-blue-100">
            <CardHeader className="pb-2 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">User ID</p>
                  <p className="font-mono text-xs sm:text-sm break-all">{user._id}</p>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Created At</p>
                  <p className="text-xs sm:text-sm">{formatDateTime(user.createdAt)}</p>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Last Updated</p>
                  <p className="text-xs sm:text-sm">{formatDateTime(user.updatedAt)}</p>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-600 mb-1">Register Device</p>
                  <p className="text-xs sm:text-sm break-words">{user.register_device || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}