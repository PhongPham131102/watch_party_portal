import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { Episode } from "@/types/episode.types";
import { UploadVideoStatus } from "@/types/episode.types";

interface EpisodeTableRowProps {
  episode: Episode;
  onView: (item: Episode) => void;
  onEdit: (item: Episode) => void;
  onDelete: (item: Episode) => void;
}

export function EpisodeTableRow({ episode, onView, onEdit, onDelete }: EpisodeTableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusBadge = (status: UploadVideoStatus) => {
    const statusConfig = {
      [UploadVideoStatus.PENDING]: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        ring: 'ring-gray-500/20',
        label: 'Chờ xử lý',
      },
      [UploadVideoStatus.PROCESSING]: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        ring: 'ring-blue-500/20',
        label: 'Đang xử lý',
      },
      [UploadVideoStatus.SUCCESS]: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        ring: 'ring-green-500/20',
        label: 'Thành công',
      },
      [UploadVideoStatus.FAILED]: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        ring: 'ring-red-500/20',
        label: 'Thất bại',
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

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
            {episode.episodeNumber}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {episode.title}
          </div>
          {episode.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {episode.description}
            </div>
          )}
        </div>
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
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">S3:</span>
            {getStatusBadge(episode.uploadStatusS3)}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Minio:</span>
            {getStatusBadge(episode.uploadStatusMinio)}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(episode.publishedAt)}
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
              <TooltipContent><p>Xem chi tiết</p></TooltipContent>
            </Tooltip>
          )}
          
          {canUpdate(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(episode)}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Chỉnh sửa</p></TooltipContent>
            </Tooltip>
          )}
          
          {canDelete(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete(episode)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xóa tập phim</p></TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}

