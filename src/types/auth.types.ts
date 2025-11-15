export const RBACModule = {
  USERS: 'users',
  MOVIES: 'movies',
  ACTORS: 'actors',
  ROOMS: 'rooms',
  COMMENTS: 'comments',
  ROLES: 'roles',
} as const;

export const RBACAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

export type RBACModuleType = typeof RBACModule[keyof typeof RBACModule];
export type RBACActionType = typeof RBACAction[keyof typeof RBACAction];

export type Permissions = Record<string, string[]>;

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  permissions: Permissions;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  role: Role;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  role: string;
  permissions: Permissions;
  accessToken: string;
  // refreshToken is now in httpOnly cookie, not in response
}

export interface AuthState {
  user: User | null;
  role: string | null;
  permissions: Permissions;
  accessToken: string | null;
  // refreshToken is now in httpOnly cookie, removed from state
  loading: boolean;
  error: string | null;
}
