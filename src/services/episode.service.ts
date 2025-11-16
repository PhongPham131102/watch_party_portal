import apiClient from "./apiClient";
import { API_BASE_URL } from "@/constants";
import type {
  Episode,
  UpdateEpisodeDto,
  FetchEpisodesParams,
  UploadProgressData,
} from "@/types/episode.types";

export interface PaginatedEpisodes {
  data: Episode[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const EPISODES_URL = "/episodes";
const UPLOAD_URL = "/episodes/upload";
const PROGRESS_URL = "/upload-progress";

export const episodeService = {
  // Get all episodes with filters and pagination
  getEpisodes: async (params?: FetchEpisodesParams): Promise<ApiResponse<PaginatedEpisodes>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.movieId) queryParams.append("movieId", params.movieId);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.uploadStatusS3) queryParams.append("uploadStatusS3", params.uploadStatusS3);
    if (params?.uploadStatusMinio) queryParams.append("uploadStatusMinio", params.uploadStatusMinio);
    if (params?.episodeNumberFrom) queryParams.append("episodeNumberFrom", params.episodeNumberFrom.toString());
    if (params?.episodeNumberTo) queryParams.append("episodeNumberTo", params.episodeNumberTo.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await apiClient.get<ApiResponse<PaginatedEpisodes>>(
      `${EPISODES_URL}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get episode by ID
  getEpisodeById: async (id: string): Promise<ApiResponse<Episode>> => {
    const response = await apiClient.get<ApiResponse<Episode>>(`${EPISODES_URL}/${id}`);
    return response.data;
  },

  // Update episode metadata (không upload video)
  updateEpisode: async (id: string, data: UpdateEpisodeDto): Promise<ApiResponse<Episode>> => {
    const response = await apiClient.patch<ApiResponse<Episode>>(`${EPISODES_URL}/${id}`, data);
    return response.data;
  },

  // Delete episode
  deleteEpisode: async (id: string): Promise<void> => {
    await apiClient.delete(`${EPISODES_URL}/${id}`);
  },

  // Get upload progress by uploadId (REST fallback)
  getUploadProgress: async (uploadId: string): Promise<ApiResponse<UploadProgressData>> => {
    const response = await apiClient.get<ApiResponse<UploadProgressData>>(
      `${PROGRESS_URL}/${uploadId}`
    );
    return response.data;
  },

  // Get upload progress by episodeId (REST fallback)
  getUploadProgressByEpisode: async (episodeId: string): Promise<ApiResponse<UploadProgressData>> => {
    const response = await apiClient.get<ApiResponse<UploadProgressData>>(
      `${PROGRESS_URL}/episode/${episodeId}`
    );
    return response.data;
  },

  // Get all active uploads
  getAllActiveUploads: async (): Promise<ApiResponse<{ count: number; uploads: UploadProgressData[] }>> => {
    const response = await apiClient.get<ApiResponse<{ count: number; uploads: UploadProgressData[] }>>(
      `${PROGRESS_URL}/active/all`
    );
    return response.data;
  },

  // TUS Upload methods - sẽ được sử dụng trong TUS upload component
  getTusUploadUrl: () => {
    // Dùng trực tiếp API_BASE_URL để đảm bảo đúng path
    // Kết quả: http://localhost:8888/api/v1/episodes/upload
    return `${API_BASE_URL}${UPLOAD_URL}`;
  },
};

