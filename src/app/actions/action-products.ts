"use server";

import { createLogger } from "@/lib/logger";
import { ProductServiceApi } from "@/services/api/product/product-service-api";
import type {
  FindProductsRequest,
  ProductListItem,
} from "@/services/api/product/types/product-types";
import type { Product } from "@/types/types";
import { getValidImageUrl } from "@/utils/image-utils";

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
  const image = getValidImageUrl(apiProduct?.PATH_IMAGEM);
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
 * Map sortBy option to API parameters
 */
function mapSortToApiParams(sortBy?: string): {
  pe_coluna_id: number;
  pe_ordem_id: number;
} {
  switch (sortBy) {
    case "name-asc":
      return { pe_coluna_id: 1, pe_ordem_id: 1 }; // Nome A-Z
    case "name-desc":
      return { pe_coluna_id: 1, pe_ordem_id: 2 }; // Nome Z-A
    case "newest":
      return { pe_coluna_id: 2, pe_ordem_id: 2 }; // Mais Recente
    case "price-asc":
      return { pe_coluna_id: 3, pe_ordem_id: 1 }; // Menor Preço
    case "price-desc":
      return { pe_coluna_id: 3, pe_ordem_id: 2 }; // Maior Preço
    default:
      return { pe_coluna_id: 1, pe_ordem_id: 1 }; // Default: Nome A-Z
  }
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

    // Map sort option to API parameters
    const sortParams = mapSortToApiParams(params.sortBy);

    // Build API request parameters - only include meaningful values
    // Note: MariaDB pagination starts at 0, so we convert 1-based to 0-based
    const apiParams: Partial<FindProductsRequest> = {
      pe_flag_inativo: 0, // Only active products
      pe_qt_registros: params.perPage || 20,
      pe_pagina_id: (params.page || 1) - 1, // Convert 1-based to 0-based pagination
      pe_coluna_id: sortParams.pe_coluna_id,
      pe_ordem_id: sortParams.pe_ordem_id,
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
 * Note: Uses 1-based pagination for frontend consistency, converts to 0-based for API
 */
export async function fetchProductsWithFilters(
  searchTerm: string = "",
  categoryId: string = "all",
  onlyInStock: boolean = false,
  sortBy: string = "name-asc",
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

// ========================================
// CREATE PRODUCT ACTION
// ========================================

/**
 * Interface for creating a new product
 */
export interface CreateProductData {
  name: string;
  slug: string;
  reference?: string;
  model?: string;
  description?: string;
  tags?: string;
  brandId?: number;
  retailPrice?: number;
  stock?: number;
  businessType?: number;
  additionalInfo?: string;
}

/**
 * Server Action to create a new product
 */
export async function createProduct(data: CreateProductData): Promise<{
  success: boolean;
  productId?: number;
  error?: string;
}> {
  try {
    logger.info("Creating new product with data:", {
      name: data.name,
      slug: data.slug,
      reference: data.reference,
      model: data.model,
    });

    // Prepare API request data
    const apiData = {
      pe_type_business: data.businessType || 1, // Default business type
      pe_nome_produto: data.name,
      pe_slug: data.slug,
      pe_descricao_tab: data.description || "",
      pe_etiqueta: data.tags || "",
      pe_ref: data.reference || "",
      pe_modelo: data.model || "",
      pe_id_marca: data.brandId || 0,
      pe_vl_venda_varejo: data.retailPrice || 0,
      pe_qt_estoque: data.stock || 0,
      pe_info: data.additionalInfo || "",
    };

    // Call API service
    const response = await ProductServiceApi.createProduct(apiData);

    // Validate response
    if (!ProductServiceApi.isValidOperationResponse(response)) {
      logger.error("Invalid API response:", response);
      return {
        success: false,
        error: "Resposta inválida da API",
      };
    }

    // Check if operation was successful
    if (!ProductServiceApi.isOperationSuccessful(response)) {
      const spResponse =
        ProductServiceApi.extractStoredProcedureResponse(response);
      const errorMessage = spResponse?.sp_message || "Erro ao criar produto";
      logger.error("API returned error:", { spResponse, errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Extract product ID from response
    const productId = ProductServiceApi.extractRecordId(response);

    if (!productId) {
      logger.error("No product ID returned from API:", response);
      return {
        success: false,
        error: "ID do produto não foi retornado",
      };
    }

    logger.info("Product created successfully:", { productId });

    return {
      success: true,
      productId,
    };
  } catch (error) {
    logger.error("Error creating product:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao criar produto";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
