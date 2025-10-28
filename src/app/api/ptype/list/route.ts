import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { PtypeServiceApi } from "@/services/api/ptype/ptype-service-api";

const logger = createLogger("PtypeListAPI");

/**
 * GET /api/ptype/list
 * Fetches list of product types for selection
 */
export async function GET() {
  try {
    // Fetch types from service
    const response = await PtypeServiceApi.findPtypes({
      pe_limit: 500,
    });

    // Validate response
    if (!PtypeServiceApi.isValidPtypeResponse(response)) {
      throw new Error(response.message || "Erro ao carregar tipos de produto");
    }

    // Extract types list
    const types = PtypeServiceApi.extractPtypeList(response);

    return NextResponse.json(
      {
        success: true,
        types,
        quantity: types.length,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error fetching product types:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao carregar tipos de produto",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
