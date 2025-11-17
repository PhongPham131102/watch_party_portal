import { Navigate, useLocation } from "react-router-dom";
import { usePermission } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import type { RBACActionType, RBACModuleType } from "@/types";
import type React from "react";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  module: RBACModuleType;
  action?: RBACActionType;
  fallbackPath?: string;
}

function RoleBasedRoute({ 
  children, 
  module, 
  action = 'read',
  fallbackPath = APP_ROUTES.FORBIDDEN 
}: RoleBasedRouteProps) {
  const { can } = usePermission();
  const location = useLocation();

  if (!can(action, module)) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          from: location,
          reason: 'insufficient_permissions',
          required: { module, action }
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}

export default RoleBasedRoute;
