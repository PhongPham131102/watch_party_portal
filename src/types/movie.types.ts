export interface Movie {
  id: string;
  title: string;
  slug: string;
  description?: string;
  originalTitle?: string;
  releaseYear?: number;
  durationMinutes?: number;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  titleImageUrl?: string | null;
  trailerUrl?: string;
  averageRating: number;
  totalRatings: number;
  totalViews: number;
  status: string;
  contentType: string;
  genres?: Array<{ id: string; name: string; slug: string; description?: string }>;
  directors?: Array<{ id: string; name: string; slug: string; biography?: string }>;
  actors?: Array<{ id: string; name: string; slug: string; biography?: string }>;
  countries?: Array<{ id: string; name: string; slug: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto {
  title: string;
  description?: string;
  originalTitle?: string;
  releaseYear?: number;
  durationMinutes?: number;
  trailerUrl?: string;
  status?: string;
  contentType?: string;
  poster?: File;
  backdrop?: File;
  titleImage?: File;
  genreIds?: string[];
  directorIds?: string[];
  actorIds?: string[];
  countryIds?: string[];
}

export interface UpdateMovieDto {
  title?: string;
  description?: string;
  originalTitle?: string;
  releaseYear?: number;
  durationMinutes?: number;
  trailerUrl?: string;
  status?: string;
  contentType?: string;
  poster?: File;
  backdrop?: File;
  titleImage?: File;
  removePoster?: boolean;
  removeBackdrop?: boolean;
  removeTitleImage?: boolean;
  genreIds?: string[];
  directorIds?: string[];
  actorIds?: string[];
  countryIds?: string[];
}

export interface FetchMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  contentType?: string;
  releaseYearFrom?: number;
  releaseYearTo?: number;
  sortBy?: 'title' | 'releaseYear' | 'averageRating' | 'totalViews' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}
