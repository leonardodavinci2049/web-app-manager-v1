"use server";

/**
 * Server Actions para gerenciamento de categorias (taxonomias)
 *
 * Este arquivo contém Server Actions que interagem com o serviço de taxonomias
 * seguindo os padrões de segurança e arquitetura do projeto.
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createLogger } from "@/lib/logger";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

const logger = createLogger("ActionCategories");

/**
 * Interface para parâmetros de busca de categorias
 */
export interface FindCategoriesParams {
  searchTerm?: string;
  searchType?: "name" | "id";
  sortColumn?: number;
  sortOrder?: number;
  filterStatus?: number;
  page?: number;
  perPage?: number;
  parentId?: number;
}

/**
 * Interface para resposta de busca de categorias
 */
export interface FindCategoriesResponse {
  success: boolean;
  data: TaxonomyData[];
  hasMore: boolean;
  total: number;
  error?: string;
}

/**
 * Busca categorias com filtros e paginação
 *
 * @param params - Parâmetros de busca
 * @returns Resultado da busca com dados das categorias
 */
export async function findCategories(
  params: FindCategoriesParams = {},
): Promise<FindCategoriesResponse> {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      logger.error("Usuário não autenticado");
      return {
        success: false,
        data: [],
        hasMore: false,
        total: 0,
        error: "Usuário não autenticado",
      };
    }

    // Extrair parâmetros com valores padrão
    const {
      searchTerm = "",
      searchType = "name",
      sortColumn = 2, // Ordenar por nome (coluna 2)
      sortOrder = 1, // Ordem crescente
      filterStatus = 0, // Apenas ativos
      page = 0, // Página inicial (MySQL começa em 0)
      perPage = 20,
      parentId = -1, // Buscar todos os níveis
    } = params;

    // Construir parâmetros da API baseado no tipo de busca
    const apiParams: Record<string, unknown> = {
      pe_id_parent: parentId,
      pe_flag_inativo: filterStatus,
      pe_qt_registros: perPage,
      pe_pagina_id: page,
      pe_coluna_id: sortColumn,
      pe_ordem_id: sortOrder,
    };

    // Adicionar parâmetro de busca baseado no tipo
    if (searchTerm) {
      if (searchType === "id") {
        // Busca por ID
        const idNumber = Number.parseInt(searchTerm, 10);
        if (!Number.isNaN(idNumber)) {
          apiParams.pe_id_taxonomy = idNumber;
          apiParams.pe_taxonomia = "";
        } else {
          // ID inválido, retornar vazio
          return {
            success: true,
            data: [],
            hasMore: false,
            total: 0,
          };
        }
      } else {
        // Busca por nome
        apiParams.pe_taxonomia = searchTerm;
        apiParams.pe_id_taxonomy = 0;
      }
    } else {
      // Sem busca, definir valores padrão
      apiParams.pe_taxonomia = "";
      apiParams.pe_id_taxonomy = 0;
    }

    // Chamar serviço da API
    const response = await TaxonomyServiceApi.findTaxonomies(apiParams);

    // Extrair lista de taxonomias
    const categories = TaxonomyServiceApi.extractTaxonomyList(response);

    // Verificar se há mais páginas
    // Se retornou a quantidade solicitada, provavelmente há mais
    const hasMore = categories.length === perPage;

    logger.info(`Categorias carregadas: ${categories.length}, página: ${page}`);

    return {
      success: true,
      data: categories,
      hasMore,
      total: response.quantity || categories.length,
    };
  } catch (error) {
    logger.error("Erro ao buscar categorias", error);
    return {
      success: false,
      data: [],
      hasMore: false,
      total: 0,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao buscar categorias",
    };
  }
}

/**
 * Busca uma categoria específica por ID
 *
 * @param id - ID da categoria
 * @returns Dados da categoria ou null
 */
export async function findCategoryById(
  id: number,
): Promise<TaxonomyData | null> {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      logger.error("Usuário não autenticado");
      return null;
    }

    // Chamar serviço da API
    const response = await TaxonomyServiceApi.findTaxonomyById({
      pe_id_taxonomy: id,
    });

    // Extrair dados da taxonomia
    const category = TaxonomyServiceApi.extractTaxonomyData(response);

    return category;
  } catch (error) {
    logger.error(`Erro ao buscar categoria ID ${id}`, error);
    return null;
  }
}

/**
 * Busca o nome da categoria pai
 *
 * @param parentId - ID da categoria pai
 * @returns Nome da categoria pai ou "Raiz"
 */
export async function getCategoryParentName(parentId: number): Promise<string> {
  if (parentId === 0 || parentId === null) {
    return "Raiz";
  }

  try {
    const parent = await findCategoryById(parentId);
    return parent?.TAXONOMIA || `ID ${parentId}`;
  } catch (error) {
    logger.error(`Erro ao buscar nome da categoria pai ${parentId}`, error);
    return `ID ${parentId}`;
  }
}
