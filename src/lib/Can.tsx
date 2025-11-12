import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { createMongoAbility } from '@casl/ability';
import type { AppAbility } from './ability';

export const AbilityContext = createContext<AppAbility>(createMongoAbility());

export const Can = createContextualCan(AbilityContext.Consumer);
