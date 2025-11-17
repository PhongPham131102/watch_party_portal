import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { APP_ROUTES } from "@/constants";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken || !user) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default ProtectedRoute;
