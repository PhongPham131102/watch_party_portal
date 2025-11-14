import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that initializes authentication state
 * on app load by checking for existing accessToken and attempting
 * to fetch current user data.
 * 
 * Flow:
 * 1. Check if accessToken exists in localStorage
 * 2. If yes and no user in Redux → fetch user data
 * 3. If accessToken is expired → apiClient will auto-refresh using httpOnly cookie
 * 4. Once initialized, render children
 * 
 * This ensures user data is always available after page reload/new tab.
 */
function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      // Có token nhưng chưa có user → fetch user data
      if (token && !user) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to get current user:", error);
          // Token invalid or expired, will be handled by apiClient interceptor
        }
      }
      
      // Mark as initialized
      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch, user]);

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
