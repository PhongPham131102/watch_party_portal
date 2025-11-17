import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UploadProgress {
  uploadId: string;
  file: {
    name: string;
    size: number;
  };
  metadata: {
    movieId: string;
    movieTitle?: string; // Movie title for display
    episodeNumber: number;
    title: string; // Episode title
    description?: string;
  };
  status: "idle" | "uploading" | "paused" | "completed" | "error";
  progress: number; // 0-100
  speed: string; // e.g., "5.2 MB/s"
  eta: string; // e.g., "30 giây"
  errorMessage?: string;
  episodeId?: string; // Set when upload completes and episode is created
  startTime: number; // Timestamp when upload started
}

interface UploadState {
  uploads: Record<string, UploadProgress>; // Key: uploadId
  activeUploadIds: string[]; // Array of uploadIds for easy iteration
}

const initialState: UploadState = {
  uploads: {},
  activeUploadIds: [],
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    // Start a new upload
    startUpload: (state, action: PayloadAction<Omit<UploadProgress, "status" | "progress" | "speed" | "eta">>) => {
      const upload: UploadProgress = {
        ...action.payload,
        status: "idle",
        progress: 0,
        speed: "",
        eta: "",
        startTime: Date.now(),
      };

      state.uploads[upload.uploadId] = upload;
      if (!state.activeUploadIds.includes(upload.uploadId)) {
        state.activeUploadIds.push(upload.uploadId);
      }
    },

    // Update upload progress
    updateProgress: (
      state,
      action: PayloadAction<{
        uploadId: string;
        progress: number;
        speed: string;
        eta: string;
      }>
    ) => {
      const { uploadId, progress, speed, eta } = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].progress = progress;
        state.uploads[uploadId].speed = speed;
        state.uploads[uploadId].eta = eta;
        if (state.uploads[uploadId].status === "idle") {
          state.uploads[uploadId].status = "uploading";
        }
      }
    },

    // Pause upload
    pauseUpload: (state, action: PayloadAction<string>) => {
      const uploadId = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].status = "paused";
      }
    },

    // Resume upload
    resumeUpload: (state, action: PayloadAction<string>) => {
      const uploadId = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].status = "uploading";
        state.uploads[uploadId].startTime = Date.now(); // Reset start time for accurate speed calculation
      }
    },

    // Complete upload
    completeUpload: (
      state,
      action: PayloadAction<{
        uploadId: string;
        episodeId?: string;
      }>
    ) => {
      const { uploadId, episodeId } = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].status = "completed";
        state.uploads[uploadId].progress = 100;
        state.uploads[uploadId].speed = "";
        state.uploads[uploadId].eta = "";
        if (episodeId) {
          state.uploads[uploadId].episodeId = episodeId;
        }
      }
    },

    // Error upload
    errorUpload: (
      state,
      action: PayloadAction<{
        uploadId: string;
        errorMessage: string;
      }>
    ) => {
      const { uploadId, errorMessage } = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].status = "error";
        state.uploads[uploadId].errorMessage = errorMessage;
      }
    },

    // Remove upload (after completion or cancellation)
    removeUpload: (state, action: PayloadAction<string>) => {
      const uploadId = action.payload;
      delete state.uploads[uploadId];
      state.activeUploadIds = state.activeUploadIds.filter((id) => id !== uploadId);
    },

    // Clear all completed uploads
    clearCompleted: (state) => {
      const completedIds = state.activeUploadIds.filter(
        (id) => state.uploads[id]?.status === "completed"
      );
      completedIds.forEach((id) => {
        delete state.uploads[id];
      });
      state.activeUploadIds = state.activeUploadIds.filter(
        (id) => !completedIds.includes(id)
      );
    },
  },
});

export const {
  startUpload,
  updateProgress,
  pauseUpload,
  resumeUpload,
  completeUpload,
  errorUpload,
  removeUpload,
  clearCompleted,
} = uploadSlice.actions;

// Selectors
export const selectAllUploads = (state: { upload: UploadState }) =>
  state.upload.activeUploadIds.map((id) => state.upload.uploads[id]);

export const selectActiveUploads = (state: { upload: UploadState }) =>
  state.upload.activeUploadIds
    .map((id) => state.upload.uploads[id])
    .filter((upload) => upload.status === "uploading" || upload.status === "paused");

export const selectUploadById = (state: { upload: UploadState }, uploadId: string) =>
  state.upload.uploads[uploadId];

export const selectUploadCount = (state: { upload: UploadState }) =>
  state.upload.activeUploadIds.length;

export default uploadSlice.reducer;

