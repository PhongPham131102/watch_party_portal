import { SearchFilter } from "@/components/common";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UploadVideoStatus } from "@/types/episode.types";

interface EpisodeSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  movieId?: string;
  onMovieIdChange: (value: string) => void;
  uploadStatusS3: string;
  uploadStatusMinio: string;
  onUploadStatusS3Change: (value: string) => void;
  onUploadStatusMinioChange: (value: string) => void;
  episodeNumberFrom: string;
  episodeNumberTo: string;
  onEpisodeNumberFromChange: (value: string) => void;
  onEpisodeNumberToChange: (value: string) => void;
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
  onUploadStatusS3Change,
  onUploadStatusMinioChange,
  episodeNumberFrom,
  episodeNumberTo,
  onEpisodeNumberFromChange,
  onEpisodeNumberToChange,
  onClearFilters,
  isSearching,
  onSearch,
}: EpisodeSearchFilterProps) {
  const hasActiveFilters =
    search !== "" ||
    (movieId && movieId !== "all") ||
    uploadStatusS3 !== "all" ||
    uploadStatusMinio !== "all" ||
    episodeNumberFrom !== "all" ||
    episodeNumberTo !== "all";

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
          {/* Upload Status S3 Filter */}
          <Select value={uploadStatusS3} onValueChange={onUploadStatusS3Change}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trạng thái S3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (S3)</SelectItem>
              <SelectItem value={UploadVideoStatus.PENDING}>Chờ xử lý</SelectItem>
              <SelectItem value={UploadVideoStatus.PROCESSING}>Đang xử lý</SelectItem>
              <SelectItem value={UploadVideoStatus.SUCCESS}>Thành công</SelectItem>
              <SelectItem value={UploadVideoStatus.FAILED}>Thất bại</SelectItem>
            </SelectContent>
          </Select>

          {/* Upload Status Minio Filter */}
          <Select value={uploadStatusMinio} onValueChange={onUploadStatusMinioChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Trạng thái Minio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (Minio)</SelectItem>
              <SelectItem value={UploadVideoStatus.PENDING}>Chờ xử lý</SelectItem>
              <SelectItem value={UploadVideoStatus.PROCESSING}>Đang xử lý</SelectItem>
              <SelectItem value={UploadVideoStatus.SUCCESS}>Thành công</SelectItem>
              <SelectItem value={UploadVideoStatus.FAILED}>Thất bại</SelectItem>
            </SelectContent>
          </Select>

          {/* Episode Number Range */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Từ tập"
              value={episodeNumberFrom === "all" ? "" : episodeNumberFrom}
              onChange={(e) => onEpisodeNumberFromChange(e.target.value || "all")}
              className="w-[100px] h-9"
              min="1"
            />
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Đến tập"
              value={episodeNumberTo === "all" ? "" : episodeNumberTo}
              onChange={(e) => onEpisodeNumberToChange(e.target.value || "all")}
              className="w-[100px] h-9"
              min="1"
            />
          </div>
        </>
      }
    />
  );
}

