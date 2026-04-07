// export default IsNotLoginAuth;
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import Loader from "@/components/loader/Loader";

const IsNotLoginAuth: React.FC = () => {
  const { data: user, isLoading, isError } = useGetUserQuery();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return <Loader />; // Replace with your loading component
  }

  // Allow access if there's an error (assuming error means not authenticated) or no user
  if (isError || !user) {
    return <Outlet />;
  }

  // Determine proper redirect path based on user role
  let redirectPath = "/"; // Default to home page

  if (user?.user?.role === "pastor") {
    redirectPath = "/pastors-dashboard";
  } else if (user?.user?.role === "Super Admin") {
    redirectPath = "/dashboard";
  } else if (user?.user?.role === "admin staff") {
    redirectPath = "/dashboard-hr-admin";
  } else if (user?.user?.role === "operatives") {
    redirectPath = "/dashboard-operatives";
  } else if (user?.user?.role === "adhoc") {
    redirectPath = "/dashboard-adhoc";
  } else if (user?.user?.role === "operative admin") {
    redirectPath = "/dashboard-admin-posting";
  }
  return <Navigate to={redirectPath} state={{ from: location }} replace />;
};

export default IsNotLoginAuth;
