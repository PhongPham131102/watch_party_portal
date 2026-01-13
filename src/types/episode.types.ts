/* eslint-disable no-unused-vars */
export enum UploadVideoStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum VideoProcessingStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface VideoQuality {
  quality: string;
  url: string;
}

export interface Episode {
  id: string;
  movieId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  durationMinutes?: number;
  thumbnailUrl?: string;
  publishedAt?: string;

  // Video URLs
  masterM3u8S3?: string;
  masterM3u8Minio?: string;

  // Qualities
  qualitiesS3?: VideoQuality[];
  qualitiesMinio?: VideoQuality[];

  // Upload status
  uploadStatusS3: UploadVideoStatus;
  uploadStatusMinio: UploadVideoStatus;

  // Processing status (FFmpeg conversion)
  processingStatus: VideoProcessingStatus;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations
  movie?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface UploadEpisodeDto {
  movieId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  durationMinutes?: number;
  publishedAt?: string;
  filename: string;
  filetype?: string;
}

export interface UpdateEpisodeDto {
  episodeNumber?: number;
  title?: string;
  description?: string;
  durationMinutes?: number;
  thumbnailUrl?: string;
  removeThumbnail?: boolean;
  publishedAt?: string;
}

export interface FetchEpisodesParams {
  page?: number;
  limit?: number;
  movieId?: string;
  search?: string;
  uploadStatusS3?: UploadVideoStatus;
  uploadStatusMinio?: UploadVideoStatus;
  processingStatus?: VideoProcessingStatus;
  episodeNumberFrom?: number;
  episodeNumberTo?: number;
  sortBy?: "episodeNumber" | "title" | "createdAt" | "publishedAt";
  sortOrder?: "ASC" | "DESC";
}

// TUS Upload types
export interface TusUploadMetadata {
  uploadId: string;
  filename: string;
  filetype: string;
  uploadLength: number;
  uploadOffset: number;
}

export interface UploadProgressData {
  uploadId: string;
  episodeId?: string;
  percentage: number;
  bytesUploaded: number;
  bytesTotal: number;
  speed: string;
  estimatedTimeRemaining: string;
  status: "uploading" | "completed" | "failed";
  error?: string;
}
