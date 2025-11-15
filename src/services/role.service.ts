import apiClient from "./apiClient";
import { API_BASE_URL } from "@/constants";

export interface RolePermissions {
  [module: string]: string[];
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  permissions: RolePermissions;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  displayName?: string;
  description?: string;
  isDefault?: boolean;
  permissions?: RolePermissions;
}

export interface UpdateRoleDto {
  name?: string;
  displayName?: string;
  description?: string;
  isDefault?: boolean;
  isActive?: boolean;
  permissions?: RolePermissions;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const roleService = {
  getRoles: async () => {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      `${API_BASE_URL}/roles`
    );
    return response.data;
  },

  getRoleById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Role>>(
      `${API_BASE_URL}/roles/${id}`
    );
    return response.data;
  },

  createRole: async (data: CreateRoleDto) => {
    const response = await apiClient.post<ApiResponse<Role>>(
      `${API_BASE_URL}/roles`,
      data
    );
    return response.data;
  },

  updateRole: async (id: string, data: UpdateRoleDto) => {
    const response = await apiClient.patch<ApiResponse<Role>>(
      `${API_BASE_URL}/roles/${id}`,
      data
    );
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_BASE_URL}/roles/${id}`
    );
    return response.data;
  },

  seedDefaultRoles: async () => {
    const response = await apiClient.post<ApiResponse<null>>(
      `${API_BASE_URL}/roles/seed`
    );
    return response.data;
  },
};
