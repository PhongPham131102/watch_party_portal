export interface Director {
  id: string;
  name: string;
  slug: string;
  biography?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateDirectorDto {
  name: string;
  biography?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  image?: File;
}

export interface UpdateDirectorDto {
  name?: string;
  biography?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  image?: File;
}

export interface FetchDirectorsParams {
  page?: number;
  limit?: number;
  search?: string;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  sortBy?: 'name' | 'createdAt' | 'dateOfBirth';
  sortOrder?: 'ASC' | 'DESC';
}
