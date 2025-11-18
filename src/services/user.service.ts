import apiClient from "./apiClient";

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

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "username" | "email";
  sortOrder?: "ASC" | "DESC";
}

export const userService = {
  getUsers: async (params?: FetchUsersParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.roleId) searchParams.append("roleId", params.roleId);
    if (params?.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const url = `/users${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response =
      await apiClient.get<ApiResponse<User[] | PaginatedUsers>>(url);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserDto) => {
    const response = await apiClient.post<ApiResponse<User>>(`/users`, data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto) => {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data;
  },

  toggleUserActive: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/toggle-active`
    );
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },
};
