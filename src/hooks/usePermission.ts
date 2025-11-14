import { useAbility } from "@casl/react";
import { AbilityContext } from "@/lib/Can";
import type { RBACActionType, RBACModuleType } from "@/types";

/**
 * Hook để check permission sử dụng CASL ability
 * Wrapper around useAbility từ @casl/react với type-safe shortcuts
 * 
 * @example
 * const { can } = usePermission();
 * 
 * if (can('create', 'users')) {
 *   // Show create button
 * }
 * 
 * if (can('delete', 'movies')) {
 *   // Show delete button
 * }
 */
export const usePermission = () => {
  // Sử dụng useAbility từ CASL - đây là cách chuẩn
  const ability = useAbility(AbilityContext);

  const can = (action: RBACActionType, subject: RBACModuleType): boolean => {
    return ability.can(action, subject);
  };

  const cannot = (action: RBACActionType, subject: RBACModuleType): boolean => {
    return ability.cannot(action, subject);
  };

  // Shorthand methods
  const canCreate = (subject: RBACModuleType) => can('create', subject);
  const canRead = (subject: RBACModuleType) => can('read', subject);
  const canUpdate = (subject: RBACModuleType) => can('update', subject);
  const canDelete = (subject: RBACModuleType) => can('delete', subject);
  const canManage = (subject: RBACModuleType) => can('manage', subject);

  return {
    ability,
    can,
    cannot,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage,
  };
};
