import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { APP_ROUTES } from "@/constants";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Bảo vệ các route chỉ dành cho người dùng đã đăng nhập.
 * Nếu chưa đăng nhập, redirect về trang login.
 * Tự động bọc children trong DashboardLayout.
 * 
 * Check authentication bằng cách:
 * 1. Kiểm tra accessToken trong localStorage (persistent across tabs/reload)
 * 2. Kiểm tra user trong Redux (đã được load bởi AuthProvider)
 * 
 * @example
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // Check accessToken from localStorage (persistent)
  const accessToken = localStorage.getItem("accessToken");

  // Đang load thông tin user (AuthProvider đang fetch user data)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập (không có token hoặc không có user) -> redirect về login
  // Lưu location hiện tại để redirect về sau khi login
  if (!accessToken || !user) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Đã đăng nhập -> cho phép truy cập với DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default ProtectedRoute;
