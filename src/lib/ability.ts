import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { MongoAbility } from '@casl/ability';
import type { Permissions, RBACActionType, RBACModuleType } from '@/types';

export type AppAbility = MongoAbility<[RBACActionType, RBACModuleType]>;

export function defineAbilityFor(permissions: Permissions): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!permissions || Object.keys(permissions).length === 0) {
    return build();
  }

  Object.entries(permissions).forEach(([module, actions]) => {
    if (!Array.isArray(actions)) return;

    actions.forEach((action) => {
      if (action === 'manage') {
        can('manage', module as RBACModuleType);
      } else {
        can(action as RBACActionType, module as RBACModuleType);
      }
    });
  });

  return build();
}
