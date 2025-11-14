import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { APP_ROUTES } from "@/constants";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={APP_ROUTES.LOGIN} element={<Login />} />

      {/* Protected routes */}
      <Route path={APP_ROUTES.HOME} element={<Home />} />

      {/* Fallback route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
