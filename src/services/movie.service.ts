import apiClient from "./apiClient";
import type { Movie, CreateMovieDto, UpdateMovieDto, FetchMoviesParams } from "@/types/movie.types";

export interface PaginatedMovies {
  data: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const MOVIES_URL = "/movies";

export const movieService = {
  // Get all movies with filters and pagination
  getMovies: async (params?: FetchMoviesParams): Promise<ApiResponse<{ data: Movie[]; meta: { total: number; page: number; limit: number; totalPages: number } }>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.contentType) queryParams.append("contentType", params.contentType);
    if (params?.releaseYearFrom) queryParams.append("releaseYearFrom", params.releaseYearFrom.toString());
    if (params?.releaseYearTo) queryParams.append("releaseYearTo", params.releaseYearTo.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await apiClient.get<ApiResponse<{ data: Movie[]; meta: { total: number; page: number; limit: number; totalPages: number } }>>(
      `${MOVIES_URL}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get movie by ID
  getMovieById: async (id: string): Promise<ApiResponse<Movie>> => {
    const response = await apiClient.get<ApiResponse<Movie>>(`${MOVIES_URL}/${id}`);
    return response.data;
  },

  // Create new movie with images
  createMovie: async (data: CreateMovieDto): Promise<ApiResponse<Movie>> => {
    const formData = new FormData();
    
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.originalTitle) formData.append("originalTitle", data.originalTitle);
    if (data.releaseYear) formData.append("releaseYear", data.releaseYear.toString());
    if (data.durationMinutes) formData.append("durationMinutes", data.durationMinutes.toString());
    if (data.trailerUrl) formData.append("trailerUrl", data.trailerUrl);
    if (data.status) formData.append("status", data.status);
    if (data.contentType) formData.append("contentType", data.contentType);
    
    // Append relationship IDs
    if (data.genreIds && data.genreIds.length > 0) {
      data.genreIds.forEach(id => formData.append("genreIds[]", id));
    }
    if (data.directorIds && data.directorIds.length > 0) {
      data.directorIds.forEach(id => formData.append("directorIds[]", id));
    }
    if (data.actorIds && data.actorIds.length > 0) {
      data.actorIds.forEach(id => formData.append("actorIds[]", id));
    }
    if (data.countryIds && data.countryIds.length > 0) {
      data.countryIds.forEach(id => formData.append("countryIds[]", id));
    }
    
    if (data.poster) {
      formData.append("poster", data.poster);
    }
    
    if (data.backdrop) {
      formData.append("backdrop", data.backdrop);
    }

    const response = await apiClient.post<ApiResponse<Movie>>(MOVIES_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update movie with images
  updateMovie: async (id: string, data: UpdateMovieDto): Promise<ApiResponse<Movie>> => {
    const formData = new FormData();
    
    if (data.title) formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.originalTitle !== undefined) formData.append("originalTitle", data.originalTitle);
    if (data.releaseYear !== undefined) formData.append("releaseYear", data.releaseYear.toString());
    if (data.durationMinutes !== undefined) formData.append("durationMinutes", data.durationMinutes.toString());
    if (data.trailerUrl !== undefined) formData.append("trailerUrl", data.trailerUrl);
    if (data.status !== undefined) formData.append("status", data.status);
    if (data.contentType !== undefined) formData.append("contentType", data.contentType);
    
    // Update relationship IDs (undefined means don't change, empty array means clear all)
    if (data.genreIds !== undefined) {
      if (data.genreIds.length > 0) {
        data.genreIds.forEach(id => formData.append("genreIds[]", id));
      } else {
        formData.append("genreIds[]", "");
      }
    }
    if (data.directorIds !== undefined) {
      if (data.directorIds.length > 0) {
        data.directorIds.forEach(id => formData.append("directorIds[]", id));
      } else {
        formData.append("directorIds[]", "");
      }
    }
    if (data.actorIds !== undefined) {
      if (data.actorIds.length > 0) {
        data.actorIds.forEach(id => formData.append("actorIds[]", id));
      } else {
        formData.append("actorIds[]", "");
      }
    }
    if (data.countryIds !== undefined) {
      if (data.countryIds.length > 0) {
        data.countryIds.forEach(id => formData.append("countryIds[]", id));
      } else {
        formData.append("countryIds[]", "");
      }
    }
    
    // Handle poster
    if (data.poster) {
      formData.append("poster", data.poster);
    } else if (data.removePoster) {
      formData.append("removePoster", "true");
    }
    
    // Handle backdrop
    if (data.backdrop) {
      formData.append("backdrop", data.backdrop);
    } else if (data.removeBackdrop) {
      formData.append("removeBackdrop", "true");
    }

    const response = await apiClient.patch<ApiResponse<Movie>>(`${MOVIES_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete movie
  deleteMovie: async (id: string): Promise<void> => {
    await apiClient.delete(`${MOVIES_URL}/${id}`);
  },

  // Search movies
  searchMovies: async (keyword: string): Promise<ApiResponse<Movie[]>> => {
    const response = await apiClient.get<ApiResponse<Movie[]>>(`${MOVIES_URL}/search?q=${keyword}`);
    return response.data;
  },
};
