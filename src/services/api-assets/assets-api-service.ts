import { envs } from "@/core/config/envs";
import { createLogger } from "@/lib/logger";
import type {
  ApiResponse,
  ApiStatusResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  EntityGalleryRequest,
  EntityGalleryResponse,
  FileAsset,
  FindFileRequest,
  ListFilesRequest,
  ListFilesResponse,
  UploadFileRequest,
} from "@/types/api-assets";
import { isApiError } from "@/types/api-assets";

const logger = createLogger("AssetsApiService");

/**
 * AssetsApiService - Service for External Assets API (srv-assets-v1)
 *
 * This service handles all communication with the external assets API
 * for file upload, management, and retrieval operations.
 *
 * All methods are server-side only and should not be called from client components.
 * Use Server Actions to call these methods from client components.
 */
export class AssetsApiService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = envs.EXTERNAL_API_ASSETS_URL;
    this.apiKey = envs.EXTERNAL_API_ASSETS_KEY;
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(includeContentType = true): Record<string, string> {
    const headers: Record<string, string> = {
      "x-api-key": this.apiKey,
    };

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  /**
   * Handle API response and check for errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return {
          statusCode: response.status,
          message: data.message || `HTTP Error ${response.status}`,
          error: data.error || response.statusText,
        };
      }

      return data;
    } catch (_error) {
      return {
        statusCode: 500,
        message: "Failed to parse API response",
        error: "Internal Server Error",
      };
    }
  }

  /**
   * ENDPOINT 01 - Get API Status
   * GET /file
   * No authentication required
   */
  async getStatus(): Promise<ApiResponse<ApiStatusResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/file`, {
        method: "GET",
        cache: "no-store", // Always get fresh status
      });

      return this.handleResponse<ApiStatusResponse>(response);
    } catch (error) {
      return {
        statusCode: 500,
        message: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "Network Error",
      };
    }
  }

  /**
   * ENDPOINT 02 - Upload File
   * POST /file/v1/upload-file
   * Requires authentication
   */
  async uploadFile(
    request: UploadFileRequest,
  ): Promise<ApiResponse<FileAsset>> {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("file", request.file);
      formData.append("entityType", request.entityType);
      formData.append("entityId", request.entityId);

      if (request.tags && request.tags.length > 0) {
        const tagsString = request.tags.join(",");
        logger.debug("Appending tags to FormData", {
          tags: request.tags,
          tagsString,
        });
        formData.append("tags", tagsString);
      } else {
        logger.debug("No tags provided", { tags: request.tags });
      }
      if (request.description) {
        formData.append("description", request.description);
      }
      if (request.altText) {
        formData.append("altText", request.altText);
      }

      logger.debug("Uploading file", {
        fileName: request.file.name,
        entityType: request.entityType,
        entityId: request.entityId,
      });

      const response = await fetch(`${this.baseUrl}/file/v1/upload-file`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      return this.handleResponse<FileAsset>(response);
    } catch (error) {
      logger.error("Upload error", error);
      return {
        statusCode: 500,
        message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "Upload Error",
      };
    }
  }

  /**
   * ENDPOINT 03 - List Files
   * POST /file/v1/list-files
   * Requires authentication
   */
  async listFiles(
    request: ListFilesRequest = {},
  ): Promise<ApiResponse<ListFilesResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/file/v1/list-files`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      return this.handleResponse<ListFilesResponse>(response);
    } catch (error) {
      return {
        statusCode: 500,
        message: `List files failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "List Error",
      };
    }
  }

  /**
   * ENDPOINT 04 - Find File by ID
   * POST /file/v1/find-file
   * Requires authentication
   */
  async findFile(request: FindFileRequest): Promise<ApiResponse<FileAsset>> {
    try {
      const response = await fetch(`${this.baseUrl}/file/v1/find-file`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      return this.handleResponse<FileAsset>(response);
    } catch (error) {
      return {
        statusCode: 500,
        message: `Find file failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "Find Error",
      };
    }
  }

  /**
   * ENDPOINT 05 - Get Entity Gallery
   * POST /file/v1/entity-gallery
   * Requires authentication
   */
  async getEntityGallery(
    request: EntityGalleryRequest,
  ): Promise<ApiResponse<EntityGalleryResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/file/v1/entity-gallery`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      return this.handleResponse<EntityGalleryResponse>(response);
    } catch (error) {
      return {
        statusCode: 500,
        message: `Gallery fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "Gallery Error",
      };
    }
  }

  /**
   * ENDPOINT 06 - Delete File
   * POST /file/v1/delete-file
   * Requires authentication
   */
  async deleteFile(
    request: DeleteFileRequest,
  ): Promise<ApiResponse<DeleteFileResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/file/v1/delete-file`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      return this.handleResponse<DeleteFileResponse>(response);
    } catch (error) {
      return {
        statusCode: 500,
        message: `Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: "Delete Error",
      };
    }
  }

  /**
   * Utility method to check if a response is an error
   */
  isError<T>(
    response: ApiResponse<T>,
  ): response is typeof response & { statusCode: number } {
    return isApiError(response);
  }

  /**
   * Utility method to format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  }

  /**
   * Utility method to validate file type
   */
  static isValidFileType(file: File): boolean {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Spreadsheets
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    return allowedTypes.includes(file.type);
  }

  /**
   * Utility method to get file type category from MIME type
   */
  static getFileTypeFromMime(
    mimeType: string,
  ): "IMAGE" | "DOCUMENT" | "SPREADSHEET" | null {
    if (mimeType.startsWith("image/")) {
      return "IMAGE";
    }

    if (
      mimeType === "application/pdf" ||
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "DOCUMENT";
    }

    if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "text/csv"
    ) {
      return "SPREADSHEET";
    }

    return null;
  }
}

// Export singleton instance
export const assetsApiService = new AssetsApiService();
