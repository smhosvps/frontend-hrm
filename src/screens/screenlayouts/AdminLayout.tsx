
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Settings,
  User,
  // LayoutDashboard,
  // Users,
  // Truck,
  // Package,
  BarChart3,
  Shield,
  HelpCircle,
  LogOut,
  ChevronDown,
  Bell,
  Calendar,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../assets/footerlogo.png";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");

  console.log(activeSection)
  const location = useLocation();

  // Wrap menuItems in useMemo to prevent recreation on every render
  const menuItems = useMemo(() => [
    // {
    //   id: "overview",
    //   label: "Overview",
    //   mainSection: "MAIN MENU",
    //   icon: LayoutDashboard,
    //   section: "overview",
    //   link: "/admin/overview",
    //   submenu: null,
    // },
    // {
    //   id: "management",
    //   mainSection: "USER & ROLE MANAGEMENT",
    //   label: "Management",
    //   icon: Users,
    //   submenu: [
    //     {
    //       label: "Customers",
    //       section: "users",
    //       link: "/dashboard/manage-customer",
    //     },
    //     {
    //       label: "Delivery Partners",
    //       section: "users",
    //       link: "/dashboard/manage-partners",
    //     },
    //     { label: "Admin", section: "roles", link: "/dashboard/manage-admins" },
    //     {
    //       label: "Super Admin",
    //       section: "permissions",
    //       link: "/dashboard/manage-super-admins",
    //     },
    //   ],
    // },
    // {
    //   id: "operations",
    //   label: "Operations",
    //   mainSection: "OPERATION & LOGISTICS",
    //   icon: Truck,
    //   submenu: [
    //     {
    //       label: "Deliveries",
    //       section: "deliveries",
    //       link: "/admin/deliveries",
    //     },
    //     { label: "Drivers", section: "drivers", link: "/admin/drivers" },
    //     { label: "Routes", section: "routes", link: "/admin/routes" },
    //   ],
    // },
    // {
    //   id: "inventory",
    //   label: "Inventory",
    //   mainSection: "FINANCE & PAYMENT",
    //   icon: Package,
    //   submenu: [
    //     { label: "Delivery Options", section: "parcels", link: "/dashboard/manage-delivery-options" },
    //     {
    //       label: "Warehouses",
    //       section: "warehouses",
    //       link: "/admin/warehouses",
    //     },
    //     { label: "Stock", section: "stock", link: "/admin/stock" },
    //   ],
    // },
    {
      id: "users",
      label: "User Management",
      mainSection: "USER",
      icon: BarChart3,
      section: "users",
      link: "/dashboard/manage-user",
      submenu: null,
    },
    {
      id: "notifications",
      label: "Notifications",
      mainSection: "NOTIFICATION",
      icon: BarChart3,
      section: "notifications",
      link: "/dashboard/manage-notification",
      submenu: null,
    },
    {
      id: "schedule",
      label: "Schedule",
      mainSection: "SCHEDULE",
      icon: Calendar,
      section: "schedules",
      link: "/dashboard/manage-schedule",
      submenu: null,
    },
    {
      id: "zoom",
      label: "Zoom Meetings",
      mainSection: "ZOOM",
      icon: Calendar,
      section: "zoom",
      link: "/dashboard/zoom-meetings",
      submenu: null,
    },
    {
      id: "security",
      label: "Security",
      mainSection: "POLICIES",
      icon: Shield,
      submenu: [
        {
          label: "Manage Policy",
          section: "access-control",
          link: "/dashboard/manage-policy",
        },
        {
          label: "Manage FAQ",
          section: "access-control",
          link: "/dashboard/manage-faq",
        },
        {
          label: "Contact Us",
          section: "audit-log",
          link: "/dashboard/manage-contact-us",
        },
        {
          label: "Manage Report",
          section: "audit-log",
          link: "/dashboard/manage-report",
        },
        { label: "API Keys", section: "api-keys", link: "/admin/api-keys" },
      ],
    },
  ], []); // Empty dependency array since menuItems doesn't depend on any props/state

  // Wrap bottomItems in useMemo as well
  const bottomItems = useMemo(() => [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      section: "settings",
      link: "/admin/settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      section: "help",
      link: "/admin/help",
    },
    { id: "logout", label: "Logout", icon: LogOut, section: null, link: null },
  ], []); // Empty dependency array

  // Set active section and expand menu based on current path
  useEffect(() => {
    const path = location.pathname;

    // Find which menu item contains this path and expand it
    for (const item of menuItems) {
      if (item.submenu) {
        const foundSubItem = item.submenu.find((sub:any) => sub.link === path);
        if (foundSubItem) {
          setExpandedMenu(item.id);
          setActiveSection(foundSubItem.section);
          return;
        }
      } else if (item.link === path) {
        setActiveSection(item.section);
        return;
      }
    }

    // Check bottom items
    for (const item of bottomItems) {
      if (item.link === path) {
        setActiveSection(item.section || "");
        return;
      }
    }
  }, [location.pathname, menuItems, bottomItems]); // Now these dependencies are stable

  const toggleMenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

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

  // Get page title based on current path with full context
  const getPageTitle = useMemo(() => {
    return () => {
      // Check main menu items
      for (const item of menuItems) {
        if (item.link === location.pathname) {
          return `${item.mainSection} / ${item.label}`;
        }
        if (item.submenu) {
          const subItem = item.submenu.find(
            (sub:any) => sub.link === location.pathname
          );
          if (subItem) {
            return `${item.mainSection} / ${item.label} / ${subItem.label}`;
          }
        }
      }

      // Check bottom items
      const bottomItem = bottomItems.find(
        (item) => item.link === location.pathname
      );
      if (bottomItem) return bottomItem.label;

      // Default
      return "Dashboard";
    };
  }, [location.pathname, menuItems, bottomItems]);

  // Group menu items by mainSection for better organization
  const groupedMenuItems = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.mainSection]) {
        acc[item.mainSection] = [];
      }
      acc[item.mainSection].push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);
  }, [menuItems]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static z-30 flex flex-col`}
      >
        <div className="flex items-center justify-center p-4 border-b flex-shrink-0">
          <img
            src={logo}
            alt="Courries Admin"
            className=" rounded-2xl h-10 md:h-14 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Menu Items with proper overflow */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="p-4">
            {Object.entries(groupedMenuItems).map(([section, items]) => (
              <div key={section} className="mb-6">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => toggleMenu(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                              expandedMenu === item.id
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <item.icon size={18} className="flex-shrink-0" />
                              <span className="text-sm truncate">
                                {item.label}
                              </span>
                            </div>
                            <ChevronDown
                              size={16}
                              className={`flex-shrink-0 transition-transform ${
                                expandedMenu === item.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Submenu Items */}
                          {expandedMenu === item.id && (
                            <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-200 pl-2">
                              {item.submenu.map((subitem, index) => (
                                <Link
                                  key={index}
                                  to={subitem.link}
                                  onClick={() => {
                                    setActiveSection(subitem.section);
                                    setSidebarOpen(false);
                                  }}
                                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors truncate ${
                                    location.pathname === subitem.link
                                      ? "bg-blue-100 text-blue-600 font-medium"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                  title={subitem.label}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.link!}
                          onClick={() => {
                            setActiveSection(item.section!);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                            location.pathname === item.link
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          title={item.label}
                        >
                          <item.icon size={18} className="flex-shrink-0" />
                          <span className="text-sm truncate">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Items */}
        <div className="border-t flex-shrink-0">
          <nav className="p-4">
            <ul className="space-y-1">
              {bottomItems.map((item) => (
                <li key={item.id}>
                  {item.id === "logout" ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      title={item.label}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="text-sm truncate">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.link!}
                      onClick={() => {
                        setActiveSection(item.section!);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === item.link
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      title={item.label}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="text-sm truncate">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm flex-shrink-0">
          <div className="w-full px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden flex-shrink-0"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-700 hover:bg-gray-100 flex-shrink-0"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
                      <Avatar className="w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0">
                        <AvatarImage
                          src={user?.user?.avatar?.url || user?.avatar?.url}
                          alt={user?.user?.name || user?.name || "User"}
                        />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs lg:text-sm">
                          {user?.user?.name
                            ? user.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left min-w-0">
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 truncate">
                          {user?.user?.name || user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.user?.role || user?.role || "Admin"}
                        </div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white rounded-2xl"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f5ff]">
          <div className=" py-6 px-4">
            <Outlet />
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}