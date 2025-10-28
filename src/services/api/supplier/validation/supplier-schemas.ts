/**
 * Schemas de validação Zod para o serviço de fornecedores
 */

import { z } from "zod";

/**
 * Schema para listar fornecedores com filtros
 */
export const FindSupplierSchema = z.object({
  pe_id_fornecedor: z.number().int().min(0).optional(),
  pe_fornecedor: z.string().max(255).optional(),
  pe_limit: z.number().int().min(1).max(500).optional(),
});

/**
 * Tipos inferidos dos schemas
 */
export type FindSupplierInput = z.infer<typeof FindSupplierSchema>;
