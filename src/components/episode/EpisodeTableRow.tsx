/* eslint-disable no-unused-vars */
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { Episode } from "@/types/episode.types";
import { UploadVideoStatus, VideoProcessingStatus } from "@/types/episode.types";

interface EpisodeTableRowProps {
  episode: Episode;
  onView: (item: Episode) => void;
  onEdit: (item: Episode) => void;
  onDelete: (item: Episode) => void;
}

export function EpisodeTableRow({
  episode,
  onView,
  onEdit,
  onDelete,
}: EpisodeTableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

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

    if (hours > 0) {
      const minuteText = mins > 0 ? `${mins} phút` : "";
      return `${hours} giờ ${minuteText}`.trim();
    }

    return `${mins} phút`;
  };

  const getStatusBadge = (status: UploadVideoStatus) => {
    const statusConfig = {
      [UploadVideoStatus.PENDING]: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        ring: "ring-gray-500/20",
        label: "Chờ xử lý",
      },
      [UploadVideoStatus.PROCESSING]: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        ring: "ring-blue-500/20",
        label: "Đang xử lý",
      },
      [UploadVideoStatus.SUCCESS]: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        ring: "ring-green-500/20",
        label: "Thành công",
      },
      [UploadVideoStatus.FAILED]: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        ring: "ring-red-500/20",
        label: "Thất bại",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
        {config.label}
      </span>
    );
  };

  const getProcessingStatusBadge = (status: VideoProcessingStatus) => {
    const statusConfig = {
      [VideoProcessingStatus.PENDING]: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        ring: "ring-gray-500/20",
        label: "Chờ xử lý",
        icon: null,
      },
      [VideoProcessingStatus.PROCESSING]: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        ring: "ring-amber-500/20",
        label: "Đang xử lý",
        icon: <Loader2 className="h-3 w-3 animate-spin mr-1" />,
      },
      [VideoProcessingStatus.SUCCESS]: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        ring: "ring-green-500/20",
        label: "Hoàn tất",
        icon: null,
      },
      [VideoProcessingStatus.FAILED]: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        ring: "ring-red-500/20",
        label: "Thất bại",
        icon: null,
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Kiểm tra xem có đang processing không
  const isProcessing = episode.processingStatus === VideoProcessingStatus.PROCESSING;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          {episode.thumbnailUrl ? (
            <img
              src={episode.thumbnailUrl}
              alt={episode.title}
              loading="lazy"
              className="h-16 w-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="h-16 w-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600">
              Không có ảnh
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {episode.title}
            </p>
            {episode.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                {episode.description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          Tập {episode.episodeNumber}
        </span>
      </td>

      <td className="px-6 py-4">
        {episode.movie ? (
          <div className="text-sm text-gray-900 dark:text-white">
            {episode.movie.title}
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDuration(episode.durationMinutes)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        {getStatusBadge(episode.uploadStatusS3)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        {getStatusBadge(episode.uploadStatusMinio)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        {getProcessingStatusBadge(episode.processingStatus)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(episode.createdAt)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          {canRead(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(episode)}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          )}

          {canUpdate(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => !isProcessing && onEdit(episode)}
                  disabled={isProcessing}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isProcessing ? "Đang xử lý video, vui lòng chờ" : "Chỉnh sửa"}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {canDelete(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => !isProcessing && onDelete(episode)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isProcessing ? "Đang xử lý video, vui lòng chờ" : "Xóa tập phim"}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}
