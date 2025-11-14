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
      
      // Có token nhưng chưa có user → fetch user data (trường hợp reload page)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount

  // Show loading while initializing auth
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          {/* Loading Spinner */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>

          {/* Loading Text */}
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Đang tải...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
