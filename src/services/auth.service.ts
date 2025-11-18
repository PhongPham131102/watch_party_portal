import apiClient from "./apiClient";
import type { LoginCredentials, AuthResponse } from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{
      data: { user: any; accessToken: string };
    }>(`/auth/login`, credentials);
    const { user, accessToken } = response.data.data;

    // Transform response to extract permissions and role from user.role
    return {
      user,
      role: user.role.name,
      permissions: user.role.permissions,
      accessToken,
    } as AuthResponse;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post<{
      data: { user: any; accessToken: string };
    }>(`/auth/register`, data);
    const { user, accessToken } = response.data.data;

    return {
      user,
      role: user.role.name,
      permissions: user.role.permissions,
      accessToken,
    } as AuthResponse;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<{
      data: { user: any; accessToken: string };
    }>(`/auth/me`);
    const { user, accessToken } = response.data.data;

    return {
      user,
      role: user.role.name,
      permissions: user.role.permissions,
      accessToken,
    } as AuthResponse;
  },

  refreshToken: async () => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      `/auth/refresh`
    );
    return response.data.data;
  },

  logout: async () => {
    const response = await apiClient.post<{ message: string }>(`/auth/logout`);
    return response.data;
  },
};
