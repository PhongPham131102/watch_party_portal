import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { APP_ROUTES } from "@/constants";

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const from = (location.state as any)?.from?.pathname || APP_ROUTES.HOME;

  if (accessToken && user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
