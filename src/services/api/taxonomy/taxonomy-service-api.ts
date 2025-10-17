/**
 * Serviço de taxonomias para interagir com a API
 */

import { envs } from "@/core/config";
import { BaseApiService } from "@/lib/axios/base-api-service";
import {
  API_STATUS_CODES,
  TAXONOMY_ENDPOINTS,
} from "@/lib/constants/api-constants";
import type {
  CreateTaxonomyRequest,
  CreateTaxonomyResponse,
  DeleteTaxonomyRequest,
  DeleteTaxonomyResponse,
  FindTaxonomyByIdRequest,
  FindTaxonomyByIdResponse,
  FindTaxonomyMenuRequest,
  FindTaxonomyMenuResponse,
  FindTaxonomyRequest,
  FindTaxonomyResponse,
  StoredProcedureResponse,
  TaxonomyData,
  UpdateTaxonomyRequest,
  UpdateTaxonomyResponse,
} from "./types/taxonomy-types";

/**
 * Serviço para operações relacionadas a taxonomias
 */
export class TaxonomyServiceApi extends BaseApiService {
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
      pe_user_id: "USR-DEFAULT-USER", // Valor padrão
      pe_person_id: 29014, // Valor padrão conforme referência
      ...additionalData,
    };
  }

  /**
   * Endpoint 01 - Busca taxonomias para menu
   * @param params - Parâmetros de busca para menu
   * @returns Promise com lista de taxonomias hierárquica
   */
  static async findTaxonomyMenu(
    params: Partial<FindTaxonomyMenuRequest> = {},
  ): Promise<FindTaxonomyMenuResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        pe_id_tipo: 1, // Valor padrão conforme referência
        pe_parent_id: 0, // Valor padrão - busca da raiz
        ...params,
      });

      const data: FindTaxonomyMenuResponse =
        await instance.post<FindTaxonomyMenuResponse>(
          TAXONOMY_ENDPOINTS.FIND_MENU,
          requestBody,
        );

      // Verifica se a busca foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao buscar taxonomias para menu");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de taxonomias (menu):", error);
      throw error;
    }
  }

  /**
   * Endpoint 02 - Lista taxonomias com paginação e filtros
   * @param params - Parâmetros de busca e paginação
   * @returns Promise com lista de taxonomias
   */
  static async findTaxonomies(
    params: Partial<FindTaxonomyRequest> = {},
  ): Promise<FindTaxonomyResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        pe_id_parent: 0, // Valor padrão - busca da raiz
        pe_id_taxonomy: 0, // Valor padrão - sem filtro específico
        pe_taxonomia: "", // Valor padrão - sem filtro por nome
        pe_flag_inativo: 0, // Valor padrão - apenas ativos
        pe_qt_registros: 20, // Valor padrão - 20 registros por página
        pe_pagina_id: 0, // Valor padrão - primeira página (MySQL começa em 0)
        pe_coluna_id: 2, // Valor padrão - ordenação por nome
        pe_ordem_id: 1, // Valor padrão - ordem crescente
        ...params,
      });

      const data: FindTaxonomyResponse =
        await instance.post<FindTaxonomyResponse>(
          TAXONOMY_ENDPOINTS.FIND,
          requestBody,
        );

      // Verifica se a resposta indica "sem dados encontrados" (código 100422)
      // Aceita tanto "Product not found" quanto "Taxonomy not found" ou mensagens similares
      if (
        data.statusCode === 100422 ||
        (data.message &&
          (data.message.includes("not found") ||
            data.message.includes("não encontrado") ||
            data.message.includes("sem dados")))
      ) {
        return {
          ...data,
          statusCode: API_STATUS_CODES.SUCCESS, // Tratar como sucesso com dados vazios
          data: [
            [],
            {
              fieldCount: 0,
              affectedRows: 0,
              insertId: 0,
              info: "",
              serverStatus: 0,
              warningStatus: 0,
              changedRows: 0,
            },
          ], // Estrutura padrão vazia com metadata correto
        };
      }

      // Verifica se a busca foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao buscar taxonomias");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de taxonomias (busca):", error);
      throw error;
    }
  }

  /**
   * Endpoint 03 - Busca taxonomy por ID
   * @param params - Parâmetros com ID da taxonomy
   * @returns Promise com dados da taxonomy
   */
  static async findTaxonomyById(
    params: Partial<FindTaxonomyByIdRequest> & { pe_id_taxonomy: number },
  ): Promise<FindTaxonomyByIdResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        pe_slug_taxonomy: "", // Valor padrão - busca por ID
        ...params,
      });

      const data: FindTaxonomyByIdResponse =
        await instance.post<FindTaxonomyByIdResponse>(
          TAXONOMY_ENDPOINTS.FIND_BY_ID,
          requestBody,
        );

      // Verifica se a busca foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao buscar taxonomy por ID");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de taxonomy por ID:", error);
      throw error;
    }
  }

  /**
   * Endpoint 04 - Adiciona nova taxonomy
   * @param params - Parâmetros da nova taxonomy
   * @returns Promise com resposta da criação
   */
  static async createTaxonomy(
    params: Partial<CreateTaxonomyRequest> & {
      pe_taxonomia: string;
      pe_slug: string;
    },
  ): Promise<CreateTaxonomyResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        pe_id_tipo: 2, // Valor padrão conforme referência
        pe_parent_id: 0, // Valor padrão - raiz
        pe_level: 1, // Valor padrão - primeiro nível
        ...params,
      });

      const data: CreateTaxonomyResponse =
        await instance.post<CreateTaxonomyResponse>(
          TAXONOMY_ENDPOINTS.CREATE,
          requestBody,
        );

      // Verifica se a criação foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao criar taxonomy");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de criação de taxonomy:", error);
      throw error;
    }
  }

  /**
   * Endpoint 05 - Atualiza taxonomy existente
   * @param params - Parâmetros de atualização da taxonomy
   * @returns Promise com resposta da atualização
   */
  static async updateTaxonomy(
    params: Partial<UpdateTaxonomyRequest> & {
      pe_id_taxonomy: number;
      pe_taxonomia: string;
    },
  ): Promise<UpdateTaxonomyResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        pe_parent_id: 0, // Valor padrão - raiz
        pe_slug: "", // Valor padrão - slug vazio
        pe_path_imagem: "", // Valor padrão - sem imagem
        pe_ordem: 1, // Valor padrão - primeira posição
        pe_meta_title: "", // Valor padrão - sem meta title
        pe_meta_description: "", // Valor padrão - sem meta description
        pe_inativo: 0, // Valor padrão - ativo
        pe_info: "", // Valor padrão - sem informações extras
        ...params,
      });

      const data: UpdateTaxonomyResponse =
        await instance.post<UpdateTaxonomyResponse>(
          TAXONOMY_ENDPOINTS.UPDATE,
          requestBody,
        );

      // Verifica se a atualização foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao atualizar taxonomy");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de atualização de taxonomy:", error);
      throw error;
    }
  }

  /**
   * Endpoint 06 - Exclui taxonomy
   * @param params - Parâmetros com ID da taxonomy a ser excluída
   * @returns Promise com resposta da exclusão
   */
  static async deleteTaxonomy(
    params: Partial<DeleteTaxonomyRequest> & { pe_id_taxonomy: number },
  ): Promise<DeleteTaxonomyResponse> {
    try {
      const instance = new TaxonomyServiceApi();
      const requestBody = TaxonomyServiceApi.buildBasePayload({
        ...params,
      });

      const data: DeleteTaxonomyResponse =
        await instance.post<DeleteTaxonomyResponse>(
          TAXONOMY_ENDPOINTS.DELETE,
          requestBody,
        );

      // Verifica se a exclusão foi bem-sucedida
      if (data.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Erro ao excluir taxonomy");
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de exclusão de taxonomy:", error);
      throw error;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Extrai lista de taxonomias da resposta da API (menu)
   * @param response - Resposta da API
   * @returns Lista de taxonomias ou array vazio
   */
  static extractTaxonomyMenuList(
    response: FindTaxonomyMenuResponse,
  ): TaxonomyData[] {
    return response.data?.[0] ?? [];
  }

  /**
   * Extrai lista de taxonomias da resposta da API (busca)
   * @param response - Resposta da API
   * @returns Lista de taxonomias ou array vazio
   */
  static extractTaxonomyList(response: FindTaxonomyResponse): TaxonomyData[] {
    return response.data?.[0] ?? [];
  }

  /**
   * Extrai dados da taxonomy da resposta da API
   * @param response - Resposta da API
   * @returns Dados da taxonomy ou null
   */
  static extractTaxonomyData(
    response: FindTaxonomyByIdResponse,
  ): TaxonomyData | null {
    return response.data?.[0]?.[0] ?? null;
  }

  /**
   * Extrai resposta da stored procedure
   * @param response - Resposta da API com stored procedure
   * @returns Resposta da stored procedure ou null
   */
  static extractStoredProcedureResponse(
    response:
      | CreateTaxonomyResponse
      | UpdateTaxonomyResponse
      | DeleteTaxonomyResponse,
  ): StoredProcedureResponse | null {
    return response.data?.[0]?.[0] ?? null;
  }

  /**
   * Extrai ID do registro criado/atualizado
   * @param response - Resposta da API
   * @returns ID do registro ou null
   */
  static extractRecordId(
    response:
      | CreateTaxonomyResponse
      | UpdateTaxonomyResponse
      | DeleteTaxonomyResponse,
  ): number | null {
    const spResponse =
      TaxonomyServiceApi.extractStoredProcedureResponse(response);
    return spResponse ? spResponse.sp_return_id : null;
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  /**
   * Valida se a resposta de busca de taxonomias (menu) é válida
   * @param response - Resposta da API
   * @returns true se válida, false caso contrário
   */
  static isValidTaxonomyMenuResponse(
    response: FindTaxonomyMenuResponse,
  ): boolean {
    return (
      response.statusCode === API_STATUS_CODES.SUCCESS &&
      response.data &&
      Array.isArray(response.data[0])
    );
  }

  /**
   * Valida se a resposta de busca de taxonomias é válida
   * @param response - Resposta da API
   * @returns true se válida, false caso contrário
   */
  static isValidTaxonomyResponse(response: FindTaxonomyResponse): boolean {
    return (
      response.statusCode === API_STATUS_CODES.SUCCESS &&
      response.data &&
      Array.isArray(response.data[0])
    );
  }

  /**
   * Valida se a resposta de busca de taxonomy por ID é válida
   * @param response - Resposta da API
   * @returns true se válida, false caso contrário
   */
  static isValidTaxonomyByIdResponse(
    response: FindTaxonomyByIdResponse,
  ): boolean {
    return (
      response.statusCode === API_STATUS_CODES.SUCCESS &&
      response.data &&
      response.data[0] &&
      response.data[0][0] !== undefined
    );
  }

  /**
   * Valida se a resposta de operação (create/update/delete) é válida
   * @param response - Resposta da API
   * @returns true se válida, false caso contrário
   */
  static isValidOperationResponse(
    response:
      | CreateTaxonomyResponse
      | UpdateTaxonomyResponse
      | DeleteTaxonomyResponse,
  ): boolean {
    return (
      response.statusCode === API_STATUS_CODES.SUCCESS &&
      response.data &&
      response.data[0] &&
      response.data[0][0] !== undefined
    );
  }

  /**
   * Verifica se a operação foi bem-sucedida baseado na stored procedure
   * @param response - Resposta da API
   * @returns true se bem-sucedida, false caso contrário
   */
  static isOperationSuccessful(
    response:
      | CreateTaxonomyResponse
      | UpdateTaxonomyResponse
      | DeleteTaxonomyResponse,
  ): boolean {
    const spResponse =
      TaxonomyServiceApi.extractStoredProcedureResponse(response);
    return spResponse ? spResponse.sp_error_id === 0 : false;
  }
}
