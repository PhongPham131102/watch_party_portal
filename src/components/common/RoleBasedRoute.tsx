import { Navigate, useLocation } from "react-router-dom";
import { usePermission } from "@/hooks";
import { APP_ROUTES } from "@/constants";
import type { RBACActionType, RBACModuleType } from "@/types";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  module: RBACModuleType;
  action?: RBACActionType; // Default: 'read'
  fallbackPath?: string; // Default: APP_ROUTES.HOME
}

/**
 * RoleBasedRoute Component
 * 
 * Bảo vệ route dựa trên RBAC permissions.
 * Chỉ cho phép truy cập nếu user có quyền thực hiện action trên module.
 * 
 * @example
 * // Chỉ cho user có quyền 'read' trên 'users' vào
 * <Route 
 *   path="/users" 
 *   element={
 *     <RoleBasedRoute module="users" action="read">
 *       <UserList />
 *     </RoleBasedRoute>
 *   } 
 * />
 * 
 * @example
 * // Chỉ cho user có quyền 'create' trên 'movies' vào
 * <Route 
 *   path="/movies/create" 
 *   element={
 *     <RoleBasedRoute module="movies" action="create">
 *       <CreateMovie />
 *     </RoleBasedRoute>
 *   } 
 * />
 */
function RoleBasedRoute({ 
  children, 
  module, 
  action = 'read',
  fallbackPath = APP_ROUTES.FORBIDDEN 
}: RoleBasedRouteProps) {
  const { can } = usePermission();
  const location = useLocation();

  // Check if user has permission
  if (!can(action, module)) {
    // Redirect to forbidden page or custom fallback
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

  // User has permission -> allow access
  return <>{children}</>;
}

export default RoleBasedRoute;
