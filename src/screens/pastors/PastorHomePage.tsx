import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  Calendar,
  MapPin,
  Heart,
  Phone,
  Mail,
  User,
  Church,
  CalendarDays,
  MapPinned,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Get user initials
const getUserInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${
    lastName?.charAt(0) || ""
  }`.toUpperCase();
};

export default function WelcomeDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  if (!user?.user) return null;

  const userData = user.user;
  const fullName = `${userData.firstName} ${userData.lastName}`;
  const initials = getUserInitials(userData.firstName, userData.lastName);
  const joinDate = new Date(userData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      {/* Animated Background Elements */}
      {/* Define animations early */}
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .waving-hand {
          animation: wave 2s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
        /* Optional: define float animation for church icons if missing */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 px-0 sm:px-4 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between  lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-50 animate-pulse" />
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-xl relative">
                <AvatarImage src={userData.avatar?.url} alt={fullName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-3xl bg-[#1969fe] font-bold bg-clip-text text-transparent">
                {greeting}, {userData.firstName}!{" "}
                <span className="waving-hand">👋</span>
              </h1>

              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                {format(currentTime, "EEEE, MMMM do, yyyy")} •{" "}
                {format(currentTime, "h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-[#1969fe] hover:bg-blue-700 text-white w-full flex hover:text-white rounded-[6px] shadow-lg shadow-blue-500/30"
              onClick={() => navigate("/pastors-dashboard/profile")}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Meetings & Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm rounded-[6px] border-blue-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="text-2xl font-bold text-blue-700 capitalize">
                        {userData.role}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Department: {userData.department}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Church className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm rounded-[6px] border-blue-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Years of Service
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {new Date().getFullYear() -
                          new Date(userData.year_of_employment).getFullYear()}
                        +
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined {joinDate}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarDays className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm rounded-[6px] border-blue-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Church Branch
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {userData.church_branch || "Not Assigned"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {userData.state_of_origin}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Profile Info & Announcements */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-t-[6px] border-blue-100 overflow-hidden">
              <CardHeader className="bg-[#1969fe] text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">{userData.email}</span>
                    {userData.isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                      {userData.phone_Number || "Not provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPinned className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                      {userData.address}, {userData.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 capitalize">
                      {userData.marital_status}
                    </span>
                  </div>

                  {userData.bio && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
                        "{userData.bio}"
                      </p>
                    </div>
                  )}

                  {userData.cv_link && (
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-blue-200 hover:bg-blue-50 rounded-[6px]"
                      onClick={() => window.open(userData.cv_link, "_blank")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View CV/Resume
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
