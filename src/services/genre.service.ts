import apiClient from "./apiClient";

import type {
  Genre,
  CreateGenreDto,
  UpdateGenreDto,
  FetchGenresParams,
} from "@/types/genre.types";

export interface PaginatedGenres {
  data: Genre[];
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

export const genreService = {
  getGenres: async (params?: FetchGenresParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const url = `/genres${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response =
      await apiClient.get<ApiResponse<Genre[] | PaginatedGenres>>(url);
    return response.data;
  },

  getGenreById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Genre>>(`/genres/${id}`);
    return response.data;
  },

  createGenre: async (data: CreateGenreDto) => {
    const response = await apiClient.post<ApiResponse<Genre>>(`/genres`, data);
    return response.data;
  },

  updateGenre: async (id: string, data: UpdateGenreDto) => {
    const response = await apiClient.patch<ApiResponse<Genre>>(
      `/genres/${id}`,
      data
    );
    return response.data;
  },

  deleteGenre: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/genres/${id}`);
    return response.data;
  },

  searchGenres: async (keyword: string) => {
    const response = await apiClient.get<ApiResponse<Genre[]>>(
      `/genres/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },
};

export type { Genre };
