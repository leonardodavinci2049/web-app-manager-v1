import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";

const logger = createLogger("TaxonomyMenuAPI");

/**
 * GET /api/taxonomy/menu
 * Fetches taxonomy menu structure for category selection
 */
export async function GET() {
  try {
    // Fetch taxonomy menu from service
    const response = await TaxonomyServiceApi.findTaxonomyMenu({
      pe_id_tipo: 1,
      pe_parent_id: 0,
    });

    // Validate response
    if (!TaxonomyServiceApi.isValidTaxonomyMenuResponse(response)) {
      throw new Error(
        response.message || "Erro ao carregar menu de categorias",
      );
    }

    // Extract categories
    const categories = TaxonomyServiceApi.extractTaxonomyMenuList(response);

    return NextResponse.json(
      {
        success: true,
        categories,
        quantity: categories.length,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error fetching taxonomy menu:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao carregar categorias",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
