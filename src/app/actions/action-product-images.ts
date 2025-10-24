"use server";

import { assetsApiService } from "@/services/api-assets";
import type { EntityType, FileAsset } from "@/types/api-assets";
import { isApiError } from "@/types/api-assets";

/**
 * Server Actions for Product Image Upload
 * These actions handle file uploads for products using the external Assets API
 */

interface UploadProductImageResponse {
  success: boolean;
  data?: FileAsset;
  error?: string;
}

/**
 * Upload image for a product
 * Used by ProductImageGallery component to upload new product images
 *
 * @param formData FormData containing:
 *   - file: File object to upload
 *   - productId: Product ID (will be used as entityId)
 *   - tags: Optional comma-separated tags
 *   - description: Optional image description
 *   - altText: Optional alt text for accessibility
 */
export async function uploadProductImageAction(
  formData: FormData,
): Promise<UploadProductImageResponse> {
  try {
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const tagsString = formData.get("tags") as string;
    const description = formData.get("description") as string;
    const altText = formData.get("altText") as string;

    // Validate required fields
    if (!file || !productId) {
      return {
        success: false,
        error: "Arquivo e ID do produto são obrigatórios",
      };
    }

    // Validate file is actually a file
    if (!(file instanceof File)) {
      return {
        success: false,
        error: "Arquivo inválido",
      };
    }

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : undefined;

    // Call the assets API service to upload the file
    const result = await assetsApiService.uploadFile({
      file,
      entityType: "PRODUCT" as EntityType,
      entityId: productId,
      tags,
      description: description || undefined,
      altText: altText || undefined,
    });

    // Check if the response is an error
    if (isApiError(result)) {
      return {
        success: false,
        error: Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message,
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Upload product image action error:", error);
    return {
      success: false,
      error: "Erro interno ao fazer upload da imagem",
    };
  }
}
