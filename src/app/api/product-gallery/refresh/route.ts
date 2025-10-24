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
 *
 * Images are sorted by:
 * 1. isPrimary (primary images first)
 * 2. displayOrder (ascending)
 * 3. uploadedAt (newest first)
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

    // Debug info removed for cleaner console output

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

    // Sort images: primary first, then by displayOrder, then by upload date
    const sortedImages = [...galleryResponse.images].sort((a, b) => {
      // Primary images first
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;

      // Then by display order
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }

      // Finally by upload date (newest first)
      return (
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    });

    // Transform to gallery image structure with IDs from sorted images
    const images = sortedImages
      .map((img) => ({
        id: img.id,
        url: img.urls.medium,
        isPrimary: img.isPrimary,
      }))
      .filter(
        (img): img is { id: string; url: string; isPrimary: boolean } =>
          img.url !== undefined,
      );

    // Debug info removed for cleaner console output

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
