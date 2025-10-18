"use server";

import { type ZodError, z } from "zod";
import {
  ApiConnectionError,
  ApiNotFoundError,
  ApiServerError,
  ApiValidationError,
} from "@/lib/axios/base-api-service";
import { createLogger } from "@/lib/logger";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type {
  FindTaxonomyResponse,
  TaxonomyData,
} from "@/services/api/taxonomy/types/taxonomy-types";
import { TaxonomyNotFoundError } from "@/services/api/taxonomy/types/taxonomy-types";

const logger = createLogger("TaxonomyAction");

/**
 * Schema de validação para parâmetros de busca
 */
const SearchTaxonomiesSchema = z.object({
  pe_id_parent: z.number().int().optional(),
  pe_id_taxonomy: z.number().int().min(0).optional(),
  pe_taxonomia: z.string().max(255).optional(),
  pe_flag_inativo: z.number().int().min(0).max(1).optional(),
  pe_qt_registros: z.number().int().min(1).max(100).optional(),
  pe_pagina_id: z.number().int().min(0).optional(),
  pe_coluna_id: z.number().int().optional(),
  pe_ordem_id: z.number().int().min(0).max(1).optional(),
});

/**
 * Tipo de retorno aprimorado com errorType e retryable
 */
interface SearchTaxonomiesActionResult {
  success: boolean;
  data?: TaxonomyData[];
  responseInfo?: {
    statusCode: number;
    message: string;
    quantity: number;
    totalPages: number;
  };
  error?: string;
  errorType?:
    | "VALIDATION_ERROR"
    | "CONNECTION_ERROR"
    | "NOT_FOUND"
    | "SERVER_ERROR"
    | "INTERNAL_ERROR";
  retryable?: boolean;
  validationErrors?: z.ZodIssue[];
}

/**
 * Server Action para buscar taxonomias
 * Esta é a melhor prática para chamadas de API no Next.js 15
 *
 * @param rawParams - Parâmetros de busca (serão validados)
 * @returns Resultado da busca com informações de erro detalhadas
 */
export async function searchTaxonomiesAction(
  rawParams: unknown,
): Promise<SearchTaxonomiesActionResult> {
  try {
    // Validação de input com Zod
    const params = SearchTaxonomiesSchema.parse(rawParams);

    // Chama o serviço no servidor
    const response: FindTaxonomyResponse =
      await TaxonomyServiceApi.findTaxonomies(params);

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
    // Tratamento específico para erro de validação Zod
    if (error instanceof z.ZodError) {
      const zodError = error as ZodError;
      logger.warn("Parâmetros inválidos na busca de taxonomias", {
        errors: zodError.issues,
      });
      return {
        success: false,
        error: "Parâmetros inválidos fornecidos",
        errorType: "VALIDATION_ERROR",
        retryable: false,
        validationErrors: zodError.issues,
      };
    }

    // Tratamento para TaxonomyNotFoundError (não é erro real, é resultado vazio)
    if (error instanceof TaxonomyNotFoundError) {
      logger.info("Nenhuma taxonomy encontrada com os parâmetros fornecidos");
      return {
        success: true,
        data: [],
        responseInfo: {
          statusCode: 100200,
          message: "Nenhum resultado encontrado",
          quantity: 0,
          totalPages: 0,
        },
      };
    }

    // Tratamento para erro de conexão
    if (error instanceof ApiConnectionError) {
      logger.error("Erro de conexão com a API", { error });
      return {
        success: false,
        error: "Não foi possível conectar à API. Tente novamente.",
        errorType: "CONNECTION_ERROR",
        retryable: true,
      };
    }

    // Tratamento para erro de validação da API
    if (error instanceof ApiValidationError) {
      logger.warn("Erro de validação da API", { error });
      return {
        success: false,
        error: error.message,
        errorType: "VALIDATION_ERROR",
        retryable: false,
        validationErrors: error.validationErrors
          ? Object.entries(error.validationErrors).map(([field, errors]) => ({
              path: [field],
              message: errors.join(", "),
              code: "custom" as const,
            }))
          : undefined,
      };
    }

    // Tratamento para erro de não encontrado
    if (error instanceof ApiNotFoundError) {
      logger.info("Recurso não encontrado", { error });
      return {
        success: true,
        data: [],
        responseInfo: {
          statusCode: 100200,
          message: "Nenhum resultado encontrado",
          quantity: 0,
          totalPages: 0,
        },
      };
    }

    // Tratamento para erro do servidor
    if (error instanceof ApiServerError) {
      logger.error("Erro no servidor da API", {
        error,
        statusCode: error.statusCode,
      });
      return {
        success: false,
        error: "Erro no servidor. Por favor, tente novamente mais tarde.",
        errorType: "SERVER_ERROR",
        retryable: true,
      };
    }

    // Erro não esperado - log completo para debugging
    logger.error("Erro inesperado em searchTaxonomiesAction", {
      error,
      errorName: error instanceof Error ? error.name : "unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: "Erro interno do servidor",
      errorType: "INTERNAL_ERROR",
      retryable: false,
    };
  }
}

/**
 * Health Check para conectividade da API de Taxonomia
 *
 * NOTA: Esta função é apenas para desenvolvimento/monitoring.
 * Considera movê-la para um endpoint de health check dedicado em produção.
 *
 * @returns Status da API com informações detalhadas
 */
export async function checkTaxonomyApiHealth(): Promise<{
  success: boolean;
  message: string;
  details?: {
    statusCode: number;
    responseTime?: number;
    timestamp: string;
  };
  error?: string;
  errorType?: string;
}> {
  const startTime = Date.now();

  try {
    // Testa com parâmetros mínimos
    const response = await TaxonomyServiceApi.findTaxonomies({
      pe_qt_registros: 1,
      pe_pagina_id: 0,
    });

    const responseTime = Date.now() - startTime;

    return {
      success: true,
      message: "API de taxonomia está operacional",
      details: {
        statusCode: response.statusCode,
        responseTime,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Identifica tipo de erro
    let errorType = "UNKNOWN_ERROR";
    let errorMessage = "Erro desconhecido";

    if (error instanceof ApiConnectionError) {
      errorType = "CONNECTION_ERROR";
      errorMessage = error.message;
    } else if (error instanceof ApiServerError) {
      errorType = "SERVER_ERROR";
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    logger.error("Health check da API de taxonomia falhou", {
      error,
      errorType,
      responseTime,
    });

    return {
      success: false,
      message: "API de taxonomia não está respondendo",
      error: errorMessage,
      errorType,
      details: {
        statusCode: 0,
        responseTime,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
