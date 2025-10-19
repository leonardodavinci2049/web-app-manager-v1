/**
 * Schema de validação para criação de nova categoria
 */

import { z } from "zod";

/**
 * Schema para validação do formulário de criação de categoria
 */
export const CreateCategoryFormSchema = z.object({
  // Campos obrigatórios
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres")
    .trim(),

  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .max(100, "Slug não pode ter mais de 100 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    )
    .trim(),

  // Campos com valores padrão (não opcionais para o formulário)
  parentId: z
    .number()
    .int()
    .min(0, "ID da categoria pai deve ser maior ou igual a 0"),

  level: z
    .number()
    .int()
    .min(1, "Nível deve ser no mínimo 1")
    .max(5, "Nível não pode ser maior que 5"),

  order: z.number().int().min(1, "Ordem deve ser um número positivo"),

  imagePath: z
    .string()
    .max(500, "Caminho da imagem não pode ter mais de 500 caracteres"),

  metaTitle: z
    .string()
    .max(60, "Meta title não pode ter mais de 60 caracteres"),

  metaDescription: z
    .string()
    .max(160, "Meta description não pode ter mais de 160 caracteres"),

  notes: z.string(),
});

/**
 * Tipo inferido do schema de validação
 */
export type CreateCategoryFormData = z.infer<typeof CreateCategoryFormSchema>;

/**
 * Função para gerar slug automaticamente baseado no nome
 * @param name Nome da categoria
 * @returns Slug formatado
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substituir espaços por hífens
    .replace(/[^a-z0-9-]/g, "") // Remover caracteres especiais
    .replace(/-+/g, "-") // Remover hífens duplicados
    .replace(/^-|-$/g, ""); // Remover hífens do início e fim
}

/**
 * Função para calcular o nível baseado na categoria pai
 * @param parentId ID da categoria pai
 * @param categories Lista de categorias disponíveis
 * @returns Nível calculado
 */
export function calculateLevelFromParent(
  parentId: number,
  categories: Array<{ ID_TAXONOMY: number; LEVEL?: number | null }>,
): number {
  if (parentId === 0) {
    return 1; // Categoria raiz
  }

  const parent = categories.find((cat) => cat.ID_TAXONOMY === parentId);
  if (!parent || !parent.LEVEL) {
    return 1; // Fallback para categoria raiz
  }

  return Math.min(parent.LEVEL + 1, 5); // Máximo 5 níveis
}
