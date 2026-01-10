import { useEffect } from "react";
import { useEpisodeStore } from "@/store/slices/episodeSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  UploadVideoStatus,
  VideoProcessingStatus,
} from "@/types/episode.types";
import { Loader2, Film, Clock, Calendar, Video, Cog } from "lucide-react";

interface ModalViewEpisodeProps {
  isOpen: boolean;
  onClose: () => void;
  episodeId: string | null;
}

export default function ModalViewEpisode({
  isOpen,
  onClose,
  episodeId,
}: ModalViewEpisodeProps) {
  const { currentEpisode, isFetchingDetail, fetchEpisodeById } =
    useEpisodeStore();

  useEffect(() => {
    if (isOpen && episodeId) {
      fetchEpisodeById(episodeId);
    }
  }, [isOpen, episodeId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  };

  const getStatusBadge = (status: UploadVideoStatus) => {
    const statusConfig = {
      [UploadVideoStatus.PENDING]: {
        variant: "secondary" as const,
        label: "Chờ xử lý",
      },
      [UploadVideoStatus.PROCESSING]: {
        variant: "default" as const,
        label: "Đang xử lý",
      },
      [UploadVideoStatus.SUCCESS]: {
        variant: "default" as const,
        label: "Thành công",
        className: "bg-green-500 hover:bg-green-600",
      },
      [UploadVideoStatus.FAILED]: {
        variant: "destructive" as const,
        label: "Thất bại",
      },
    };
    const config: any = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getProcessingStatusBadge = (status: VideoProcessingStatus) => {
    const statusConfig = {
      [VideoProcessingStatus.PENDING]: {
        variant: "secondary" as const,
        label: "Chờ xử lý",
        icon: null,
      },
      [VideoProcessingStatus.PROCESSING]: {
        variant: "default" as const,
        label: "Đang xử lý",
        className: "bg-amber-500 hover:bg-amber-600",
        icon: <Loader2 className="h-3 w-3 animate-spin mr-1" />,
      },
      [VideoProcessingStatus.SUCCESS]: {
        variant: "default" as const,
        label: "Hoàn tất",
        className: "bg-green-500 hover:bg-green-600",
        icon: null,
      },
      [VideoProcessingStatus.FAILED]: {
        variant: "destructive" as const,
        label: "Thất bại",
        icon: null,
      },
    };
    const config: any = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Chi tiết tập phim
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : currentEpisode ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Số tập
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                    {currentEpisode.episodeNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phim
                </label>
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {currentEpisode.movie?.title || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tiêu đề
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {currentEpisode.title}
              </p>
            </div>

            {/* Description */}
            {currentEpisode.description && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Mô tả
                </label>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {currentEpisode.description}
                </p>
              </div>
            )}

            {/* Duration & Published */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Thời lượng
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {formatDuration(currentEpisode.durationMinutes)}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ngày xuất bản
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {formatDate(currentEpisode.publishedAt)}
                </p>
              </div>
            </div>

            {/* Processing Status */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <Cog className="h-4 w-4" />
                Trạng thái xử lý video
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Xử lý FFmpeg (HLS, Thumbnails)
                  </span>
                  {getProcessingStatusBadge(currentEpisode.processingStatus)}
                </div>
                {currentEpisode.processingStatus ===
                  VideoProcessingStatus.PROCESSING && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Video đang được xử lý. Vui lòng chờ hoàn tất trước khi thao
                    tác.
                  </p>
                )}
                {currentEpisode.processingStatus ===
                  VideoProcessingStatus.FAILED && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Xử lý video thất bại. Vui lòng liên hệ quản trị viên.
                  </p>
                )}
              </div>
            </div>

            {/* Upload Status */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Trạng thái upload
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Amazon S3
                  </label>
                  <div>{getStatusBadge(currentEpisode.uploadStatusS3)}</div>
                  {currentEpisode.masterM3u8S3 && (
                    <p className="text-xs text-gray-500 truncate">
                      {currentEpisode.masterM3u8S3}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    MinIO
                  </label>
                  <div>{getStatusBadge(currentEpisode.uploadStatusMinio)}</div>
                  {currentEpisode.masterM3u8Minio && (
                    <p className="text-xs text-gray-500 truncate">
                      {currentEpisode.masterM3u8Minio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Video Qualities */}
            {(currentEpisode.qualitiesS3?.length ||
              currentEpisode.qualitiesMinio?.length) && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Chất lượng video
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentEpisode.qualitiesS3 &&
                    currentEpisode.qualitiesS3.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          S3
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {currentEpisode.qualitiesS3.map((q, idx) => (
                            <Badge key={idx} variant="outline">
                              {q.quality}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {currentEpisode.qualitiesMinio &&
                    currentEpisode.qualitiesMinio.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          MinIO
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {currentEpisode.qualitiesMinio.map((q, idx) => (
                            <Badge key={idx} variant="outline">
                              {q.quality}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Thumbnail */}
            {currentEpisode.thumbnailUrl && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Thumbnail
                </h3>
                <img
                  src={currentEpisode.thumbnailUrl}
                  alt={currentEpisode.title}
                  className="w-full rounded-lg object-cover max-h-[200px]"
                />
              </div>
            )}

            {/* Metadata */}
            <div className="border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="grid grid-cols-2 gap-2">
                <div>Ngày tạo: {formatDate(currentEpisode.createdAt)}</div>
                <div>Cập nhật: {formatDate(currentEpisode.updatedAt)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy thông tin tập phim
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
