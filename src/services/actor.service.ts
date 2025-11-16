import apiClient from "./apiClient";
import { API_BASE_URL } from "@/constants";
import type { Actor, CreateActorDto, UpdateActorDto, FetchActorsParams } from "@/types/actor.types";

export interface PaginatedActors {
  data: Actor[];
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

export const actorService = {
  getActors: async (params?: FetchActorsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.dateOfBirthFrom) searchParams.append("dateOfBirthFrom", params.dateOfBirthFrom);
    if (params?.dateOfBirthTo) searchParams.append("dateOfBirthTo", params.dateOfBirthTo);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const url = `${API_BASE_URL}/actors${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiClient.get<ApiResponse<Actor[] | PaginatedActors>>(url);
    return response.data;
  },

  getActorById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Actor>>(
      `${API_BASE_URL}/actors/${id}`
    );
    return response.data;
  },

  createActor: async (data: CreateActorDto) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.biography) formData.append("biography", data.biography);
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
    if (data.profileImageUrl) formData.append("profileImageUrl", data.profileImageUrl);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.post<ApiResponse<Actor>>(
      `${API_BASE_URL}/actors`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateActor: async (id: string, data: UpdateActorDto) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.biography !== undefined) formData.append("biography", data.biography);
    if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
    if (data.profileImageUrl) formData.append("profileImageUrl", data.profileImageUrl);
    
    // Trường hợp 1: Gửi ảnh mới
    if (data.image) {
      formData.append("image", data.image);
    }
    // Trường hợp 2: Xóa ảnh
    else if (data.removeImage) {
      formData.append("removeImage", "true");
    }
    // Trường hợp 3: Giữ nguyên - không gửi gì

    const response = await apiClient.patch<ApiResponse<Actor>>(
      `${API_BASE_URL}/actors/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteActor: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_BASE_URL}/actors/${id}`
    );
    return response.data;
  },

  searchActors: async (keyword: string) => {
    const response = await apiClient.get<ApiResponse<Actor[]>>(
      `${API_BASE_URL}/actors/search?q=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },
};

export type { Actor };
