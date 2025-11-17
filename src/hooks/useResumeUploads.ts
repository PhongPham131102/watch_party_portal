import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllUploads,
  resumeUpload as resumeUploadAction,
  errorUpload as errorUploadAction,
} from "@/store/slices/uploadSlice";
import * as tus from "tus-js-client";
import { episodeService } from "@/services/episode.service";
import { showToast } from "@/lib/toast";

/**
 * Hook để tự động resume uploads khi component mount
 * Sử dụng TUS client's resumeFromPreviousUpload để tiếp tục upload từ URL đã lưu
 */
export function useResumeUploads() {
  const dispatch = useAppDispatch();
  const allUploads = useAppSelector(selectAllUploads);
  const pausedUploads = allUploads.filter(
    (upload) => upload.status === "paused" && upload.tusUploadUrl
  );

  useEffect(() => {
    // Resume paused uploads that have tusUploadUrl
    pausedUploads.forEach((upload) => {
      if (!upload.tusUploadUrl) return;

      console.log("🔄 Attempting to resume upload:", upload.uploadId);

      // TUS client có thể resume chỉ với URL và file size
      // Tuy nhiên, vì không có File object, chúng ta chỉ có thể query progress
      // Để thực sự resume, cần File object hoặc user phải chọn lại file

      // For now, we'll just update the status to show it can be resumed
      // User can manually resume by clicking resume button
      // TODO: Implement full resume with File object (requires IndexedDB or file picker)
    });
  }, [pausedUploads, dispatch]);

  return {
    pausedUploads,
  };
}

/**
 * Resume a specific upload
 * Note: This requires the original File object, which we don't have after page reload
 * So we'll show a message to user to re-select the file
 */
export function useResumeUpload(uploadId: string) {
  const dispatch = useAppDispatch();
  const upload = useAppSelector(
    (state) => state.upload.uploads[uploadId]
  );

  const resumeUpload = async (file: File) => {
    if (!upload || !upload.tusUploadUrl) {
      showToast.error("Lỗi", "Không thể resume upload. Vui lòng upload lại.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const startTime = Date.now();

      // Resume from previous upload URL
      const uploadInstance = new tus.Upload(file, {
        endpoint: upload.tusUploadUrl,
        retryDelays: [0, 1000, 3000, 5000],
        chunkSize: 5 * 1024 * 1024,
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

          // Dispatch progress update
          // Note: This would need to be handled by a component that manages the upload
        },
        onSuccess: () => {
          dispatch(resumeUploadAction(uploadId));
          showToast.success("Thành công", "Resume upload thành công!");
        },
        onError: (error) => {
          dispatch(
            errorUploadAction({
              uploadId,
              errorMessage: error.message,
            })
          );
          showToast.error("Lỗi", `Resume upload thất bại: ${error.message}`);
        },
      });

      // Start resume
      uploadInstance.start();
      dispatch(resumeUploadAction(uploadId));
    } catch (error: any) {
      dispatch(
        errorUploadAction({
          uploadId,
          errorMessage: error.message || "Resume upload thất bại",
        })
      );
      showToast.error("Lỗi", "Không thể resume upload");
    }
  };

  return {
    upload,
    resumeUpload,
  };
}

