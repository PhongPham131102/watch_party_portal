import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@/constants";

export function RequireAuth({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (accessToken && !user) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          // Token invalid, will redirect to login
        }
      }
      setIsVerifying(false);
    };

    verifyToken();
  }, [accessToken, user, dispatch]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
