import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startUpload as startUploadAction,
  setTusUploadUrl as setTusUploadUrlAction,
  pauseUpload as pauseUploadAction,
} from "@/store/slices/uploadSlice";
import {
  getAllTusStoredUploads,
  checkUploadCompleted,
  removeTusStoredUpload,
} from "@/lib/tusStorage";

/**
 * Hook để sync TUS client's localStorage storage với Redux state
 * Tự động load các uploads đã lưu khi component mount
 */
export function useTusStorageSync() {
  const dispatch = useAppDispatch();
  const existingUploads = useAppSelector((state) => state.upload.uploads);

  useEffect(() => {
    // Load TUS stored uploads và sync với Redux
    // Chỉ chạy 1 lần khi component mount, không chạy lại khi existingUploads thay đổi
    const syncTusUploads = async () => {
      const tusUploads = getAllTusStoredUploads();

      for (const tusUpload of tusUploads) {
        // Extract uploadId from uploadUrl
        // Format: http://localhost:8888/api/v1/episodes/upload/{uploadId}
        const uploadIdMatch = tusUpload.uploadUrl.match(/\/([^/]+)$/);
        if (!uploadIdMatch) {
          continue;
        }

        const uploadId = uploadIdMatch[1];

        // Check if already in Redux (avoid duplicates)
        if (existingUploads[uploadId]) {
          // Already exists, just ensure tusUploadUrl is set
          if (!existingUploads[uploadId].tusUploadUrl) {
            dispatch(
              setTusUploadUrlAction({
                uploadId,
                tusUploadUrl: tusUpload.uploadUrl,
              })
            );
          }
          continue;
        }

        // Check if upload is already completed (chỉ check nếu chưa có trong Redux)
        // Bỏ qua check nếu upload đang chạy để tránh 412
        try {
          const isCompleted = await checkUploadCompleted(
            tusUpload.uploadUrl,
            tusUpload.size
          );

          if (isCompleted) {
            // Upload đã completed, xóa khỏi TUS storage
            console.log("🗑️ Upload đã completed, xóa khỏi TUS storage:", uploadId);
            removeTusStoredUpload(tusUpload.key);
            continue;
          }
        } catch (error) {
          // Nếu lỗi (có thể 412), giả sử chưa completed và tiếp tục
          console.warn("⚠️ Failed to check upload completion (có thể upload đang chạy):", error);
        }

        // Extract metadata
        const movieId = tusUpload.metadata.movieId;
        const episodeNumber = parseInt(tusUpload.metadata.episodeNumber || "1", 10);
        const title = tusUpload.metadata.title || tusUpload.filename;
        const description = tusUpload.metadata.description;

        // Dispatch to Redux - set status as paused so user can resume
        dispatch(
          startUploadAction({
            uploadId,
            tusUploadUrl: tusUpload.uploadUrl,
            file: {
              name: tusUpload.filename,
              size: tusUpload.size,
            },
            metadata: {
              movieId,
              episodeNumber,
              title,
              description,
            },
            startTime: new Date(tusUpload.creationTime).getTime(),
          })
        );

        // Set TUS upload URL
        dispatch(
          setTusUploadUrlAction({
            uploadId,
            tusUploadUrl: tusUpload.uploadUrl,
          })
        );

        // Set status to paused (since this is a restored upload from TUS storage)
        dispatch(pauseUploadAction(uploadId));
      }
    };

    syncTusUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Chỉ chạy 1 lần khi mount, không phụ thuộc vào existingUploads
}

