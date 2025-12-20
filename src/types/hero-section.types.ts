import type { Movie } from './movie.types';

export interface HeroSection {
  id: string;
  movieId: string;
  movie?: Movie;
  order: number;
  isActive: boolean;
  title?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateHeroSectionDto {
  movieId: string;
  order?: number;
  title?: string;
  description?: string;
}

export interface UpdateHeroSectionDto {
  order?: number;
  isActive?: boolean;
  title?: string;
  description?: string;
}

export interface FetchHeroSectionsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  sortBy?: 'order' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

