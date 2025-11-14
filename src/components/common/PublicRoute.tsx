import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@/constants";

/**
 * Guard cho public routes (login, register)
 * Nếu đã login thì redirect về home
 */
export function PublicRoute({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken, user, loading } = useAppSelector((state) => state.auth);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    // Chỉ verify 1 lần khi mount và có token nhưng chưa có user
    if (accessToken && !user && !hasVerified) {
      setHasVerified(true);
      dispatch(getCurrentUser());
    }
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  // Đang verify token lần đầu
  if (accessToken && !user && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  // Đã login (có user) -> redirect home
  if (user) return <Navigate to={APP_ROUTES.HOME} replace />;

  // Chưa login -> show public page
  return <>{children}</>;
}
