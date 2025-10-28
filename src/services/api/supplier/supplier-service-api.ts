/**
 * Serviço de fornecedores para interagir com a API
 */

import { envs } from "@/core/config";
import { BaseApiService } from "@/lib/axios/base-api-service";
import {
  API_STATUS_CODES,
  isApiError,
  isApiSuccess,
  SUPPLIER_ENDPOINTS,
} from "@/lib/constants/api-constants";
import { createLogger } from "@/lib/logger";

import type {
  FindSupplierRequest,
  FindSupplierResponse,
  StoredProcedureResponse,
  SupplierData,
} from "./types/supplier-types";

import { FindSupplierSchema } from "./validation/supplier-schemas";

// Logger instance
const logger = createLogger("SupplierService");

/**
 * Serviço para operações relacionadas a fornecedores
 */
export class SupplierServiceApi extends BaseApiService {
  /**
   * Build base payload with environment variables
   */
  private static buildBasePayload(
    additionalData: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      pe_app_id: envs.APP_ID,
      pe_system_client_id: envs.SYSTEM_CLIENT_ID,
      pe_store_id: envs.STORE_ID,
      pe_organization_id: envs.ORGANIZATION_ID,
      pe_member_id: envs.MEMBER_ID,
      pe_user_id: envs.USER_ID,
      pe_person_id: envs.PERSON_ID,
      ...additionalData,
    };
  }

  /**
   * Endpoint - Listar Fornecedores v2
   * @param params - Parâmetros de busca e filtros
   * @returns Promise com lista de fornecedores
   */
  static async findSuppliers(
    params: Partial<FindSupplierRequest> = {},
  ): Promise<FindSupplierResponse> {
    try {
      const validatedParams = SupplierServiceApi.validateSearchParams(params);
      const requestBody =
        SupplierServiceApi.buildSearchPayload(validatedParams);

      const response =
        await SupplierServiceApi.executeSupplierSearch(requestBody);

      return SupplierServiceApi.handleSearchResponse(response);
    } catch (error) {
      logger.error("Erro no serviço de fornecedores (busca)", error);
      throw error;
    }
  }

  /**
   * Valida parâmetros de busca
   * @private
   */
  private static validateSearchParams(
    params: Partial<FindSupplierRequest>,
  ): Partial<FindSupplierRequest> {
    try {
      return FindSupplierSchema.partial().parse(params);
    } catch (error) {
      logger.error("Erro na validação de parâmetros de busca", error);
      throw error;
    }
  }

  /**
   * Constrói payload de busca com valores padrão
   * @private
   */
  private static buildSearchPayload(
    params: Partial<FindSupplierRequest>,
  ): Record<string, unknown> {
    const payload = SupplierServiceApi.buildBasePayload({
      pe_id_fornecedor: 0, // Valor padrão - sem filtro específico
      pe_fornecedor: "", // Valor padrão - sem filtro por nome
      pe_limit: 100, // Valor padrão - 100 registros
      ...params,
    });

    return payload;
  }

  /**
   * Executa busca de fornecedores na API
   * @private
   */
  private static async executeSupplierSearch(
    requestBody: Record<string, unknown>,
  ): Promise<FindSupplierResponse> {
    const instance = new SupplierServiceApi();
    return await instance.post<FindSupplierResponse>(
      SUPPLIER_ENDPOINTS.FIND_ALL,
      requestBody,
    );
  }

  /**
   * Trata resposta da busca de fornecedores
   * @private
   */
  private static handleSearchResponse(
    data: FindSupplierResponse,
  ): FindSupplierResponse {
    // Verifica se é código de resultado vazio ou não encontrado
    if (
      data.statusCode === API_STATUS_CODES.EMPTY_RESULT ||
      data.statusCode === API_STATUS_CODES.NOT_FOUND ||
      data.statusCode === API_STATUS_CODES.UNPROCESSABLE
    ) {
      return {
        ...data,
        statusCode: API_STATUS_CODES.SUCCESS,
        quantity: 0,
        data: [
          [],
          [
            {
              sp_return_id: 0,
              sp_message: "Nenhum fornecedor encontrado",
              sp_error_id: 0,
            },
          ],
          {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 0,
            info: "",
            serverStatus: 0,
            warningStatus: 0,
            changedRows: 0,
          },
        ],
      };
    }

    // Verifica se a busca foi bem-sucedida usando função utilitária
    if (isApiError(data.statusCode)) {
      throw new Error(data.message || "Erro ao buscar fornecedores");
    }

    return data;
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Extrai lista de fornecedores da resposta da API
   * @param response - Resposta da API
   * @returns Lista de fornecedores ou array vazio
   */
  static extractSupplierList(response: FindSupplierResponse): SupplierData[] {
    return response.data?.[0] ?? [];
  }

  /**
   * Extrai resposta da stored procedure
   * @param response - Resposta da API com stored procedure
   * @returns Resposta da stored procedure ou null
   */
  static extractStoredProcedureResponse(
    response: FindSupplierResponse,
  ): StoredProcedureResponse | null {
    return response.data?.[1]?.[0] ?? null;
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  /**
   * Valida se a resposta de busca de fornecedores é válida
   * @param response - Resposta da API
   * @returns true se válida, false caso contrário
   */
  static isValidSupplierResponse(response: FindSupplierResponse): boolean {
    return (
      isApiSuccess(response.statusCode) &&
      response.data &&
      Array.isArray(response.data[0])
    );
  }

  /**
   * Verifica se a operação foi bem-sucedida baseado na stored procedure
   * @param response - Resposta da API
   * @returns true se bem-sucedida, false caso contrário
   */
  static isOperationSuccessful(response: FindSupplierResponse): boolean {
    const spResponse =
      SupplierServiceApi.extractStoredProcedureResponse(response);
    return spResponse ? spResponse.sp_error_id === 0 : false;
  }
}
