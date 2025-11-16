export interface Actor {
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

export interface CreateActorDto {
  name: string;
  biography?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  image?: File;
}

export interface UpdateActorDto {
  name?: string;
  biography?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  image?: File;
  removeImage?: boolean;
}

export interface FetchActorsParams {
  page?: number;
  limit?: number;
  search?: string;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  sortBy?: 'name' | 'createdAt' | 'dateOfBirth';
  sortOrder?: 'ASC' | 'DESC';
}
