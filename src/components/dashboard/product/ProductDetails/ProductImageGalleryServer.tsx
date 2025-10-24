import { createLogger } from "@/lib/logger";
import { assetsApiService } from "@/services/api-assets/assets-api-service";
import { isApiError } from "@/types/api-assets";

import { ProductImageGalleryRefresh } from "./ProductImageGalleryRefresh";

const logger = createLogger("ProductImageGalleryServer");

interface ProductImageGalleryServerProps {
  productId: number;
  productName: string;
  fallbackImage: string;
}

/**
 * ProductImageGalleryServer - Server Component that fetches gallery images from API
 *
 * This component:
 * 1. Fetches images from the external assets API using the entity-gallery endpoint
 * 2. Transforms the response to extract image URLs
 * 3. Applies fallback image if gallery is empty or error occurs
 * 4. Wraps the client-side ProductImageGallery with refresh functionality
 */
export async function ProductImageGalleryServer({
  productId,
  productName,
  fallbackImage,
}: ProductImageGalleryServerProps) {
  try {
    // Fetch gallery from API
    const galleryResponse = await assetsApiService.getEntityGallery({
      entityType: "PRODUCT",
      entityId: productId.toString(),
    });

    // Check if response is an error
    if (isApiError(galleryResponse)) {
      logger.warn(
        `Failed to fetch gallery for product ${productId}: ${galleryResponse.message}`,
      );
      // Use fallback image on error with refresh wrapper
      return (
        <ProductImageGalleryRefresh
          productId={productId}
          productName={productName}
          fallbackImage={fallbackImage}
          initialImages={[fallbackImage]}
        />
      );
    }

    // Extract image URLs from the response
    // Using 'medium' resolution (400x400) for gallery display
    const galleryImages = galleryResponse.images
      .map((img) => img.urls.medium)
      .filter((url): url is string => url !== undefined);

    // Apply fallback if gallery is empty
    if (galleryImages.length === 0) {
      logger.debug(
        `No images found in gallery for product ${productId}, using fallback`,
      );
      return (
        <ProductImageGalleryRefresh
          productId={productId}
          productName={productName}
          fallbackImage={fallbackImage}
          initialImages={fallbackImage ? [fallbackImage] : []}
        />
      );
    }

    logger.debug(
      `Successfully fetched ${galleryImages.length} images for product ${productId}`,
    );

    return (
      <ProductImageGalleryRefresh
        productId={productId}
        productName={productName}
        fallbackImage={fallbackImage}
        initialImages={galleryImages}
      />
    );
  } catch (error) {
    logger.error(
      `Unexpected error fetching gallery for product ${productId}:`,
      error,
    );
    // Use fallback image on unexpected error with refresh wrapper
    return (
      <ProductImageGalleryRefresh
        productId={productId}
        productName={productName}
        fallbackImage={fallbackImage}
        initialImages={[fallbackImage]}
      />
    );
  }
}
