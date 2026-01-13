import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/constants";
import type {
  OverviewStats,
  RealtimeStats,
  ProcessingPipelineStats,
  TopContentStats,
  DashboardStats,
  ApiResponse,
} from "@/types/statistics.types";

export const statisticsService = {
  getOverview: async (): Promise<OverviewStats> => {
    const response = await apiClient.get<ApiResponse<OverviewStats>>(
      API_ENDPOINTS.STATISTICS.OVERVIEW
    );
    return response.data.data;
  },

  getRealtime: async (): Promise<RealtimeStats> => {
    const response = await apiClient.get<ApiResponse<RealtimeStats>>(
      API_ENDPOINTS.STATISTICS.REALTIME
    );
    return response.data.data;
  },

  getProcessing: async (): Promise<ProcessingPipelineStats> => {
    const response = await apiClient.get<ApiResponse<ProcessingPipelineStats>>(
      API_ENDPOINTS.STATISTICS.PROCESSING
    );
    return response.data.data;
  },

  getTopContent: async (): Promise<TopContentStats[]> => {
    const response = await apiClient.get<ApiResponse<TopContentStats[]>>(
      API_ENDPOINTS.STATISTICS.TOP_CONTENT
    );
    return response.data.data;
  },

  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.STATISTICS.DASHBOARD
    );
    return response.data.data;
  },
};

export default statisticsService;
