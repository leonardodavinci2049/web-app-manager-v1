"use server";

import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type {
  FindTaxonomyRequest,
  FindTaxonomyResponse,
  TaxonomyData,
} from "@/services/api/taxonomy/types/taxonomy-types";

/**
 * Server Action para buscar taxonomias
 * Esta é a melhor prática para chamadas de API no Next.js 15
 */
export async function searchTaxonomiesAction(
  params: Partial<FindTaxonomyRequest>,
): Promise<{
  success: boolean;
  data?: TaxonomyData[];
  responseInfo?: {
    statusCode: number;
    message: string;
    quantity: number;
    totalPages: number;
  };
  error?: string;
}> {
  try {
    console.log("🔄 [Server Action] Executando busca de taxonomias:", params);

    // Chama o serviço no servidor
    const response: FindTaxonomyResponse =
      await TaxonomyServiceApi.findTaxonomies(params);

    console.log("✅ [Server Action] Resposta recebida:", {
      statusCode: response.statusCode,
      message: response.message,
      quantity: response.quantity,
    });

    // Extrai as taxonomias da resposta
    const taxonomyList = TaxonomyServiceApi.extractTaxonomyList(response);

    // Calcula total de páginas
    const qtdRegistros = params.pe_qt_registros || 20;
    const totalPages = Math.ceil((response.quantity || 0) / qtdRegistros);

    return {
      success: true,
      data: taxonomyList,
      responseInfo: {
        statusCode: response.statusCode,
        message: response.message,
        quantity: response.quantity || 0,
        totalPages,
      },
    };
  } catch (error) {
    console.error("❌ [Server Action] Erro na busca de taxonomias:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido no servidor",
    };
  }
}

/**
 * Server Action para testar conectividade da API
 */
export async function testTaxonomyServiceAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Testa com parâmetros mínimos
    const response = await TaxonomyServiceApi.findTaxonomies({
      pe_qt_registros: 1,
      pe_pagina_id: 0,
    });

    return {
      success: true,
      message: `Serviço funcionando. Status: ${response.statusCode}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro no serviço: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}
