/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, AlertCircle, Pause, Play } from "lucide-react";
import { showToast } from "@/lib/toast";
import { episodeService } from "@/services/episode.service";
import type { UploadEpisodeDto } from "@/types/episode.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startUpload as startUploadAction,
  updateProgress as updateProgressAction,
  pauseUpload as pauseUploadAction,
  resumeUpload as resumeUploadAction,
  completeUpload as completeUploadAction,
  errorUpload as errorUploadAction,
} from "@/store/slices/uploadSlice";
import { findTusUploadByUrl, removeTusStoredUpload } from "@/lib/tusStorage";

interface TusUploadComponentProps {
  episodeMetadata: Omit<UploadEpisodeDto, "filename" | "filetype">;
  onUploadStart?: (uploadId: string) => void;
  onUploadComplete?: (episodeId: string, uploadId: string) => void;
  onUploadError?: (error: string) => void;
  onCancel?: () => void;
}

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

export function TusUploadComponent({
  episodeMetadata,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onCancel,
}: TusUploadComponentProps) {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.movies);

  // Get movie title from store
  const movie = movies.find((m) => m.id === episodeMetadata.movieId);
  const movieTitle = movie?.title;
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "paused" | "completed" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [eta, setEta] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadId, setUploadId] = useState<string | null>(null);

  const uploadRef = useRef<tus.Upload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadStartTimeRef = useRef<number | null>(null);

  // Note: TUS client tự handle progress tracking (onProgress callback)
  // Không cần WebSocket cho upload progress vì TUS đã có built-in progress calculation

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type (video only)
      if (!selectedFile.type.startsWith("video/")) {
        showToast.error("Lỗi", "Vui lòng chọn file video");
        return;
      }

      // Validate file size (max 10GB)
      const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
      if (selectedFile.size > maxSize) {
        showToast.error("Lỗi", "File không được vượt quá 10GB");
        return;
      }

      setFile(selectedFile);
      setUploadStatus("idle");
      setUploadProgress(0);
      setUploadSpeed("");
      setEta("");
      setErrorMessage("");
      uploadStartTimeRef.current = null;
    }
  };

  const startUpload = () => {
    if (!file) {
      showToast.error("Lỗi", "Vui lòng chọn file video");
      return;
    }

    // Validate required metadata fields
    if (!episodeMetadata.movieId || episodeMetadata.movieId.trim() === "") {
      showToast.error("Lỗi", "Vui lòng chọn phim");
      return;
    }

    if (!episodeMetadata.title || episodeMetadata.title.trim() === "") {
      showToast.error("Lỗi", "Vui lòng nhập tiêu đề tập phim");
      return;
    }

    if (!episodeMetadata.episodeNumber || episodeMetadata.episodeNumber < 1) {
      showToast.error("Lỗi", "Vui lòng nhập số tập hợp lệ");
      return;
    }

    // TUS Upload URL - chỉ cần root path
    // Backend có 2 routes:
    // - POST /api/v1/episodes/upload (tạo session)
    // - PATCH /api/v1/episodes/upload/:id (upload chunks)
    // TUS client tự động handle routing
    const tusUploadUrl = episodeService.getTusUploadUrl();
    console.log("🔗 TUS Upload URL:", tusUploadUrl);

    const accessToken = localStorage.getItem("accessToken");

    // Track upload start time for speed calculation
    const startTime = Date.now();
    uploadStartTimeRef.current = startTime;

    const metadata: Record<string, string> = {
      filename: file.name,
      filetype: file.type,
      movieId: episodeMetadata.movieId.trim(), // ✅ Trim để đảm bảo không có spaces
      episodeNumber: episodeMetadata.episodeNumber.toString(),
      title: episodeMetadata.title.trim(), // ✅ Trim để đảm bảo không có spaces
    };

    if (episodeMetadata.description) {
      metadata.description = episodeMetadata.description;
    }
    if (episodeMetadata.durationMinutes) {
      metadata.durationMinutes = episodeMetadata.durationMinutes.toString();
    }
    if (episodeMetadata.publishedAt) {
      metadata.publishedAt = episodeMetadata.publishedAt;
    }

    // Create TUS upload instance
    const upload = new tus.Upload(file, {
      endpoint: tusUploadUrl,
      retryDelays: [0, 1000, 3000, 5000], // Retry delays
      chunkSize: 5 * 1024 * 1024, // 5MB chunks
      metadata: encodeMetadata(metadata), // ✅ Base64 encode metadata
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      onError: (error) => {
        console.error("❌ Upload error:", error);

        // Check if it's a network error (can be resumed)
        const isNetworkError =
          error.message?.includes("network") ||
          error.message?.includes("NetworkError") ||
          error.message?.includes("Failed to fetch") ||
          (error as any)?.originalRequest?.status === 0; // Status 0 usually means network error

        // Get uploadId from state or from upload.url
        const currentUploadId =
          uploadId || (upload.url ? upload.url.split("/").pop() || null : null);

        if (currentUploadId) {
          if (!uploadId) {
            setUploadId(currentUploadId);
          }

          if (isNetworkError) {
            // Network error - set to paused so user can resume
            const errorMsg = `Lỗi kết nối: ${error.message}. Bạn có thể resume sau.`;
            setUploadStatus("paused");
            setErrorMessage(errorMsg);
            dispatch(
              pauseUploadAction({
                uploadId: currentUploadId,
                errorMessage: errorMsg,
              })
            );
            showToast.warning(
              "Mất kết nối",
              "Upload bị tạm dừng do lỗi mạng. Bạn có thể resume sau."
            );
          } else {
            // Fatal error - set to error
            setUploadStatus("error");
            setErrorMessage(error.message);
            dispatch(
              errorUploadAction({
                uploadId: currentUploadId,
                errorMessage: error.message,
              })
            );
            showToast.error("Lỗi upload", error.message);
          }
        } else {
          setUploadStatus("error");
          setErrorMessage(error.message);
          showToast.error("Lỗi upload", error.message);
        }

        onUploadError?.(error.message);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        setUploadProgress(percentage);

        // Calculate upload speed (bytes per second)
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        let speed = "";
        let eta = "";

        if (elapsedSeconds > 0) {
          const speedBps = bytesUploaded / elapsedSeconds; // bytes/second
          const speedMBps = (speedBps / 1024 / 1024).toFixed(2); // MB/s
          speed = `${speedMBps} MB/s`;
          setUploadSpeed(speed);

          // Calculate ETA
          const remainingBytes = bytesTotal - bytesUploaded;
          const etaSeconds = Math.round(remainingBytes / speedBps);
          const etaMinutes = Math.floor(etaSeconds / 60);
          const etaSecondsRemainder = etaSeconds % 60;

          if (etaMinutes > 0) {
            eta = `${etaMinutes} phút ${etaSecondsRemainder} giây`;
          } else {
            eta = `${etaSecondsRemainder} giây`;
          }
          setEta(eta);
        }

        // Dispatch to Redux
        // Get uploadId from state or from upload.url
        const currentUploadId =
          uploadId || (upload.url ? upload.url.split("/").pop() || null : null);
        if (currentUploadId) {
          // Update state if not set yet
          if (!uploadId) {
            setUploadId(currentUploadId);
          }
          dispatch(
            updateProgressAction({
              uploadId: currentUploadId,
              progress: percentage,
              speed,
              eta,
            })
          );
        }
      },
      onSuccess: () => {
        console.log("✅ Upload completed successfully");
        setUploadStatus("completed");
        setUploadProgress(100);
        showToast.success(
          "Thành công",
          "Upload video hoàn tất! Backend đang xử lý video..."
        );

        // Get upload ID from URL
        const uploadUrl = upload.url;
        if (uploadUrl) {
          const parts = uploadUrl.split("/");
          const uploadIdFromUrl = parts[parts.length - 1];
          if (uploadIdFromUrl) {
            console.log("✅ Got upload ID from URL:", uploadIdFromUrl);
            setUploadId(uploadIdFromUrl);

            // Xóa TUS storage vì upload đã completed
            const tusStored = findTusUploadByUrl(uploadUrl);
            if (tusStored) {
              console.log(
                "🗑️ Xóa TUS storage vì upload đã completed:",
                tusStored.key
              );
              removeTusStoredUpload(tusStored.key);
            }

            // Dispatch to Redux
            dispatch(completeUploadAction({ uploadId: uploadIdFromUrl }));

            // Note: Backend xử lý video ở background
            // episodeId sẽ được tạo sau khi backend process xong
            // User có thể refresh trang để xem episode mới
            if (onUploadComplete) {
              // Gọi callback với uploadId (episodeId chưa có ngay lập tức)
              onUploadComplete("", uploadIdFromUrl);
            }
          }
        }
      },
      onAfterResponse: (_req, res) => {
        // Get upload ID from response headers
        // Location format: http://localhost:8888/api/v1/episodes/upload/{uploadId}
        const location = res.getHeader("Location");
        if (location && !uploadId) {
          const parts = location.split("/");
          const uploadIdFromHeader = parts[parts.length - 1];

          if (uploadIdFromHeader) {
            console.log(
              "✅ Got upload ID from Location header:",
              uploadIdFromHeader
            );
            setUploadId(uploadIdFromHeader);

            // Dispatch to Redux - Start upload tracking
            dispatch(
              startUploadAction({
                uploadId: uploadIdFromHeader,
                tusUploadUrl: location, // Save TUS upload URL for resuming
                file: {
                  name: file.name,
                  size: file.size,
                },
                metadata: {
                  movieId: episodeMetadata.movieId,
                  movieTitle: movieTitle,
                  episodeNumber: episodeMetadata.episodeNumber,
                  title: episodeMetadata.title,
                  description: episodeMetadata.description,
                },
                startTime: startTime,
              })
            );

            // Call onUploadStart callback (to close modal, etc.)
            onUploadStart?.(uploadIdFromHeader);
          }
        }
      },
    });

    uploadRef.current = upload;

    // Debug: Log upload config
    console.log("📦 TUS Upload Config:", {
      endpoint: tusUploadUrl,
      fileSize: file.size,
      fileSizeMB: (file.size / 1024 / 1024).toFixed(2) + " MB",
      chunkSize: 5 * 1024 * 1024,
      chunkSizeMB: "5 MB",
      metadata: metadata, // Show original metadata (not encoded for debugging)
    });

    // Start upload
    upload.start();
    setUploadStatus("uploading");
    showToast.info("Bắt đầu upload", "Đang upload video...");
  };

  const pauseUpload = () => {
    if (uploadRef.current && uploadStatus === "uploading" && uploadId) {
      uploadRef.current.abort();
      setUploadStatus("paused");
      showToast.info("Tạm dừng", "Đã tạm dừng upload");

      // Dispatch to Redux
      dispatch(pauseUploadAction(uploadId));
    }
  };

  const resumeUpload = () => {
    if (uploadRef.current && uploadStatus === "paused" && uploadId) {
      // Reset start time for accurate speed calculation after resume
      uploadStartTimeRef.current = Date.now();
      uploadRef.current.start();
      setUploadStatus("uploading");
      showToast.info("Tiếp tục", "Đang tiếp tục upload...");

      // Dispatch to Redux
      dispatch(resumeUploadAction(uploadId));
    }
  };

  const cancelUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.abort(true); // true = delete upload on server
      setUploadStatus("idle");
      setUploadProgress(0);
      setUploadSpeed("");
      setEta("");
      setFile(null);
      uploadStartTimeRef.current = null;
      showToast.info("Đã hủy", "Upload đã bị hủy");
      onCancel?.();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadSpeed("");
    setEta("");
    setErrorMessage("");
    setUploadId(null);
    uploadStartTimeRef.current = null;
    uploadRef.current = null;
  };

  return (
    <div className="space-y-4">
      {/* File input */}
      {!file && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Chọn file video để upload (tối đa 10GB)
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Chọn file video
          </Button>
        </div>
      )}

      {/* File info and upload controls */}
      {file && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          {/* File info */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {uploadStatus === "idle" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Progress bar */}
          {(uploadStatus === "uploading" ||
            uploadStatus === "paused" ||
            uploadStatus === "completed") && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{uploadProgress}%</span>
                {uploadSpeed && <span>{uploadSpeed}</span>}
                {eta && <span>ETA: {eta}</span>}
              </div>
            </div>
          )}

          {/* Status messages */}
          {uploadStatus === "completed" && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Upload hoàn tất! Đang xử lý video...
              </span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex gap-2">
            {uploadStatus === "idle" && (
              <Button
                type="button"
                onClick={startUpload}
                className="flex-1"
                disabled={
                  !file ||
                  !episodeMetadata.movieId ||
                  episodeMetadata.movieId.trim() === "" ||
                  !episodeMetadata.title ||
                  episodeMetadata.title.trim() === "" ||
                  !episodeMetadata.episodeNumber ||
                  episodeMetadata.episodeNumber < 1
                }
              >
                <Upload className="h-4 w-4 mr-2" />
                Bắt đầu upload
              </Button>
            )}

            {uploadStatus === "uploading" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={pauseUpload}
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Tạm dừng
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={cancelUpload}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </>
            )}

            {uploadStatus === "paused" && (
              <>
                <Button type="button" onClick={resumeUpload} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Tiếp tục
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={cancelUpload}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </>
            )}

            {uploadStatus === "error" && (
              <>
                <Button type="button" onClick={startUpload} className="flex-1">
                  Thử lại
                </Button>
                <Button type="button" variant="outline" onClick={resetUpload}>
                  Chọn file khác
                </Button>
              </>
            )}

            {uploadStatus === "completed" && (
              <Button
                type="button"
                variant="outline"
                onClick={resetUpload}
                className="flex-1"
              >
                Upload file khác
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
