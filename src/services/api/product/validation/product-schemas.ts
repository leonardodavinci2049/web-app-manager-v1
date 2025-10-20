/**
 * Zod validation schemas for Product API Service
 * Based on API Reference: .github/api-reference/api-product-reference.md
 */

import { z } from "zod";

// ========================================
// QUERY ENDPOINTS SCHEMAS
// ========================================

/**
 * Schema for finding product by ID (ENDPOINT 1)
 */
export const FindProductByIdSchema = z.object({
  pe_type_business: z.number().int().min(1).max(2), // 1 = B2B, 2 = B2C
  pe_id_produto: z.number().int().min(0),
  pe_slug_produto: z.string().max(255).optional(),
});

/**
 * Schema for listing products (ENDPOINT 2)
 */
export const FindProductsSchema = z.object({
  pe_id_taxonomy: z.number().int().min(0).optional(), // Allow 0 for "no specific taxonomy"
  pe_id_produto: z.number().int().min(0).optional(), // Allow 0 for "no specific product"
  pe_produto: z.string().max(255).optional(),
  pe_flag_estoque: z.number().int().min(0).max(1).optional(),
  pe_flag_inativo: z.number().int().min(0).max(1).optional(),
  pe_qt_registros: z.number().int().min(1).max(100).optional(),
  pe_pagina_id: z.number().int().min(1).optional(),
  pe_coluna_id: z.number().int().optional(),
  pe_ordem_id: z.number().int().min(1).max(2).optional(),
});

// ========================================
// CREATE ENDPOINT SCHEMA
// ========================================

/**
 * Schema for creating a new product (ENDPOINT 6)
 */
export const CreateProductSchema = z.object({
  pe_type_business: z.number().int().min(1).max(2),
  pe_nome_produto: z.string().min(1).max(255),
  pe_descricao_tab: z.string().max(500).optional(),
  pe_etiqueta: z.string().max(100).optional(),
  pe_ref: z.string().max(100).optional(),
  pe_modelo: z.string().max(100).optional(),
  pe_id_fornecedor: z.number().int().positive().optional(),
  pe_id_tipo: z.number().int().positive().optional(),
  pe_id_marca: z.number().int().positive().optional(),
  pe_id_familia: z.number().int().positive().optional(),
  pe_id_grupo: z.number().int().positive().optional(),
  pe_id_subgrupo: z.number().int().positive().optional(),
  pe_peso_gr: z.number().min(0).optional(),
  pe_comprimento_mm: z.number().min(0).optional(),
  pe_largura_mm: z.number().min(0).optional(),
  pe_altura_mm: z.number().min(0).optional(),
  pe_diametro_mm: z.number().min(0).optional(),
  pe_tempodegarantia_mes: z.number().int().min(0).optional(),
  pe_vl_venda_atacado: z.number().min(0).optional(),
  pe_vl_venda_varejo: z.number().min(0).optional(),
  pe_vl_corporativo: z.number().min(0).optional(),
  pe_qt_estoque: z.number().int().min(0).optional(),
  pe_flag_website_off: z.number().int().min(0).max(1).optional(),
  pe_flag_importado: z.number().int().min(0).max(1).optional(),
  pe_info: z.string().optional(),
});

// ========================================
// UPDATE ENDPOINTS SCHEMAS
// ========================================

/**
 * Schema for updating general product data (ENDPOINT 7)
 */
export const UpdateProductGeneralSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_nome_produto: z.string().min(1).max(255),
  pe_ref: z.string().max(100),
  pe_modelo: z.string().max(100),
  pe_etiqueta: z.string().max(100),
  pe_descricao_tab: z.string().max(200),
});

/**
 * Schema for updating product name (ENDPOINT 8)
 */
export const UpdateProductNameSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_nome_produto: z.string().min(1).max(255),
});

/**
 * Schema for updating product type (ENDPOINT 9)
 */
export const UpdateProductTypeSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_id_tipo: z.number().int().positive(),
});

/**
 * Schema for updating product brand (ENDPOINT 10)
 */
export const UpdateProductBrandSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_id_marca: z.number().int().positive(),
});

