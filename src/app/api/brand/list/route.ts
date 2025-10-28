import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { BrandServiceApi } from "@/services/api/brand/brand-service-api";

const logger = createLogger("BrandListAPI");

/**
 * GET /api/brand/list
 * Fetches list of brands for selection
 */
export async function GET() {
  try {
    // Fetch brands from service
    const response = await BrandServiceApi.findBrands({
      pe_limit: 500,
    });

    // Validate response
    if (!BrandServiceApi.isValidBrandResponse(response)) {
      throw new Error(response.message || "Erro ao carregar marcas");
    }

    // Extract brands list
    const brands = BrandServiceApi.extractBrandList(response);

    return NextResponse.json(
      {
        success: true,
        brands,
        quantity: brands.length,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error fetching brands:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao carregar marcas",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
