"use server";

import { createLogger } from "@/lib/logger";
import type { FileAsset } from "@/types/api-assets";
import { uploadFileAction } from "./action-test-assets";

const logger = createLogger("action-product-images");

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

    logger.debug("Upload product image", {
      fileName: file.name,
      productId,
      tagsString,
      description,
      altText,
    });

    // Create FormData exactly like test page does
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("entityType", "PRODUCT");
    uploadFormData.append("entityId", productId);
    if (tagsString) uploadFormData.append("tags", tagsString);
    if (description) uploadFormData.append("description", description);
    if (altText) uploadFormData.append("altText", altText);

    console.log(
      "uploadProductImageAction - FormData being sent to uploadFileAction:",
      {
        entries: Array.from(uploadFormData.entries()).map(([key, value]) => [
          key,
          value instanceof File ? `File: ${value.name}` : value,
        ]),
      },
    );

    // Call the test assets action that we know works
    const result = await uploadFileAction(uploadFormData);

    // Return the result from the working uploadFileAction
    return result;
  } catch (error) {
    console.error("Upload product image action error:", error);
    return {
      success: false,
      error: "Erro interno ao fazer upload da imagem",
    };
  }
}
