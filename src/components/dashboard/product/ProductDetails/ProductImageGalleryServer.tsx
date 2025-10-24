import { createLogger } from "@/lib/logger";
import { assetsApiService } from "@/services/api-assets/assets-api-service";
import { isApiError } from "@/types/api-assets";
import { ProductImageGallery } from "./ProductImageGallery";

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
 * 4. Renders the client-side ProductImageGallery component with the loaded images
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
      // Use fallback image on error
      return (
        <ProductImageGallery
          images={[fallbackImage]}
          productName={productName}
          productId={productId}
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
        <ProductImageGallery
          images={[fallbackImage]}
          productName={productName}
          productId={productId}
        />
      );
    }

    logger.debug(
      `Successfully fetched ${galleryImages.length} images for product ${productId}`,
    );

    return (
      <ProductImageGallery
        images={galleryImages}
        productName={productName}
        productId={productId}
      />
    );
  } catch (error) {
    logger.error(
      `Unexpected error fetching gallery for product ${productId}:`,
      error,
    );
    // Use fallback image on unexpected error
    return (
      <ProductImageGallery
        images={[fallbackImage]}
        productName={productName}
        productId={productId}
      />
    );
  }
}
