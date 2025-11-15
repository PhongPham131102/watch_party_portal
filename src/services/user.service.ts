import apiClient from "./apiClient";
import { API_BASE_URL } from "@/constants";

export interface User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  role: {
    id: string;
    name: string;
    displayName: string;
    description: string;
    permissions: Record<string, string[]>;
  };
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  roleId?: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const userService = {
  getUsers: async (page?: number, limit?: number, search?: string) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<ApiResponse<User[] | PaginatedUsers>>(url);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<User>>(
      `${API_BASE_URL}/users/${id}`
    );
    return response.data;
  },

  createUser: async (data: CreateUserDto) => {
    const response = await apiClient.post<ApiResponse<User>>(
      `${API_BASE_URL}/users`,
      data
    );
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto) => {
    const response = await apiClient.patch<ApiResponse<User>>(
      `${API_BASE_URL}/users/${id}`,
      data
    );
    return response.data;
  },

  toggleUserActive: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<User>>(
      `${API_BASE_URL}/users/${id}/toggle-active`
    );
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_BASE_URL}/users/${id}`
    );
    return response.data;
  },
};
