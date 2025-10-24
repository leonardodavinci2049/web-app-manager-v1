import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createLogger } from "@/lib/logger";
import { assetsApiService } from "@/services/api-assets/assets-api-service";
import { isApiError } from "@/types/api-assets";

const logger = createLogger("api/product-gallery/refresh");

// Request schema validation
const refreshGallerySchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

/**
 * POST /api/product-gallery/refresh
 *
 * Refresh product gallery images by fetching from the external API
 * This endpoint is called from ProductImageGalleryRefresh component
 * after a successful image upload to get the updated gallery
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = refreshGallerySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request parameters",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId } = validation.data;

    logger.debug(`Refreshing gallery for product: ${productId}`);

    // Fetch updated gallery from external API
    const galleryResponse = await assetsApiService.getEntityGallery({
      entityType: "PRODUCT",
      entityId: productId,
    });

    // Check if response is an error
    if (isApiError(galleryResponse)) {
      logger.warn(
        `Failed to fetch gallery for product ${productId}: ${galleryResponse.message}`,
      );
      return NextResponse.json(
        {
          success: false,
          error: galleryResponse.message,
        },
        { status: 500 },
      );
    }

    // Extract image URLs using medium resolution
    const images = galleryResponse.images
      .map((img) => img.urls.medium)
      .filter((url): url is string => url !== undefined);

    logger.debug(
      `Successfully fetched ${images.length} images for product ${productId}`,
    );

    return NextResponse.json({
      success: true,
      images,
      totalImages: galleryResponse.totalImages,
    });
  } catch (error) {
    logger.error("Error refreshing gallery:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
