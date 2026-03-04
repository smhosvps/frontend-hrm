import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Settings,
  User,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Calendar,
  BellDot,
  UserRound,
  HomeIcon,
} from "lucide-react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useLogoutMutation } from "@/redux/api/apiSlice";
import { clearCredentials } from "@/redux/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  useGetUserNotificationsQuery,
  useAcknowledgeNotificationMutation,
} from "@/redux/features/notificationsApi/notificationsApi";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function PastorLayout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const location = useLocation();

  // Notifications
  const { data: notificationsData, refetch, isLoading } = useGetUserNotificationsQuery();
  const [acknowledge] = useAcknowledgeNotificationMutation();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: HomeIcon, label: "Home", href: "/pastors-dashboard" },
    { icon: Calendar, label: "Events", href: "/pastors-dashboard/events" },
    { icon: UserCircle, label: "Meeting", href: "/pastors-dashboard/meeting-list" },
    { icon: BellDot, label: "Notification", href: "/pastors-dashboard/notifications" },
    { icon: UserRound, label: "My Profile", href: "/pastors-dashboard/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const handleAcknowledge = async (receiptId: string) => {
    try {
      await acknowledge({ receiptId, userId: user?.user?._id }).unwrap();
      refetch(); // Refresh list
    } catch (err) {
      console.error("Failed to acknowledge", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => n.status === "unread");
    for (const n of unread) {
      await handleAcknowledge(n._id);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar with Special Background */}
        <div
          className={`bg-white/95 backdrop-blur-xl fixed md:static h-full transition-all duration-300 ease-in-out z-30 flex flex-col border-r border-white/20 shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}
        >
          {/* Sidebar Special Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/30 to-indigo-200/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl" />
            
            {/* Stained Glass Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 40%, #3b82f6 0px, transparent 20%),
                                   radial-gradient(circle at 70% 60%, #6366f1 0px, transparent 25%),
                                   repeating-linear-gradient(45deg, transparent 0px, transparent 20px, rgba(59, 130, 246, 0.1) 20px, rgba(59, 130, 246, 0.1) 40px)`,
                }}
              />
            </div>
            
            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-400/30 rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse delay-700" />
          </div>

          {/* Sidebar Header */}
          <div
            className={`relative flex items-center justify-between p-4 border-b border-white/20 ${
              sidebarCollapsed ? "md:justify-center" : ""
            }`}
          >
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-blue-600 hover:bg-blue-700 bg-clip-text text-transparent truncate">
                  SMHOS HRM
                </h1>
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Collapse Toggle - Desktop Only */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex hover:bg-white/50 backdrop-blur-sm rounded-lg"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-blue-600" />
                )}
              </Button>
              {/* Close Button - Mobile Only */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden hover:bg-white/50 backdrop-blur-sm rounded-lg"
              >
                <X className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>

          {/* Navigation with Fluid Design */}
          <nav className="relative flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 hover:scrollbar-thumb-blue-400 z-40">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    {sidebarCollapsed ? (
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link to={item.href}>
                            <div className={`relative group`}>
                              {/* Fluid Background Effect */}
                              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-md ${
                                isActive ? "opacity-20" : ""
                              }`} />
                              <Button
                                variant="ghost"
                                className={`relative w-full justify-center p-3 rounded-xl transition-all duration-300 ${
                                  isActive
                                    ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 border border-blue-200/50 shadow-lg shadow-blue-500/10"
                                    : "hover:bg-white/50 backdrop-blur-sm hover:shadow-md"
                                }`}
                              >
                                <Icon
                                  className={`h-5 w-5 transition-all duration-300 ${
                                    isActive 
                                      ? "text-blue-600 scale-110" 
                                      : "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                                  }`}
                                />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl z-50"
                        >
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link to={item.href}>
                        <div className="relative group">
                          {/* Fluid Background Effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-md ${
                            isActive ? "opacity-20" : ""
                          }`} />
                          <Button
                            variant="ghost"
                            className={`relative w-full justify-start px-3 py-2 rounded-xl transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 border border-blue-200/50 shadow-lg shadow-blue-500/10"
                                : "hover:bg-white/50 backdrop-blur-sm hover:shadow-md"
                            }`}
                          >
                            <Icon
                              className={`mr-3 h-5 w-5 transition-all duration-300 ${
                                isActive 
                                  ? "text-blue-600 scale-110" 
                                  : "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                              }`}
                            />
                            <span className={`text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? "text-blue-700" 
                                : "text-gray-700 group-hover:text-blue-700"
                            }`}>
                              {item.label}
                            </span>
                            
                            {/* Active Indicator */}
                            {isActive && (
                              <div className="absolute right-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                            )}
                          </Button>
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer - User Info with Special Background */}
          <div className="relative border-t border-white/20 p-3 z-40">
            {sidebarCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[#1969fe] rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 blur-md" />
                      <Avatar
                        className="h-10 w-10 cursor-pointer ring-2 ring-white shadow-lg transition-transform group-hover:scale-110"
                        onClick={() => navigate("/pastors-dashboard/profile")}
                      >
                        <AvatarImage
                          src={
                            user?.user?.avatar?.url ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                          {user?.user?.firstName?.charAt(0) || (
                            <User className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-[#1969fe] text-white border-0 shadow-xl z-50"
                >
                  {user?.user?.fristName}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-[#1969fe] rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300 blur-md" />
                <div 
                  className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
                  onClick={() => navigate("/pastors-dashboard/profile")}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg transition-transform group-hover:scale-110">
                    <AvatarImage
                      src={
                        user?.user?.avatar?.url ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-[#1969fe] text-white">
                      {user?.user?.name?.charAt(0) || (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.user?.firstName} {user?.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate capitalize">
                      {user?.user?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Special Designed Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Geometric Pattern */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className={`absolute top-1/4 -left-8 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/20 blur-3xl transition-all duration-1000 ${
                  mounted
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-20 opacity-0"
                }`}
              />
              <div
                className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-200/20 to-purple-200/20 blur-3xl transition-all duration-1000 delay-300 ${
                  mounted
                    ? "translate-x-0 opacity-100"
                    : "translate-x-20 opacity-0"
                }`}
              />
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/10 to-indigo-100/10 blur-3xl transition-all duration-1000 delay-500 ${
                  mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              />
            </div>

            {/* Stained Glass Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, #3b82f6 0px, transparent 15%),
                                   radial-gradient(circle at 80% 70%, #6366f1 0px, transparent 20%),
                                   repeating-linear-gradient(45deg, transparent 0px, transparent 25px, rgba(59, 130, 246, 0.05) 25px, rgba(59, 130, 246, 0.05) 50px)`,
                }}
              />
            </div>

            {/* Floating Church Icons */}
            <div
              className={`absolute top-20 left-12 text-blue-300/20 transition-all duration-700 delay-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
            </div>
            <div
              className={`absolute top-40 right-20 text-indigo-300/20 transition-all duration-700 delay-900 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >

            </div>
            <div
              className={`absolute bottom-32 left-24 text-purple-300/20 transition-all duration-700 delay-1100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
            </div>
            <div
              className={`absolute bottom-40 right-28 text-blue-300/20 transition-all duration-700 delay-1300 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
            </div>

            {/* Animated Particles */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-indigo-400/30 rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-pink-400/30 rounded-full animate-pulse delay-1000" />
          </div>

          {/* Header */}
          <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 top-0 z-10 relative">
            <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden hover:bg-white/50 backdrop-blur-sm rounded-lg"
                >
                  <Menu className="h-5 w-5 text-blue-600" />
                </Button>
                <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  {navItems.find((item) => item.href === location.pathname)
                    ?.label || "Pastor Dashboard"}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/50 backdrop-blur-sm rounded-lg"
                  onClick={() => setNotificationModalOpen(true)}
                >
                  <BellDot className="h-5 w-5 text-red-600" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs text-red-500"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2 hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 group"
                      >
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {user?.user?.fristName}
                        </span>
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-white shadow-lg transition-transform group-hover:scale-110">
                          <AvatarImage
                            src={
                              user?.user?.avatar?.url ||
                              "/placeholder.svg?height=96&width=96"
                            }
                            alt="Profile"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                            {user?.user?.name?.charAt(0) || (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 mt-2 z-50 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl"
                    >
                      <div className="px-2 py-1.5 text-sm font-medium text-gray-500 sm:hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                        {user?.user?.fristName}
                      </div>
                      <Link to="/pastors-dashboard/profile">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                          <Settings className="mr-2 h-4 w-4 text-blue-600" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/sign-in">
                    <Button
                      variant="ghost"
                      className="hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 group"
                    >
                      <span className="group-hover:text-blue-600 transition-colors">
                        Login/Signup
                      </span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area with Fluid Design */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-sky-50/50 backdrop-blur-sm" />
            <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
              <div
                className={`transition-all duration-300 transform ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Fluid Design Elements */}
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-2xl" />
                  
                  {/* Content */}
                  <div className="relative">
                    <Outlet />
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Notification Modal */}
      <Dialog open={notificationModalOpen} onOpenChange={setNotificationModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl rounded-[10px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BellDot className="text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Please read and acknowledge important notifications to avoid penalties.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : unreadCount === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <BellDot className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No unread notifications</p>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.status === "unread")
                    .map((item) => (
                      <div
                        key={item._id}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {item.notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.notification.message}
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            Received: {new Date(item.receivedAt).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledge(item._id)}
                            className="bg-blue-600 hover:bg-blue-700 rounded-[6px] text-white"
                          >
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              {unreadCount > 1 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleMarkAllRead}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Mark All as Read
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}