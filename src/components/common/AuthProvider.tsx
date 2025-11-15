import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCurrentUser } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (token && !user) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to get current user:", error);
        }
      }
      
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
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
