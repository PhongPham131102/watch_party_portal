export interface Country {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name: string;
}

export interface UpdateCountryDto {
  name?: string;
}

export interface FetchCountriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}
