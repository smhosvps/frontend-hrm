import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Calendar,
  BellDot,
  UserRound,
  HomeIcon,
  LayoutDashboard,
  FileQuestion,
  SignpostBigIcon,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function OperativesLayout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Notifications
  const {
    data: notificationsData,
    refetch,
    isLoading,
  } = useGetUserNotificationsQuery();
  const [acknowledge] = useAcknowledgeNotificationMutation();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: HomeIcon, label: "Home", href: "/dashboard-operatives" },
    { icon: Calendar, label: "Events", href: "/dashboard-operatives/events" },
    {
      icon: UserCircle,
      label: "Meetings",
      href: "/dashboard-operatives/meeting-list",
    },
    {
      icon: BellDot,
      label: "Notifications",
      href: "/dashboard-operatives/notifications",
    },
    {
      icon: FileQuestion,
      label: "Queries",
      href: "/dashboard-operatives/queries",
    },
      {
      icon: SignpostBigIcon,
      label: "Posting",
      href: "/dashboard-operatives/posting",
    },
    {
      icon: UserRound,
      label: "My Profile",
      href: "/dashboard-operatives/profile",
    },
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
      refetch();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!mounted) {
    return null;
  }

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div
      className={`hidden md:flex h-full transition-all duration-300 ease-in-out flex-col bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-200/50 ${
          sidebarCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!sidebarCollapsed && (
          <Link to="/dashboard-operatives" className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              SMHOS HRM
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hover:bg-gray-100 rounded-lg"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
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
                        <div
                          className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-gray-900 text-white"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link to={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div
        className={`p-3 border-t border-gray-200/50 ${
          sidebarCollapsed ? "text-center" : ""
        }`}
      >
        {sidebarCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                <Avatar
                  className="h-10 w-10 cursor-pointer ring-2 ring-white shadow-lg hover:ring-blue-200 transition-all"
                  onClick={() => navigate("/dashboard-operatives/profile")}
                >
                  <AvatarImage src={user?.user?.avatar?.url} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    {user?.user?.firstName?.charAt(0) || (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white">
              {user?.user?.firstName} {user?.user?.lastName}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
            onClick={() => navigate("/dashboard-operatives/profile")}
          >
            <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg">
              <AvatarImage src={user?.user?.avatar?.url} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                {user?.user?.firstName?.charAt(0) || (
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
        )}
      </div>
    </div>
  );

  // Mobile Sidebar Component (using Sheet)
  const MobileSidebar = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              to="/dashboard-operatives"
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                SMHOS HRM
              </span>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                <AvatarImage src={user?.user?.avatar?.url} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  {user?.user?.firstName?.charAt(0) || (
                    <User className="h-5 w-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.user?.firstName} {user?.user?.lastName}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {user?.user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link to={item.href}>
                      <div
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <MobileSidebar />

                {/* Page Title */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {navItems.find((item) => item.href === location.pathname)
                    ?.label ||
                    (location.pathname.includes("meeting-list")
                      ? "Meetings"
                      : location.pathname.includes("events")
                      ? "Events"
                      : location.pathname.includes("notifications")
                      ? "Notifications"
                      : location.pathname.includes("profile")
                      ? "My Profile"
                      : "Dashboard")}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 rounded-lg"
                  onClick={() => setNotificationModalOpen(true)}
                >
                  <BellDot className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2 hover:bg-gray-100 rounded-lg"
                    >
                      <span className="hidden sm:inline text-sm font-medium text-gray-700">
                        {user?.user?.firstName}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.user?.avatar?.url}
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm">
                          {user?.user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <Link to="/dashboard-operatives/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Notification Modal */}
      <Dialog
        open={notificationModalOpen}
        onOpenChange={setNotificationModalOpen}
      >
        <DialogContent className="sm:max-w-[500px] rounded-lg max-h-[90vh] overflow-hidden bg-white">
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
              Please read and acknowledge important notifications.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <BellDot className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No notifications</p>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {notifications.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 rounded-lg border ${
                        item.status === "unread"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900">
                        {item.notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.notification.message}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(item.receivedAt).toLocaleString()}
                        </span>
                        {item.status === "unread" && (
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledge(item._id)}
                            className="bg-blue-600 hover:bg-blue-700 rounded-lg text-white w-full sm:w-auto"
                          >
                            Mark as Read
                          </Button>
                        )}
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
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
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
