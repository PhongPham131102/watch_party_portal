import { useState, useRef } from "react";
import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  removeUpload,
  clearCompleted,
  resumeUpload as resumeUploadAction,
} from "@/store/slices/uploadSlice";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import * as tus from "tus-js-client";
import { showToast } from "@/lib/toast";
import {
  startUpload as startUploadAction,
  updateProgress as updateProgressAction,
  completeUpload as completeUploadAction,
  errorUpload as errorUploadAction,
  removeUpload as removeUploadAction,
} from "@/store/slices/uploadSlice";
import { useTusStorageSync } from "@/hooks/useTusStorageSync";
import { findTusUploadByUrl, removeTusStoredUpload } from "@/lib/tusStorage";

/**
 * Helper function to encode metadata to Base64
 * TUS protocol requires metadata to be base64 encoded
 */
const encodeMetadata = (
  metadata: Record<string, string>
): Record<string, string> => {
  const encoded: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    // Convert string to base64
    // unescape + encodeURIComponent handles UTF-8 characters correctly
    encoded[key] = btoa(unescape(encodeURIComponent(value)));
  }
  return encoded;
};

export function UploadProgressList() {
  const dispatch = useAppDispatch();
  const [isMinimized, setIsMinimized] = useState(false);

  // Sync TUS storage với Redux state khi component mount
  useTusStorageSync();

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
    // Tìm upload trong Redux để lấy tusUploadUrl
    const upload = allUploads.find((u) => u.uploadId === uploadId);

    // Xóa TUS storage nếu có
    if (upload?.tusUploadUrl) {
      const tusStored = findTusUploadByUrl(upload.tusUploadUrl);
      if (tusStored) {
        console.log(
          "🗑️ Xóa TUS storage khi user remove upload:",
          tusStored.key
        );
        removeTusStoredUpload(tusStored.key);
      }
    }

    // Xóa khỏi Redux
    dispatch(removeUpload(uploadId));
  };

  const handleClearCompleted = () => {
    // Xóa TUS storage cho các uploads đã completed
    const completedUploads = allUploads.filter((u) => u.status === "completed");
    completedUploads.forEach((upload) => {
      if (upload.tusUploadUrl) {
        const tusStored = findTusUploadByUrl(upload.tusUploadUrl);
        if (tusStored) {
          console.log("🗑️ Xóa TUS storage khi clear completed:", tusStored.key);
          removeTusStoredUpload(tusStored.key);
        }
      }
    });

    // Xóa khỏi Redux
    dispatch(clearCompleted());
  };

  const completedCount = allUploads.filter(
    (u) => u.status === "completed"
  ).length;
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
                className="h-7 text-xs text-gray-600 dark:text-gray-400">
                Xóa hoàn tất ({completedCount})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-7 w-7 p-0">
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
    tusUploadUrl?: string;
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
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<tus.Upload | null>(null);
  const currentUploadIdRef = useRef<string>(upload.uploadId); // Track current uploadId (may change if resume creates new upload)

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Handle resume upload
  const handleResume = () => {
    if (!upload.tusUploadUrl) {
      showToast.error("Lỗi", "Không thể resume upload. Vui lòng upload lại.");
      return;
    }

    // Yêu cầu user chọn lại file để resume
    // TUS client sẽ tự động resume từ offset hiện tại trên server
    fileInputRef.current?.click();
  };

  // Handle file selection for resume
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !upload.tusUploadUrl) return;

    // Validate file size matches
    if (file.size !== upload.file.size) {
      showToast.error(
        "Lỗi",
        `File size không khớp. File gốc: ${formatFileSize(upload.file.size)}, File mới: ${formatFileSize(file.size)}`
      );
      return;
    }

    // Resume upload using TUS client
    const accessToken = localStorage.getItem("accessToken");
    const startTime = Date.now();

    // Prepare metadata for resume (same as original upload)
    const metadata: Record<string, string> = {
      filename: upload.file.name,
      filetype: file.type,
      movieId: upload.metadata.movieId,
      episodeNumber: upload.metadata.episodeNumber.toString(),
      title: upload.metadata.title,
    };

    if (upload.metadata.description) {
      metadata.description = upload.metadata.description;
    }

    // Extract base endpoint from uploadUrl
    // uploadUrl format: http://localhost:8888/api/v1/episodes/upload/{uploadId}
    // Base endpoint: http://localhost:8888/api/v1/episodes/upload
    const baseEndpoint = upload.tusUploadUrl.substring(
      0,
      upload.tusUploadUrl.lastIndexOf("/")
    );

    // TUS client sẽ tự động tìm previous upload từ localStorage dựa trên file fingerprint
    // Nếu tìm thấy, nó sẽ tự động resume từ offset đã lưu trên server
    const uploadInstance = new tus.Upload(file, {
      endpoint: baseEndpoint, // Use base endpoint
      retryDelays: [0, 1000, 3000, 5000],
      chunkSize: 5 * 1024 * 1024,
      metadata: encodeMetadata(metadata), // ✅ Add metadata for resume
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      onAfterResponse: (_req, res) => {
        // Check if a new upload was created (resume failed, new upload started)
        const location = res.getHeader("Location");
        if (location && location !== upload.tusUploadUrl) {
          // New upload was created, extract new uploadId
          const parts = location.split("/");
          const newUploadId = parts[parts.length - 1];

          if (newUploadId && newUploadId !== upload.uploadId) {
            console.log("⚠️ Resume failed, new upload created:", newUploadId);
            console.log("🗑️ Removing old upload entry:", upload.uploadId);
            console.log("🆕 Creating new upload entry:", newUploadId);

            // Store old uploadId for cleanup
            const oldUploadId = currentUploadIdRef.current;

            // Update current uploadId reference
            currentUploadIdRef.current = newUploadId;

            // Remove old upload entry
            dispatch(removeUploadAction(oldUploadId));

            // Create new upload entry with new uploadId
            dispatch(
              startUploadAction({
                uploadId: newUploadId,
                tusUploadUrl: location,
                file: {
                  name: upload.file.name,
                  size: upload.file.size,
                },
                metadata: {
                  movieId: upload.metadata.movieId,
                  movieTitle: upload.metadata.movieTitle,
                  episodeNumber: upload.metadata.episodeNumber,
                  title: upload.metadata.title,
                  description: upload.metadata.description,
                },
                startTime: startTime,
              })
            );

            // Note: Progress tracking will use newUploadId from now on
          }
        }
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        let speed = "";
        let eta = "";

        const elapsedSeconds = (Date.now() - startTime) / 1000;
        if (elapsedSeconds > 0) {
          const speedBps = bytesUploaded / elapsedSeconds;
          const speedMBps = (speedBps / 1024 / 1024).toFixed(2);
          speed = `${speedMBps} MB/s`;

          const remainingBytes = bytesTotal - bytesUploaded;
          const etaSeconds = Math.round(remainingBytes / speedBps);
          const etaMinutes = Math.floor(etaSeconds / 60);
          const etaSecondsRemainder = etaSeconds % 60;

          if (etaMinutes > 0) {
            eta = `${etaMinutes} phút ${etaSecondsRemainder} giây`;
          } else {
            eta = `${etaSecondsRemainder} giây`;
          }
        }

        dispatch(
          updateProgressAction({
            uploadId: currentUploadIdRef.current, // Use ref in case uploadId changed
            progress: percentage,
            speed,
            eta,
          })
        );
      },
      onSuccess: () => {
        dispatch(
          completeUploadAction({ uploadId: currentUploadIdRef.current })
        );
        showToast.success("Thành công", "Resume upload hoàn tất!");
      },
      onError: (error) => {
        dispatch(
          errorUploadAction({
            uploadId: currentUploadIdRef.current,
            errorMessage: error.message,
          })
        );
        showToast.error("Lỗi", `Resume upload thất bại: ${error.message}`);
      },
    });

    uploadRef.current = uploadInstance;

    // TUS client tự động tìm previous upload từ localStorage dựa trên file fingerprint
    // Nếu tìm thấy, nó sẽ tự động resume từ offset đã lưu trên server
    // Không cần chỉ định URL cụ thể, TUS client tự động handle
    uploadInstance.start();

    dispatch(resumeUploadAction(upload.uploadId));
    showToast.info("Đang resume", "Đang tiếp tục upload từ vị trí đã lưu...");
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
                  {upload.eta && (
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  )}
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

          {/* Resume Button (for paused/error uploads) */}
          {(upload.status === "paused" || upload.status === "error") &&
            upload.tusUploadUrl && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResume}
                  className="h-6 px-2 text-xs"
                  title="Resume upload (chọn lại file)">
                  <Play className="h-3 w-3 mr-1" />
                  Tiếp tục
                </Button>
                {/* Hidden file input for resume */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Badge and Progress Bar Row */}
        <div className="flex items-center gap-3 mt-2">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
            {statusInfo.text}
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <Progress value={upload.progress} className="h-1.5" />
          </div>
        </div>

        {/* Paused Message (especially for network errors) */}
        {upload.status === "paused" && upload.errorMessage && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            {upload.errorMessage} Click "Resume" để tiếp tục.
          </p>
        )}

        {/* Error Message */}
        {upload.status === "error" && upload.errorMessage && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {upload.errorMessage}
          </p>
        )}

        {/* Completed Message */}
        {upload.status === "completed" && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            Upload hoàn tất!
          </p>
        )}
      </div>
    </div>
  );
}
