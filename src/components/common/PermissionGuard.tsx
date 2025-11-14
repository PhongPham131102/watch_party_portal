import { usePermission } from "@/hooks";
import type { RBACActionType, RBACModuleType } from "@/types";

interface PermissionGuardProps {
  children: React.ReactNode;
  module: RBACModuleType;
  action: RBACActionType;
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard Component
 * 
 * Ẩn/hiện các phần UI dựa trên permission.
 * Sử dụng cho buttons, tabs, sections, etc.
 * 
 * Alias cho Can component của CASL với type-safe props.
 * Nếu muốn sử dụng trực tiếp CASL, dùng:
 * <Can I="create" a="users">...</Can>
 * 
 * @example
 * <PermissionGuard module="users" action="create">
 *   <Button>Tạo người dùng</Button>
 * </PermissionGuard>
 * 
 * @example
 * <PermissionGuard 
 *   module="movies" 
 *   action="delete"
 *   fallback={<span>Bạn không có quyền xóa</span>}
 * >
 *   <Button variant="destructive">Xóa phim</Button>
 * </PermissionGuard>
 */
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
