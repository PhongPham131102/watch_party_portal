import { useEffect } from "react";
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
 * With httpOnly cookie authentication:
 * - AccessToken is stored in localStorage
 * - RefreshToken is stored in httpOnly cookie (managed by browser)
 * - If accessToken exists, try to get current user
 * - If accessToken is expired, apiClient will auto-refresh using the cookie
 */
function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { accessToken, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only try to fetch user if we have an accessToken but no user data
    if (accessToken && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, accessToken, user, loading]);

  return <>{children}</>;
}

export default AuthProvider;
