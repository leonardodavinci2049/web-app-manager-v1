/**
 * Schemas de validação Zod para o serviço de taxonomia
 */

import { z } from "zod";

/**
 * Schema para buscar taxonomias do menu
 */
export const FindTaxonomyMenuSchema = z.object({
  pe_id_tipo: z.number().int().positive().optional(),
  pe_parent_id: z.number().int().min(0).optional(),
});

/**
 * Schema para listar taxonomias com filtros e paginação
 */
export const FindTaxonomySchema = z.object({
  pe_id_parent: z.number().int().optional(),
  pe_id_taxonomy: z.number().int().min(0).optional(),
  pe_taxonomia: z.string().max(255).optional(),
  pe_flag_inativo: z.number().int().min(0).max(1).optional(),
  pe_qt_registros: z.number().int().min(1).max(100).optional(),
  pe_pagina_id: z.number().int().min(0).optional(),
  pe_coluna_id: z.number().int().optional(),
  pe_ordem_id: z.number().int().min(1).max(2).optional(), // 1 = ASC, 2 = DESC
});

/**
 * Schema para buscar taxonomy por ID
 */
export const FindTaxonomyByIdSchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
  pe_slug_taxonomy: z.string().max(255).optional(),
});

/**
 * Schema para criar nova taxonomy
 */
export const CreateTaxonomySchema = z.object({
  pe_id_tipo: z.number().int().positive(),
  pe_parent_id: z.number().int().min(0),
  pe_taxonomia: z.string().min(1).max(255),
  pe_slug: z.string().min(1).max(255),
  pe_level: z.number().int().min(1),
});

/**
 * Schema para atualizar taxonomy existente
 */
export const UpdateTaxonomySchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
  pe_parent_id: z.number().int().min(0).optional(),
  pe_taxonomia: z.string().min(1).max(255),
  pe_slug: z.string().max(255).optional(),
  pe_path_imagem: z.string().max(500).optional(),
  pe_ordem: z.number().int().min(1).optional(),
  pe_meta_title: z.string().max(255).optional(),
  pe_meta_description: z.string().max(500).optional(),
  pe_inativo: z.number().int().min(0).max(1).optional(),
  pe_info: z.string().optional(),
});

/**
 * Schema para excluir taxonomy
 */
export const DeleteTaxonomySchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
});

/**
 * Schema para criar relacionamento entre taxonomia e produto
 */
export const CreateTaxonomyRelSchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
  pe_id_produto: z.number().int().positive(),
});

/**
 * Schema para listar produtos de uma taxonomia
 */
export const FindTaxonomyRelProdutoSchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
  pe_qt_registros: z.number().int().min(1).max(100).optional(),
  pe_pagina_id: z.number().int().min(0).optional(),
});

/**
 * Schema para deletar relacionamento entre taxonomia e produto
 */
export const DeleteTaxonomyRelSchema = z.object({
  pe_id_taxonomy: z.number().int().positive(),
  pe_id_produto: z.number().int().positive(),
});

/**
 * Tipos inferidos dos schemas
 */
export type FindTaxonomyMenuInput = z.infer<typeof FindTaxonomyMenuSchema>;
export type FindTaxonomyInput = z.infer<typeof FindTaxonomySchema>;
export type FindTaxonomyByIdInput = z.infer<typeof FindTaxonomyByIdSchema>;
export type CreateTaxonomyInput = z.infer<typeof CreateTaxonomySchema>;
export type UpdateTaxonomyInput = z.infer<typeof UpdateTaxonomySchema>;
export type DeleteTaxonomyInput = z.infer<typeof DeleteTaxonomySchema>;
export type CreateTaxonomyRelInput = z.infer<typeof CreateTaxonomyRelSchema>;
export type FindTaxonomyRelProdutoInput = z.infer<
  typeof FindTaxonomyRelProdutoSchema
>;
export type DeleteTaxonomyRelInput = z.infer<typeof DeleteTaxonomyRelSchema>;
