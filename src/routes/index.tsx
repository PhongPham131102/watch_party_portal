import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { APP_ROUTES } from "@/constants";
import { ProtectedRoute, PublicRoute } from "@/components/common";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={APP_ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path={APP_ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
    </Routes>
  );
}
