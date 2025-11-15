import { useAbility } from "@casl/react";
import { AbilityContext } from "@/lib/Can";
import { RBACAction, type RBACActionType, type RBACModuleType } from "@/types";

export const usePermission = () => {
  const ability = useAbility(AbilityContext);

  const can = (action: RBACActionType, subject: RBACModuleType): boolean => {
    return ability.can(action, subject);
  };

  const cannot = (action: RBACActionType, subject: RBACModuleType): boolean => {
    return ability.cannot(action, subject);
  };

  // Shorthand methods
  const canCreate = (subject: RBACModuleType) =>
    can(RBACAction.CREATE, subject);
  const canRead = (subject: RBACModuleType) => can(RBACAction.READ, subject);
  const canUpdate = (subject: RBACModuleType) =>
    can(RBACAction.UPDATE, subject);
  const canDelete = (subject: RBACModuleType) =>
    can(RBACAction.DELETE, subject);
  const canManage = (subject: RBACModuleType) =>
    can(RBACAction.MANAGE, subject);

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
