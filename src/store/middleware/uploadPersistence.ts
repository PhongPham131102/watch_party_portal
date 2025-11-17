/* eslint-disable no-unused-vars */
/**
 * Middleware to persist upload state to localStorage
 * Automatically saves upload state whenever it changes
 */
export const uploadPersistenceMiddleware =
  (store: {
    getState: () => {
      upload: { uploads: Record<string, unknown>; activeUploadIds: string[] };
    };
  }) =>
  (next: (action: unknown) => unknown) =>
  (action: unknown) => {
    const result = next(action);

    // Only persist if action is from upload slice
    const actionObj = action;
    if (
      typeof actionObj === "object" &&
      actionObj !== null &&
      "type" in actionObj &&
      typeof actionObj.type === "string" &&
      actionObj.type.startsWith("upload/")
    ) {
      const state = store.getState();
      const uploadState = state.upload;

      try {
        // Save to localStorage
        localStorage.setItem("uploadState", JSON.stringify(uploadState));
      } catch (error) {
        console.error("Failed to save upload state to localStorage:", error);
      }
    }

    return result;
  };
