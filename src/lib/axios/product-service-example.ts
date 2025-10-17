import { PRODUCT_ENDPOINTS } from "@/lib/constants/api-constants";
import { BaseApiService } from "./base-api-service";

/**
 * Interface para dados do produto
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para filtros de busca de produtos
 */
export interface ProductFilters {
  categoryId?: number;
  active?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Serviço para gerenciamento de produtos
 * Exemplo de implementação usando a nova arquitetura com API_KEY
 */
export class ProductService extends BaseApiService {
  /**
   * Busca produtos com filtros
   */
  async findProducts(filters?: ProductFilters): Promise<Product[]> {
    const queryParams = this.buildQueryParams(filters);
    const endpoint = `${PRODUCT_ENDPOINTS.FIND_PRODUCTS}${queryParams}`;

    const response = await this.get<{ data: Product[] }>(endpoint);
    return response.data || [];
  }

  /**
   * Busca produto por ID
   */
  async findProductById(id: number): Promise<Product | null> {
    const endpoint = PRODUCT_ENDPOINTS.FIND_BY_ID;

    const response = await this.post<{ data: Product }>(endpoint, {
      id,
    });

    return response.data || null;
  }

  /**
   * Cria um novo produto
   */
  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    const endpoint = "/product/v1/create-product";

    const response = await this.post<{ data: Product }>(endpoint, productData);

    if (!response.data) {
      throw new Error("Erro ao criar produto");
    }

    return response.data;
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product> {
    const endpoint = "/product/v1/update-product";

    const response = await this.put<{ data: Product }>(endpoint, {
      id,
      ...productData,
    });

    if (!response.data) {
      throw new Error("Erro ao atualizar produto");
    }

    return response.data;
  }

  /**
   * Remove um produto
   */
  async deleteProduct(id: number): Promise<boolean> {
    const endpoint = "/product/v1/delete-product";

    const response = await this.delete<{ success: boolean }>(endpoint, {
      params: { id },
    });

    return response.success || false;
  }

  /**
   * Constrói query params para filtros
   */
  private buildQueryParams(filters?: ProductFilters): string {
    if (!filters) return "";

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }
}

// Instância singleton do serviço
export const productService = new ProductService();
