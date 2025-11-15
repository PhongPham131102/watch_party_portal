import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import type { LoginCredentials, AuthResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{ data: { user: any; accessToken: string } }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
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
    const response = await apiClient.post<{ data: { user: any; accessToken: string } }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    const { user, accessToken } = response.data.data;
    
    return {
      user,
      role: user.role.name,
      permissions: user.role.permissions,
      accessToken,
    } as AuthResponse;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<{ data: { user: any; accessToken: string } }>(
      API_ENDPOINTS.AUTH.ME
    );
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
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data.data;
  },

  logout: async () => {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  },
};
