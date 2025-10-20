"use server";

import { createLogger } from "@/lib/logger";
import { ProductServiceApi } from "@/services/api/product/product-service-api";
import type {
  FindProductsRequest,
  ProductListItem,
} from "@/services/api/product/types/product-types";
import type { Product } from "@/types/types";

const logger = createLogger("ProductActions");

/**
 * Convert API product data to application format
 */
function convertApiProductToAppProduct(
  apiProduct: ProductListItem,
  index?: number,
): Product {
  // Safely handle potential null/undefined values
  const productId = apiProduct?.ID_PRODUTO;
  const id =
    productId?.toString() || `temp-${Date.now()}-${index || Math.random()}`;
  const name = apiProduct?.PRODUTO || "Produto sem nome";
  const ref = apiProduct?.REF || "";
  const sku = ref || `SKU-${id}`;
  const image =
    apiProduct?.PATH_IMAGEM || "/images/product/default-product.png";
  // Convert string price to number
  const normalPrice = parseFloat(apiProduct?.VL_VAREJO || "0") || 0;
  const stock = apiProduct?.ESTOQUE_LOJA || 0;
  const category = apiProduct?.MARCA_NOME || "Sem Categoria";

  return {
    id,
    name,
    sku,
    image,
    normalPrice,
    promotionalPrice: undefined, // API doesn't have promotional price in list
    stock,
    category,
    createdAt: new Date(), // API doesn't have creation date in list
  };
}

/**
 * Interface for search parameters
 */
export interface ProductSearchParams {
  searchTerm?: string;
  categoryId?: number;
  onlyInStock?: boolean;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

/**
 * Server Action to fetch products from API
 */
export async function fetchProducts(params: ProductSearchParams = {}): Promise<{
  success: boolean;
  products: Product[];
  total: number;
  error?: string;
}> {
  try {
    logger.info("Fetching products with params:", params);

    // Build API request parameters - only include meaningful values
    const apiParams: Partial<FindProductsRequest> = {
      pe_flag_inativo: 0, // Only active products
      pe_qt_registros: params.perPage || 20,
      pe_pagina_id: params.page || 1,
      pe_coluna_id: 1, // Sort column
      pe_ordem_id: params.sortBy?.includes("desc") ? 2 : 1, // 1=ASC, 2=DESC
    };

    // Only include search term if not empty
    if (params.searchTerm && params.searchTerm.trim() !== "") {
      apiParams.pe_produto = params.searchTerm.trim();
    }

    // Only include category filter if it's a positive number
    if (params.categoryId && params.categoryId > 0) {
      apiParams.pe_id_taxonomy = params.categoryId;
    }

    // Only include stock filter if explicitly requested
    if (params.onlyInStock) {
      apiParams.pe_flag_estoque = 1;
    }

    // Call API service
    const response = await ProductServiceApi.findProducts(apiParams);

    // Validate response
    if (!ProductServiceApi.isValidProductListResponse(response)) {
      logger.error("Invalid API response:", response);
      return {
        success: false,
        products: [],
        total: 0,
        error: "Resposta inválida da API",
      };
    }

    // Extract products from response
    const apiProducts = ProductServiceApi.extractProductList(response);

    // Validate that we have a valid array
    if (!Array.isArray(apiProducts)) {
      logger.error("API response does not contain a valid product array:", {
        apiProducts,
      });
      return {
        success: false,
        products: [],
        total: 0,
        error: "Formato de resposta inválido da API",
      };
    }

    // Convert to application format with error handling
    const products = apiProducts
      .filter((product) => product && typeof product === "object") // Filter out null/invalid products
      .map((product, index) => {
        try {
          return convertApiProductToAppProduct(product, index);
        } catch (error) {
          logger.error("Error converting product:", { product, error });
          return null;
        }
      })
      .filter((product): product is Product => product !== null); // Filter out failed conversions

    logger.info(
      `Successfully fetched ${products.length} products from ${apiProducts.length} API products`,
    );

    return {
      success: true,
      products,
      total: response.quantity || products.length,
      error: undefined,
    };
  } catch (error) {
    logger.error("Error fetching products:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao buscar produtos";

    return {
      success: false,
      products: [],
      total: 0,
      error: errorMessage,
    };
  }
}

/**
 * Server Action to fetch products with advanced filters
 */
export async function fetchProductsWithFilters(
  searchTerm: string = "",
  categoryId: string = "all",
  onlyInStock: boolean = false,
  sortBy: string = "newest",
  page: number = 1,
  perPage: number = 20,
): Promise<{
  success: boolean;
  products: Product[];
  total: number;
  error?: string;
}> {
  try {
    // Convert category filter - only include if not "all"
    const params: ProductSearchParams = {
      onlyInStock,
      sortBy,
      page,
      perPage,
    };

    // Only include search term if not empty
    if (searchTerm.trim() !== "") {
      params.searchTerm = searchTerm.trim();
    }

    // Only include category if not "all" and is a valid number
    if (categoryId !== "all") {
      const numericCategoryId = parseInt(categoryId, 10);
      if (!Number.isNaN(numericCategoryId) && numericCategoryId > 0) {
        params.categoryId = numericCategoryId;
      }
    }

    return await fetchProducts(params);
  } catch (error) {
    logger.error("Error in fetchProductsWithFilters:", error);

    return {
      success: false,
      products: [],
      total: 0,
      error: "Erro ao buscar produtos com filtros",
    };
  }
}
