import apiClient from "./apiClient";
import type {
  HeroSection,
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
  FetchHeroSectionsParams,
} from "@/types/hero-section.types";

export interface PaginatedHeroSections {
  data: HeroSection[];
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

const HERO_SECTIONS_URL = "/hero-sections";

export const heroSectionService = {
  getHeroSections: async (params?: FetchHeroSectionsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const url = `${HERO_SECTIONS_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiClient.get<ApiResponse<HeroSection[] | PaginatedHeroSections>>(url);
    return response.data;
  },

  getHeroSectionById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<HeroSection>>(
      `${HERO_SECTIONS_URL}/${id}`
    );
    return response.data;
  },

  getHeroSectionsPublic: async () => {
    const response = await apiClient.get<ApiResponse<HeroSection[]>>(
      `${HERO_SECTIONS_URL}/public`
    );
    return response.data;
  },

  createHeroSection: async (data: CreateHeroSectionDto) => {
    const response = await apiClient.post<ApiResponse<HeroSection>>(
      HERO_SECTIONS_URL,
      data
    );
    return response.data;
  },

  updateHeroSection: async (id: string, data: UpdateHeroSectionDto) => {
    const response = await apiClient.patch<ApiResponse<HeroSection>>(
      `${HERO_SECTIONS_URL}/${id}`,
      data
    );
    return response.data;
  },

  reorderHeroSection: async (id: string, order: number) => {
    const response = await apiClient.patch<ApiResponse<HeroSection>>(
      `${HERO_SECTIONS_URL}/${id}/reorder`,
      { order }
    );
    return response.data;
  },

  deleteHeroSection: async (id: string) => {
    await apiClient.delete(`${HERO_SECTIONS_URL}/${id}`);
  },
};

export type { HeroSection };

