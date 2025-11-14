import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { APP_ROUTES } from "@/constants";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute Component
 * 
 * Bảo vệ các route chỉ dành cho người dùng CHƯA đăng nhập (login, register).
 * Nếu đã đăng nhập, redirect về trang home hoặc trang trước đó.
 * 
 * Check authentication bằng cách:
 * 1. Kiểm tra accessToken trong localStorage (persistent across tabs/reload)
 * 2. Kiểm tra user trong Redux (đã được load bởi AuthProvider)
 * 
 * @example
 * <Route 
 *   path="/dang-nhap" 
 *   element={
 *     <PublicRoute>
 *       <Login />
 *     </PublicRoute>
 *   } 
 * />
 */
function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  // Check accessToken from localStorage (persistent)
  const accessToken = localStorage.getItem("accessToken");

  // Get the page user was trying to access before being redirected to login
  const from = (location.state as any)?.from?.pathname || APP_ROUTES.HOME;

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

  // Đã đăng nhập (có token và có user) -> redirect về trang home hoặc trang trước đó
  if (accessToken && user) {
    return <Navigate to={from} replace />;
  }

  // Chưa đăng nhập -> cho phép truy cập trang public (login, register)
  return <>{children}</>;
}

export default PublicRoute;
