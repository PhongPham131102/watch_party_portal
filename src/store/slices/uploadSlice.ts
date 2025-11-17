import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UploadProgress {
  uploadId: string;
  tusUploadUrl?: string; // TUS upload URL for resuming (e.g., http://localhost:8888/api/v1/episodes/upload/{uploadId})
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

// Load state from localStorage on init
const loadStateFromStorage = (): UploadState => {
  if (typeof window === "undefined") {
    return { uploads: {}, activeUploadIds: [] };
  }

  try {
    const stored = localStorage.getItem("uploadState");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Only restore incomplete uploads (not completed or error)
      const incompleteUploads: Record<string, UploadProgress> = {};
      const incompleteIds: string[] = [];

      Object.entries(parsed.uploads || {}).forEach(([id, upload]: [string, any]) => {
        if (upload.status === "uploading" || upload.status === "paused" || upload.status === "idle") {
          incompleteUploads[id] = {
            ...upload,
            status: "paused", // Set to paused so user can resume
          };
          incompleteIds.push(id);
        }
      });

      return {
        uploads: incompleteUploads,
        activeUploadIds: incompleteIds,
      };
    }
  } catch (error) {
    console.error("Failed to load upload state from localStorage:", error);
  }

  return { uploads: {}, activeUploadIds: [] };
};

const initialState: UploadState = loadStateFromStorage();

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

    // Set TUS upload URL (for resuming)
    setTusUploadUrl: (
      state,
      action: PayloadAction<{
        uploadId: string;
        tusUploadUrl: string;
      }>
    ) => {
      const { uploadId, tusUploadUrl } = action.payload;
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].tusUploadUrl = tusUploadUrl;
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
    pauseUpload: (state, action: PayloadAction<string | { uploadId: string; errorMessage?: string }>) => {
      const payload = action.payload;
      const uploadId = typeof payload === "string" ? payload : payload.uploadId;
      const errorMessage = typeof payload === "object" ? payload.errorMessage : undefined;
      
      if (state.uploads[uploadId]) {
        state.uploads[uploadId].status = "paused";
        if (errorMessage) {
          state.uploads[uploadId].errorMessage = errorMessage;
        }
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
  setTusUploadUrl,
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

