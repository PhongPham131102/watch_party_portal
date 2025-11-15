import { usePermission } from "@/hooks";
import type { RBACActionType, RBACModuleType } from "@/types";

interface PermissionGuardProps {
  children: React.ReactNode;
  module: RBACModuleType;
  action: RBACActionType;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  module,
  action,
  fallback = null,
}: PermissionGuardProps) {
  const { can } = usePermission();

  if (!can(action, module)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
