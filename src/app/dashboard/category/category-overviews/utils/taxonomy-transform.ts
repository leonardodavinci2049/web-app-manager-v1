/**
 * Utilitários para transformar dados da API de taxonomias em estruturas hierárquicas
 */

import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";
import type { CategoryNode } from "../category-tree.types";

/**
 * Converte dados planos da API em estrutura hierárquica aninhada
 * @param flatData - Array plano de taxonomias da API
 * @returns Array hierárquico de CategoryNode com children aninhados
 */
export function transformTaxonomyToHierarchy(
  flatData: TaxonomyData[],
): CategoryNode[] {
  // Converter dados da API para formato CategoryNode
  const nodes: CategoryNode[] = flatData.map(apiItemToCategoryNode);

  // Criar mapa de nós por ID para busca rápida
  const nodeMap = new Map<string | number, CategoryNode>();
  const rootNodes: CategoryNode[] = [];

  // Primeira passagem: criar mapa de todos os nós
  for (const node of nodes) {
    nodeMap.set(node.id, { ...node, children: [] });
  }

  // Segunda passagem: construir hierarquia
  for (const node of nodes) {
    const currentNode = nodeMap.get(node.id);
    if (!currentNode) continue;

    // Se é nó raiz (parentId é 0 ou null)
    if (!node.parentId || node.parentId === 0) {
      rootNodes.push(currentNode);
    } else {
      // Encontrar nó pai e adicionar como filho
      const parentNode = nodeMap.get(node.parentId);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    }
  }

  // Ordenar nós em cada nível pela ordem especificada
  return sortNodesByOrder(rootNodes);
}

/**
 * Converte um item da API para CategoryNode
 * @param apiItem - Item da API
 * @returns CategoryNode formatado
 */
function apiItemToCategoryNode(apiItem: TaxonomyData): CategoryNode {
  return {
    id: apiItem.ID_TAXONOMY,
    name: apiItem.TAXONOMIA,
    slug: apiItem.SLUG || undefined,
    level: (apiItem.LEVEL || 1) as 1 | 2 | 3,
    parentId: apiItem.PARENT_ID === 0 ? null : apiItem.PARENT_ID,
    quantity: apiItem.QT_RECORDS || undefined,
    isActive: true, // Assumir ativo por padrão (dados virão apenas ativos)
  };
}

/**
 * Ordena nós recursivamente pela propriedade ORDEM da API
 * @param nodes - Array de nós para ordenar
 * @returns Array ordenado
 */
function sortNodesByOrder(nodes: CategoryNode[]): CategoryNode[] {
  // Ordenar nós do nível atual (caso tenha informação de ordem)
  const sortedNodes = nodes.sort((a, b) => {
    // Se não tiver ordem específica, ordenar alfabeticamente
    return a.name.localeCompare(b.name);
  });

  // Ordenar recursivamente os filhos
  for (const node of sortedNodes) {
    if (node.children && node.children.length > 0) {
      node.children = sortNodesByOrder(node.children);
    }
  }

  return sortedNodes;
}

/**
 * Valida se os dados da API estão no formato esperado
 * @param data - Dados para validar
 * @returns true se válidos
 */
export function validateTaxonomyData(data: unknown): data is TaxonomyData[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((item) => {
    return (
      typeof item === "object" &&
      item !== null &&
      "ID_TAXONOMY" in item &&
      "TAXONOMIA" in item &&
      "PARENT_ID" in item &&
      typeof item.ID_TAXONOMY === "number" &&
      typeof item.TAXONOMIA === "string" &&
      typeof item.PARENT_ID === "number"
    );
  });
}

/**
 * Filtra taxonomias por nível específico
 * @param data - Dados das taxonomias
 * @param level - Nível desejado (1, 2 ou 3)
 * @returns Array filtrado
 */
export function filterTaxonomiesByLevel(
  data: TaxonomyData[],
  level: 1 | 2 | 3,
): TaxonomyData[] {
  return data.filter((item) => item.LEVEL === level);
}

/**
 * Conta total de itens em uma estrutura hierárquica
 * @param nodes - Nós da árvore
 * @returns Número total de nós
 */
export function countTotalNodes(nodes: CategoryNode[]): number {
  let count = 0;

  for (const node of nodes) {
    count += 1; // Conta o nó atual
    if (node.children && node.children.length > 0) {
      count += countTotalNodes(node.children); // Conta recursivamente os filhos
    }
  }

  return count;
}

/**
 * Encontra um nó específico na árvore hierárquica
 * @param nodes - Nós da árvore
 * @param id - ID do nó procurado
 * @returns Nó encontrado ou null
 */
export function findNodeById(
  nodes: CategoryNode[],
  id: string | number,
): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Extrai todos os IDs de uma estrutura hierárquica (útil para expandir todos)
 * @param nodes - Nós da árvore
 * @returns Array de IDs
 */
export function extractAllNodeIds(
  nodes: CategoryNode[],
): Array<string | number> {
  const ids: Array<string | number> = [];

  for (const node of nodes) {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      ids.push(...extractAllNodeIds(node.children));
    }
  }

  return ids;
}
