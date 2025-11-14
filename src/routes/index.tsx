import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { APP_ROUTES } from "@/constants";
import { ProtectedRoute, PublicRoute } from "@/components/common";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - Chỉ cho người chưa đăng nhập */}
      <Route
        path={APP_ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes - Chỉ cho người đã đăng nhập */}
      <Route
        path={APP_ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Fallback route - Redirect về home */}
      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  );
}
