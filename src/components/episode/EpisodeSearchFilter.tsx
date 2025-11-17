/* eslint-disable no-unused-vars */
import { SearchFilter } from "@/components/common";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  UploadVideoStatus,
  VideoProcessingStatus,
} from "@/types/episode.types";
import { MovieSearchSelect } from "./MovieSearchSelect";

interface EpisodeSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  movieId?: string;
  onMovieIdChange: (value: string) => void;
  uploadStatusS3: string;
  uploadStatusMinio: string;
  processingStatus: string;
  onUploadStatusS3Change: (value: string) => void;
  onUploadStatusMinioChange: (value: string) => void;
  onProcessingStatusChange: (value: string) => void;
  onClearFilters: () => void;
  isSearching: boolean;
  onSearch: () => void;
}

export function EpisodeSearchFilter({
  search,
  onSearchChange,
  movieId,
  onMovieIdChange,
  uploadStatusS3,
  uploadStatusMinio,
  processingStatus,
  onUploadStatusS3Change,
  onUploadStatusMinioChange,
  onProcessingStatusChange,
  onClearFilters,
  isSearching,
  onSearch,
}: EpisodeSearchFilterProps) {
  const hasActiveFilters =
    search !== "" ||
    (movieId && movieId !== "all") ||
    uploadStatusS3 !== "all" ||
    uploadStatusMinio !== "all" ||
    processingStatus !== "all";

  return (
    <SearchFilter
      searchTerm={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tiêu đề tập phim..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      filters={
        <>
          <MovieSearchSelect
            value={movieId || "all"}
            onChange={onMovieIdChange}
            className="w-[220px]"
            placeholder="Tìm kiếm phim..."
          />

          {/* Upload Status S3 Filter */}
          <Select value={uploadStatusS3} onValueChange={onUploadStatusS3Change}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trạng thái S3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (S3)</SelectItem>
              <SelectItem value={UploadVideoStatus.PENDING}>
                Chờ xử lý
              </SelectItem>
              <SelectItem value={UploadVideoStatus.PROCESSING}>
                Đang xử lý
              </SelectItem>
              <SelectItem value={UploadVideoStatus.SUCCESS}>
                Thành công
              </SelectItem>
              <SelectItem value={UploadVideoStatus.FAILED}>Thất bại</SelectItem>
            </SelectContent>
          </Select>

          {/* Upload Status Minio Filter */}
          <Select
            value={uploadStatusMinio}
            onValueChange={onUploadStatusMinioChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trạng thái Minio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (Minio)</SelectItem>
              <SelectItem value={UploadVideoStatus.PENDING}>
                Chờ xử lý
              </SelectItem>
              <SelectItem value={UploadVideoStatus.PROCESSING}>
                Đang xử lý
              </SelectItem>
              <SelectItem value={UploadVideoStatus.SUCCESS}>
                Thành công
              </SelectItem>
              <SelectItem value={UploadVideoStatus.FAILED}>Thất bại</SelectItem>
            </SelectContent>
          </Select>

          {/* Processing Status Filter */}
          <Select
            value={processingStatus}
            onValueChange={onProcessingStatusChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trạng thái xử lý" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (Xử lý)</SelectItem>
              <SelectItem value={VideoProcessingStatus.PENDING}>
                Chờ xử lý
              </SelectItem>
              <SelectItem value={VideoProcessingStatus.PROCESSING}>
                Đang xử lý
              </SelectItem>
              <SelectItem value={VideoProcessingStatus.SUCCESS}>
                Hoàn tất
              </SelectItem>
              <SelectItem value={VideoProcessingStatus.FAILED}>
                Thất bại
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    />
  );
}
