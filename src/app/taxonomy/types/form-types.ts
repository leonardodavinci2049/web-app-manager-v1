import { z } from "zod";

/**
 * Schema de validação para formulário de busca de taxonomias
 * Garante tipos corretos e previne conversões incorretas
 */
export const taxonomySearchSchema = z.object({
  pe_id_parent: z.coerce.number().int().optional(),
  pe_id_taxonomy: z.coerce.number().int().min(0).optional(),
  pe_taxonomia: z
    .string()
    .max(255, "Nome muito longo (máximo 255 caracteres)")
    .optional(),
  pe_flag_inativo: z.coerce.number().int().min(0).max(1).optional(),
  pe_qt_registros: z.coerce.number().int().min(1).max(100).optional(),
  pe_pagina_id: z.coerce.number().int().min(0).optional(),
  pe_coluna_id: z.coerce.number().int().optional(),
  pe_ordem_id: z.coerce.number().int().min(0).max(1).optional(),
});

export type TaxonomySearchFormData = z.infer<typeof taxonomySearchSchema>;

/**
 * Valores padrão do formulário
 */
export const defaultSearchValues: Partial<TaxonomySearchFormData> = {
  pe_id_parent: -1,
  pe_id_taxonomy: 0,
  pe_taxonomia: "",
  pe_flag_inativo: 0,
  pe_qt_registros: 20,
  pe_pagina_id: 0,
  pe_coluna_id: 2,
  pe_ordem_id: 1,
};
