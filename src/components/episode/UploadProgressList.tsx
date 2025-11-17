import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  removeUpload,
  clearCompleted,
} from "@/store/slices/uploadSlice";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function UploadProgressList() {
  const dispatch = useAppDispatch();
  const [isMinimized, setIsMinimized] = useState(false);
  const allUploads = useAppSelector((state) => 
    state.upload.activeUploadIds.map((id) => state.upload.uploads[id])
  );
  const activeUploads = allUploads.filter(
    (u) => u.status === "uploading" || u.status === "paused"
  );

  if (allUploads.length === 0) {
    return null;
  }

  const handleRemove = (uploadId: string) => {
    dispatch(removeUpload(uploadId));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const completedCount = allUploads.filter((u) => u.status === "completed").length;
  const hasCompleted = completedCount > 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[700px]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Xử lý Video
          </h3>
          <div className="flex items-center gap-2">
            {hasCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                className="h-7 text-xs text-gray-600 dark:text-gray-400"
              >
                Xóa hoàn tất ({completedCount})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-7 w-7 p-0"
            >
              {isMinimized ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="max-h-[500px] overflow-y-auto">
            {allUploads.map((upload) => (
              <UploadProgressItem
                key={upload.uploadId}
                upload={upload}
                onRemove={() => handleRemove(upload.uploadId)}
              />
            ))}
          </div>
        )}

        {/* Minimized view */}
        {isMinimized && (
          <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            {activeUploads.length > 0 ? (
              <span>{activeUploads.length} upload đang xử lý</span>
            ) : (
              <span>Tất cả upload đã hoàn tất</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface UploadProgressItemProps {
  upload: {
    uploadId: string;
    file: { name: string; size: number };
    metadata: { 
      movieId: string;
      movieTitle?: string;
      episodeNumber: number; 
      title: string;
      description?: string;
    };
    status: "idle" | "uploading" | "paused" | "completed" | "error";
    progress: number;
    speed: string;
    eta: string;
    errorMessage?: string;
    episodeId?: string;
    startTime: number;
  };
  onRemove: () => void;
}

function UploadProgressItem({ upload, onRemove }: UploadProgressItemProps) {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Format progress percentage
  const progressPercentage = upload.progress.toFixed(2);

  // Get status text and color
  const getStatusInfo = () => {
    switch (upload.status) {
      case "uploading":
        return {
          text: "Đang tải lên",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
        };
      case "paused":
        return {
          text: "Tạm dừng",
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        };
      case "completed":
        return {
          text: "Hoàn tất",
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
        };
      case "error":
        return {
          text: "Lỗi",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
        };
      default:
        return {
          text: "Đang chờ",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Build movie-episode title
  const movieEpisodeTitle = upload.metadata.movieTitle 
    ? `${upload.metadata.movieTitle} - Tập ${upload.metadata.episodeNumber}`
    : `Tập ${upload.metadata.episodeNumber}`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="px-4 py-3">
        {/* Single Row Layout: Tên phim - tập | ~thời gian | tốc độ | % với spinner | X */}
        <div className="flex items-center gap-4">
          {/* Movie - Episode Title */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {movieEpisodeTitle}
            </h4>
          </div>

          {/* ETA and Speed - Only show when uploading */}
          {upload.status === "uploading" && (upload.eta || upload.speed) && (
            <>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              {upload.eta && (
                <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  ~{upload.eta}
                </div>
              )}
              {upload.speed && (
                <>
                  {upload.eta && <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />}
                  <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {upload.speed}
                  </div>
                </>
              )}
            </>
          )}

          {/* Separator before progress */}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />

          {/* Progress Percentage with Loading Spinner */}
          <div className="relative flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
              {progressPercentage}%
            </div>
            {upload.status === "uploading" && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
            )}
            {upload.status === "completed" && (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
            {upload.status === "error" && (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            {upload.status === "paused" && (
              <div className="h-4 w-4 rounded-full border-2 border-yellow-600 dark:border-yellow-400" />
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Badge and Progress Bar Row */}
        <div className="flex items-center gap-3 mt-2">
          {/* Status Badge */}
          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
            {statusInfo.text}
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <Progress 
              value={upload.progress} 
              className="h-1.5"
            />
          </div>
        </div>

        {/* Error Message */}
        {upload.status === "error" && upload.errorMessage && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {upload.errorMessage}
          </p>
        )}

        {/* Completed Message */}
        {upload.status === "completed" && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Upload hoàn tất! Backend đang xử lý video...
          </p>
        )}
      </div>
    </div>
  );
}
