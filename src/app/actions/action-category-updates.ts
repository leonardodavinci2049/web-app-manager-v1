"use server";

import { createLogger } from "@/lib/logger";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";

const logger = createLogger("CategoryUpdateActions");

/**
 * Server Action: Update category name
 * @param categoryId - Category ID to update
 * @param name - New category name
 * @returns Success status and error message if any
 */
export async function updateCategoryName(
  categoryId: number,
  name: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    // Validate inputs
    if (!categoryId || categoryId <= 0) {
      return {
        success: false,
        error: "ID da categoria inválido",
      };
    }

    if (!name || !name.trim()) {
      return {
        success: false,
        error: "Nome da categoria não pode ser vazio",
      };
    }

    // Call API service
    const response = await TaxonomyServiceApi.updateTaxonomyName({
      pe_id_taxonomy: categoryId,
      pe_taxonomia: name.trim(),
    });

    // Check if operation was successful
    if (!TaxonomyServiceApi.isOperationSuccessful(response)) {
      const spResponse =
        TaxonomyServiceApi.extractStoredProcedureResponse(response);
      const errorMessage =
        spResponse?.sp_message || "Erro ao atualizar nome da categoria";

      logger.error("API returned error:", { spResponse, errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Extract success message from API response
    const spResponse =
      TaxonomyServiceApi.extractStoredProcedureResponse(response);
    const successMessage =
      spResponse?.sp_message || "Nome da categoria atualizado com sucesso";

    logger.info("Category name updated successfully:", { categoryId, name });

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    logger.error("Error updating category name:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao atualizar nome da categoria";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
