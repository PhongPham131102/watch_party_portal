/**
 * Utility để đọc và quản lý TUS client's localStorage storage
 * TUS client tự động lưu metadata với key format: tus::[fingerprint]
 */

interface TusStoredUpload {
  size: number;
  metadata: Record<string, string>; // Base64 encoded
  creationTime: string;
  uploadUrl: string;
}

/**
 * Decode Base64 metadata từ TUS storage
 */
function decodeMetadata(encoded: string): string {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch (error) {
    console.error("Failed to decode metadata:", error);
    return encoded;
  }
}

/**
 * Parse TUS storage key để lấy fingerprint
 * Format: tus::[content]::[fingerprint]
 * Content có thể chứa filename với dấu gạch ngang, nên chỉ cần lấy fingerprint
 */
function parseTusStorageKey(key: string): {
  fingerprint: string;
} | null {
  if (!key.startsWith("tus::")) {
    return null;
  }

  try {
    // Remove "tus::" prefix
    const content = key.substring(5);
    
    // Split by "::" to get fingerprint (last part)
    const parts = content.split("::");
    if (parts.length < 2) {
      return null;
    }

    const fingerprint = parts[parts.length - 1];

    return {
      fingerprint,
    };
  } catch (error) {
    console.error("Failed to parse TUS storage key:", error);
    return null;
  }
}

/**
 * Lấy tất cả TUS uploads đã lưu trong localStorage
 */
export function getAllTusStoredUploads(): Array<{
  key: string;
  fingerprint: string;
  filename: string;
  size: number;
  type: string;
  uploadUrl: string;
  metadata: Record<string, string>;
  creationTime: string;
}> {
  const uploads: Array<{
    key: string;
    fingerprint: string;
    filename: string;
    size: number;
    type: string;
    uploadUrl: string;
    metadata: Record<string, string>;
    creationTime: string;
  }> = [];

  if (typeof window === "undefined") {
    return uploads;
  }

  try {
    // TUS client lưu với prefix "tus::"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("tus::")) {
        continue;
      }

      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      try {
        const stored: TusStoredUpload = JSON.parse(value);
        const parsed = parseTusStorageKey(key);

        if (parsed && stored.uploadUrl && stored.metadata) {
          // Decode metadata
          const decodedMetadata: Record<string, string> = {};
          for (const [k, v] of Object.entries(stored.metadata)) {
            decodedMetadata[k] = decodeMetadata(v);
          }

          // Get filename and type from metadata
          const filename = decodedMetadata.filename || "unknown";
          const type = decodedMetadata.filetype || "unknown";

          uploads.push({
            key,
            fingerprint: parsed.fingerprint,
            filename,
            size: stored.size,
            type,
            uploadUrl: stored.uploadUrl,
            metadata: decodedMetadata,
            creationTime: stored.creationTime,
          });
        }
      } catch (error) {
        console.error(`Failed to parse TUS storage for key ${key}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to read TUS storage:", error);
  }

  return uploads;
}

/**
 * Xóa TUS upload từ storage
 */
export function removeTusStoredUpload(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove TUS storage:", error);
  }
}

/**
 * Tìm TUS upload theo uploadUrl
 */
export function findTusUploadByUrl(uploadUrl: string): {
  key: string;
  fingerprint: string;
  filename: string;
  size: number;
  type: string;
  uploadUrl: string;
  metadata: Record<string, string>;
  creationTime: string;
} | null {
  const uploads = getAllTusStoredUploads();
  return uploads.find((u) => u.uploadUrl === uploadUrl) || null;
}

/**
 * Kiểm tra xem upload đã completed chưa bằng cách query HEAD request
 * TUS protocol: nếu upload-offset === upload-length thì upload đã completed
 * 
 * NOTE: Không nên gọi khi upload đang chạy để tránh lỗi 412 Precondition Failed
 */
export async function checkUploadCompleted(
  uploadUrl: string,
  expectedSize: number
): Promise<boolean> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return false;
    }

    const response = await fetch(uploadUrl, {
      method: "HEAD",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Tus-Resumable": "1.0.0", // TUS protocol header
      },
    });

    // 412 Precondition Failed - upload đang được xử lý hoặc có conflict
    // Trong trường hợp này, giả sử chưa completed
    if (response.status === 412) {
      console.warn("⚠️ 412 Precondition Failed - upload có thể đang chạy:", uploadUrl);
      return false;
    }

    if (!response.ok) {
      // Nếu 404 hoặc lỗi khác, có thể upload đã bị xóa hoặc completed
      return false;
    }

    const uploadOffset = response.headers.get("upload-offset");
    const uploadLength = response.headers.get("upload-length");

    if (uploadOffset && uploadLength) {
      const offset = parseInt(uploadOffset, 10);
      const length = parseInt(uploadLength, 10);
      
      // Upload completed nếu offset === length và length === expectedSize
      return offset === length && length === expectedSize;
    }

    // Nếu không có headers, giả sử chưa completed
    return false;
  } catch (error) {
    console.error("Failed to check upload completion:", error);
    // Nếu lỗi, giả sử chưa completed để an toàn
    return false;
  }
}

