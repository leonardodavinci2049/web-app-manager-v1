/**
 * Exemplo de uso do método updateProductImagePath
 * Endpoint: /product/v2/product-upd-path-image
 * Método: ProductServiceApi.updateProductImagePath()
 */

import { ProductServiceApi } from "@/services/api/product/product-service-api";
import type { UpdateProductImagePathRequest } from "@/services/api/product/types/product-types";

/**
 * Exemplo de atualização do caminho da imagem de um produto
 */
export async function updateProductImagePathExample() {
  try {
    // Parâmetros necessários para a atualização
    const updateParams: Partial<UpdateProductImagePathRequest> & {
      pe_id_produto: number;
      pe_path_imagem: string;
    } = {
      pe_id_produto: 1505,
      pe_path_imagem:
        "https://mundialmegastore.com.br/wp-content/uploads/2025/09/SD-240gb-Gigabyte-mundial-megastore.jpg",
    };

    // Chamar o método do serviço
    const response =
      await ProductServiceApi.updateProductImagePath(updateParams);

    // Verificar se a operação foi bem-sucedida
    if (ProductServiceApi.isOperationSuccessful(response)) {
      console.log("✅ Caminho da imagem atualizado com sucesso!");
      console.log("Response:", response);

      // Extrair informações da resposta
      const recordId = ProductServiceApi.extractRecordId(response);
      console.log("Record ID:", recordId);

      return {
        success: true,
        data: response,
        recordId,
      };
    } else {
      console.error("❌ Erro ao atualizar caminho da imagem");
      return {
        success: false,
        error: response.message,
      };
    }
  } catch (error) {
    console.error("❌ Erro no exemplo de atualização:", error);
    throw error;
  }
}

/**
 * Exemplo de uso em um contexto real (ex: upload de imagem)
 */
export async function handleProductImageUpload(
  productId: number,
  newImageUrl: string,
) {
  try {
    // Validar parâmetros
    if (!productId || productId <= 0) {
      throw new Error("ID do produto inválido");
    }

    if (!newImageUrl || newImageUrl.trim() === "") {
      throw new Error("URL da imagem é obrigatória");
    }

    // Atualizar caminho da imagem no produto
    const result = await ProductServiceApi.updateProductImagePath({
      pe_id_produto: productId,
      pe_path_imagem: newImageUrl.trim(),
    });

    // Log do resultado
    console.log(`📷 Imagem do produto ${productId} atualizada:`, newImageUrl);

    return result;
  } catch (error) {
    console.error("❌ Erro ao fazer upload da imagem:", error);
    throw error;
  }
}

/**
 * Exemplo de uso com validação de URL
 */
export async function updateProductImageWithValidation(
  productId: number,
  imageUrl: string,
) {
  try {
    // Validar formato da URL
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    if (!urlPattern.test(imageUrl)) {
      throw new Error(
        "URL da imagem deve ser válida e ter formato de imagem (jpg, jpeg, png, gif, webp)",
      );
    }

    // Validar tamanho da URL (max 255 caracteres conforme schema)
    if (imageUrl.length > 255) {
      throw new Error("URL da imagem não pode exceder 255 caracteres");
    }

    // Atualizar imagem
    const response = await ProductServiceApi.updateProductImagePath({
      pe_id_produto: productId,
      pe_path_imagem: imageUrl,
    });

    return {
      success: ProductServiceApi.isOperationSuccessful(response),
      response,
      recordId: ProductServiceApi.extractRecordId(response),
    };
  } catch (error) {
    console.error("❌ Validação falhou:", error);
    throw error;
  }
}
