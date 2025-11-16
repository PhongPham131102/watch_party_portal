import apiClient from "./apiClient";
import type { Country, CreateCountryDto, UpdateCountryDto, FetchCountriesParams } from "@/types/country.types";

export interface PaginatedCountries {
  data: Country[];
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

const COUNTRIES_URL = "/countries";

export const countryService = {
  // Get all countries with filters and pagination
  getCountries: async (params?: FetchCountriesParams): Promise<ApiResponse<{ data: Country[]; meta: { total: number; page: number; limit: number; totalPages: number } }>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await apiClient.get<ApiResponse<{ data: Country[]; meta: { total: number; page: number; limit: number; totalPages: number } }>>(
      `${COUNTRIES_URL}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get country by ID
  getCountryById: async (id: string): Promise<ApiResponse<Country>> => {
    const response = await apiClient.get<ApiResponse<Country>>(`${COUNTRIES_URL}/${id}`);
    return response.data;
  },

  // Create new country
  createCountry: async (data: CreateCountryDto): Promise<ApiResponse<Country>> => {
    const response = await apiClient.post<ApiResponse<Country>>(COUNTRIES_URL, data);
    return response.data;
  },

  // Update country
  updateCountry: async (id: string, data: UpdateCountryDto): Promise<ApiResponse<Country>> => {
    const response = await apiClient.patch<ApiResponse<Country>>(`${COUNTRIES_URL}/${id}`, data);
    return response.data;
  },

  // Delete country
  deleteCountry: async (id: string): Promise<void> => {
    await apiClient.delete(`${COUNTRIES_URL}/${id}`);
  },

  // Search countries
  searchCountries: async (keyword: string): Promise<ApiResponse<Country[]>> => {
    const response = await apiClient.get<ApiResponse<Country[]>>(`${COUNTRIES_URL}/search?q=${keyword}`);
    return response.data;
  },
};
