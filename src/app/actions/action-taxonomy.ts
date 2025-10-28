"use server";

import { revalidatePath } from "next/cache";
import { createLogger } from "@/lib/logger";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";

const logger = createLogger("TaxonomyActions");

/**
 * Server Action - Create taxonomy relationship (category-product)
 * @param taxonomyId - Taxonomy/Category ID
 * @param productId - Product ID
 * @returns Success or error result
 */
export async function createTaxonomyRelationship(
  taxonomyId: number,
  productId: number,
) {
  try {
    // Call service to create the relationship
    // Backend expects pe_id_record instead of pe_id_produto
    const response = await TaxonomyServiceApi.createTaxonomyRel({
      pe_id_taxonomy: taxonomyId,
      pe_id_record: productId,
    });

    // Validate response
    if (!TaxonomyServiceApi.isValidRelOperationResponse(response)) {
      throw new Error(
        response.message || "Erro ao criar relacionamento taxonomy-produto",
      );
    }

    // Check if operation was successful
    if (!TaxonomyServiceApi.isRelOperationSuccessful(response)) {
      const spResponse =
        TaxonomyServiceApi.extractRelStoredProcedureResponse(response);
      throw new Error(spResponse?.sp_message || "Erro ao criar relacionamento");
    }

    // Revalidate product page to reflect changes
    revalidatePath(`/dashboard/product/${productId}`);
    revalidatePath("/dashboard/product/catalog");

    return {
      success: true,
      message: "Categoria adicionada com sucesso",
    };
  } catch (error) {
    logger.error("Error creating taxonomy relationship:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao adicionar categoria ao produto",
    };
  }
}

/**
 * Server Action - Delete taxonomy relationship (category-product)
 * @param taxonomyId - Taxonomy/Category ID
 * @param productId - Product ID
 * @returns Success or error result
 */
export async function deleteTaxonomyRelationship(
  taxonomyId: number,
  productId: number,
) {
  try {
    // Call service to delete the relationship
    // Backend expects pe_id_record instead of pe_id_produto
    const response = await TaxonomyServiceApi.deleteTaxonomyRel({
      pe_id_taxonomy: taxonomyId,
      pe_id_record: productId,
    });

    // Validate response
    if (!TaxonomyServiceApi.isValidRelOperationResponse(response)) {
      throw new Error(
        response.message || "Erro ao deletar relacionamento taxonomy-produto",
      );
    }

    // Check if operation was successful
    if (!TaxonomyServiceApi.isRelOperationSuccessful(response)) {
      const spResponse =
        TaxonomyServiceApi.extractRelStoredProcedureResponse(response);
      throw new Error(
        spResponse?.sp_message || "Erro ao deletar relacionamento",
      );
    }

    // Revalidate product page to reflect changes
    revalidatePath(`/dashboard/product/${productId}`);
    revalidatePath("/dashboard/product/catalog");

    return {
      success: true,
      message: "Categoria removida com sucesso",
    };
  } catch (error) {
    logger.error("Error deleting taxonomy relationship:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao remover categoria do produto",
    };
  }
}