/**
 * Schema for updating product stock (ENDPOINT 11)
 */
export const UpdateProductStockSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_qt_estoque: z.number().int().min(0),
  pe_qt_minimo: z.number().int().min(0),
});

/**
 * Schema for updating product prices (ENDPOINT 12)
 */
export const UpdateProductPriceSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_preco_venda_atac: z.number().min(0),
  pe_preco_venda_corporativo: z.number().min(0),
  pe_preco_venda_vare: z.number().min(0),
});

/**
 * Schema for updating product flags (ENDPOINT 13)
 */
export const UpdateProductFlagsSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_flag_inativo: z.number().int().min(0).max(1),
  pe_flag_importado: z.number().int().min(0).max(1),
  pe_flag_controle_fisico: z.number().int().min(0).max(1),
  pe_flag_controle_estoque: z.number().int().min(0).max(1),
  pe_flag_destaque: z.number().int().min(0).max(1),
  pe_flag_promocao: z.number().int().min(0).max(1),
  pe_flag_descontinuado: z.number().int().min(0).max(1),
  pe_flag_servico: z.number().int().min(0).max(1),
  pe_flag_website_off: z.number().int().min(0).max(1),
});

/**
 * Schema for updating product characteristics (ENDPOINT 14)
 */
export const UpdateProductCharacteristicsSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_peso_gr: z.number().min(0),
  pe_comprimento_mm: z.number().min(0),
  pe_largura_mm: z.number().min(0),
  pe_altura_mm: z.number().min(0),
  pe_diametro_mm: z.number().min(0),
  pe_tempodegarantia_dia: z.number().int().min(0),
  pe_tempodegarantia_mes: z.number().int().min(0),
});

/**
 * Schema for updating product tax values (ENDPOINT 15)
 */
export const UpdateProductTaxValuesSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_cfop: z.string().max(100),
  pe_cst: z.string().max(100),
  pe_ean: z.string().max(100),
  pe_nbm: z.string().max(100),
  pe_ncm: z.number().int().positive(),
  pe_ppb: z.number(),
  pe_temp: z.number(),
});

/**
 * Schema for updating product short description (ENDPOINT 16)
 */
export const UpdateProductShortDescriptionSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_descricao_venda: z.string().max(255),
});

/**
 * Schema for updating product full description (ENDPOINT 17)
 */
export const UpdateProductDescriptionSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_produto_descricao: z.string().max(255),
});

/**
 * Schema for updating various product data (ENDPOINT 18)
 */
export const UpdateProductVariousSchema = z.object({
  pe_id_produto: z.number().int().positive(),
  pe_nome_produto: z.string().min(1).max(255),
});

// ========================================
// INFERRED TYPES
// ========================================

export type FindProductByIdInput = z.infer<typeof FindProductByIdSchema>;
export type FindProductsInput = z.infer<typeof FindProductsSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductGeneralInput = z.infer<
  typeof UpdateProductGeneralSchema
>;
export type UpdateProductNameInput = z.infer<typeof UpdateProductNameSchema>;
export type UpdateProductTypeInput = z.infer<typeof UpdateProductTypeSchema>;
export type UpdateProductBrandInput = z.infer<typeof UpdateProductBrandSchema>;
export type UpdateProductStockInput = z.infer<typeof UpdateProductStockSchema>;
export type UpdateProductPriceInput = z.infer<typeof UpdateProductPriceSchema>;
export type UpdateProductFlagsInput = z.infer<typeof UpdateProductFlagsSchema>;
export type UpdateProductCharacteristicsInput = z.infer<
  typeof UpdateProductCharacteristicsSchema
>;
export type UpdateProductTaxValuesInput = z.infer<
  typeof UpdateProductTaxValuesSchema
>;
export type UpdateProductShortDescriptionInput = z.infer<
  typeof UpdateProductShortDescriptionSchema
>;
export type UpdateProductDescriptionInput = z.infer<
  typeof UpdateProductDescriptionSchema
>;
export type UpdateProductVariousInput = z.infer<
  typeof UpdateProductVariousSchema
>;
