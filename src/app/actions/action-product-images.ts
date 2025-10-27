"use server";

import { createLogger } from "@/lib/logger";
import { ProductServiceApi } from "@/services/api/product/product-service-api";
import { assetsApiService } from "@/services/api-assets/assets-api-service";
import type { FileAsset } from "@/types/api-assets";
import { isApiError } from "@/types/api-assets";
import { uploadFileAction } from "./action-test-assets";

const logger = createLogger("action-product-images");

/**
 * Helper function to update product PATH_IMAGEM only if it's currently empty
 * This ensures we don't override existing main images
 *
 * @param productId - Product ID to update
 * @param imageUrl - New image URL to set as PATH_IMAGEM
 */
async function updateProductImagePathIfEmpty(
  productId: number,
  imageUrl: string,
): Promise<void> {
  try {
    // First, fetch current product data to check if PATH_IMAGEM is empty
    const productResponse = await ProductServiceApi.findProductById({
      pe_type_business: 1,
      pe_id_produto: productId,
      pe_slug_produto: "",
    });

    // Check if we got a valid response
    if (!ProductServiceApi.isValidProductDetailResponse(productResponse)) {
      logger.warn(
        `Could not fetch product ${productId} for PATH_IMAGEM check:`,
        productResponse.message,
      );
      return;
    }

    // Extract product detail
    const product = ProductServiceApi.extractProductDetail(productResponse);
    if (!product) {
      logger.warn(`Product ${productId} not found in response`);
      return;
    }

    // Check if PATH_IMAGEM is empty or null
    const currentPathImagem = product.PATH_IMAGEM;
    const isPathImagemEmpty =
      !currentPathImagem ||
      currentPathImagem.trim() === "" ||
      currentPathImagem === "null" ||
      currentPathImagem === "undefined";

    if (!isPathImagemEmpty) {
      logger.debug(
        `Product ${productId} already has PATH_IMAGEM: ${currentPathImagem}. Skipping update.`,
      );
      return;
    }

    // PATH_IMAGEM is empty, update it with the new image URL
    /*     logger.debug(
      `Updating PATH_IMAGEM for product ${productId} with URL: ${imageUrl}`,
    ); */

    const updateResponse = await ProductServiceApi.updateProductImagePath({
      pe_id_produto: productId,
      pe_path_imagem: imageUrl,
    });

    // Check if update was successful
    if (ProductServiceApi.isOperationSuccessful(updateResponse)) {
      // logger.debug(`Successfully updated PATH_IMAGEM for product ${productId}`);
    } else {
      const spResponse =
        ProductServiceApi.extractStoredProcedureResponse(updateResponse);
      logger.warn(
        `Failed to update PATH_IMAGEM for product ${productId}:`,
        spResponse?.sp_message || updateResponse.message,
      );
    }
  } catch (error) {
    logger.error(`Error updating PATH_IMAGEM for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Server Actions for Product Image Upload
 * These actions handle file uploads for products using the external Assets API
 */

interface UploadProductImageResponse {
  success: boolean;
  data?: FileAsset;
  error?: string;
}

interface DeleteProductImageResponse {
  success: boolean;
  error?: string;
}

interface SetPrimaryImageResponse {
  success: boolean;
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

    // Debug info removed for cleaner console output

    // Create FormData exactly like test page does
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("entityType", "PRODUCT");
    uploadFormData.append("entityId", productId);
    if (tagsString) uploadFormData.append("tags", tagsString);
    if (description) uploadFormData.append("description", description);
    if (altText) uploadFormData.append("altText", altText);

    // FormData logging removed for cleaner console output

    // Call the test assets action that we know works
    const result = await uploadFileAction(uploadFormData);

    // If upload was successful, try to update product PATH_IMAGEM if it's empty
    if (result.success && result.data?.urls?.medium) {
      try {
        await updateProductImagePathIfEmpty(
          Number(productId),
          result.data.urls.medium,
        );
      } catch (pathUpdateError) {
        // Log error but don't fail the upload - image was successfully uploaded
        logger.warn(
          `Failed to update PATH_IMAGEM for product ${productId}:`,
          pathUpdateError,
        );
        // Upload was successful, just PATH_IMAGEM update failed
        // This is not critical enough to fail the entire operation
      }
    }

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

/**
 * Delete image from a product gallery
 * Used by ProductImageGallery component to delete product images
 *
 * @param imageId UUID of the image to delete
 */
export async function deleteProductImageAction(
  imageId: string,
): Promise<DeleteProductImageResponse> {
  try {
    // Validate required fields
    if (!imageId || typeof imageId !== "string") {
      return {
        success: false,
        error: "ID da imagem é obrigatório",
      };
    }

    // Debug info removed for cleaner console output

    // Call the assets API to delete the file
    const result = await assetsApiService.deleteFile({ id: imageId });

    // Check if response is an error
    if (isApiError(result)) {
      logger.warn(`Failed to delete image ${imageId}: ${result.message}`);
      return {
        success: false,
        error: Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Erro ao excluir imagem",
      };
    }

    // Success logged via return value
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Delete product image action error:", error);
    return {
      success: false,
      error: "Erro interno ao excluir imagem",
    };
  }
}

/**
 * Set image as primary for a product
 * Used by ProductImageGallery component to promote images to primary
 *
 * @param productId Product ID
 * @param imageId UUID of the image to set as primary
 */
export async function setPrimaryImageAction(
  productId: string,
  imageId: string,
): Promise<SetPrimaryImageResponse> {
  try {
    // Validate required fields
    if (!productId || !imageId) {
      return {
        success: false,
        error: "ID do produto e da imagem são obrigatórios",
      };
    }

    // Debug info removed for cleaner console output

    // Call the assets API to set primary image
    const result = await assetsApiService.setPrimaryImage({
      entityType: "PRODUCT",
      entityId: productId,
      assetId: imageId,
      displayOrder: 1,
    });

    // Check if response is an error
    if (isApiError(result)) {
      logger.warn(`Failed to set primary image ${imageId}: ${result.message}`);
      return {
        success: false,
        error: Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Erro ao definir imagem principal",
      };
    }

    // Success logged via return value
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Set primary image action error:", error);
    return {
      success: false,
      error: "Erro interno ao definir imagem principal",
    };
  }
}
