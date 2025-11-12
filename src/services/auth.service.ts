import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import type { LoginCredentials, AuthResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<{ data: AuthResponse }>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  },
};
