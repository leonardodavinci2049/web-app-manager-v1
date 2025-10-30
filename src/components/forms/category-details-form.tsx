"use client";

/**
 * Componente de Formulário de Detalhes da Categoria
 *
 * Responsabilidades:
 * - Renderizar formulário com campos de edição
 * - Validação de dados com Zod
 * - Submissão via Server Action
 * - Feedback ao usuário
 *
 * Localização: /components/forms/category-details-form.tsx
 */

import Form from "next/form";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateCategory } from "@/app/actions/action-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface CategoryDetailsFormProps {
  category: TaxonomyData;
}

export function CategoryDetailsForm({ category }: CategoryDetailsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  // Preparar valores iniciais
  const initialValues = {
    id: String(category.ID_TAXONOMY),
    name: category.TAXONOMIA || "",
    slug: category.SLUG || "",
    parentId: String(category.PARENT_ID || 0),
    metaTitle: category.META_TITLE || "",
    metaDescription: category.META_DESCRIPTION || "",
    notes: category.ANOTACOES || "",
    order: String(category.ORDEM || 1),
    imagePath: category.PATH_IMAGEM || "",
    status: "0", // Default para ativo (a API não retorna campo de status na resposta)
  };

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        // Extrair dados do formulário
        const id = Number.parseInt(formData.get("id") as string, 10);
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const parentId = Number.parseInt(
          formData.get("parentId") as string,
          10,
        );
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const notes = formData.get("notes") as string;
        const order = Number.parseInt(formData.get("order") as string, 10);
        const imagePath = formData.get("imagePath") as string;
        const status = Number.parseInt(formData.get("status") as string, 10);

        // Validações básicas
        if (!name || name.trim().length === 0) {
          toast.error(t("dashboard.category.errors.nameRequired"));
          return;
        }

        // Chamar server action
        const result = await updateCategory({
          id,
          name: name.trim(),
          slug: slug.trim(),
          parentId,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          notes: notes.trim(),
          order,
          imagePath: imagePath.trim(),
          status,
        });

        if (result.success) {
          toast.success(t("dashboard.category.messages.updatedSuccess"));
        } else {
          toast.error(
            result.error || t("dashboard.category.errors.updateFailed"),
          );
        }
      } catch (error) {
        toast.error(t("dashboard.category.errors.unexpectedError"));
        console.error("Form error:", error);
      }
    });
  }

  return (
    <Form action={handleSubmit} className="space-y-6">
      {/* ID - Hidden */}
      <input type="hidden" name="id" value={initialValues.id} />

      {/* Nome da Categoria - Obrigatório */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("dashboard.category.fields.name")}*</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder={t("dashboard.category.placeholders.name")}
          defaultValue={initialValues.name}
          disabled={isPending}
          required
        />
      </div>

      {/* Slug - Para URL amigável */}
      <div className="space-y-2">
        <Label htmlFor="slug">{t("dashboard.category.fields.slug")}</Label>
        <Input
          id="slug"
          name="slug"
          type="text"
          placeholder={t("dashboard.category.placeholders.slug")}
          defaultValue={initialValues.slug}
          disabled={isPending}
        />
      </div>

      {/* Categoria Pai */}
      <div className="space-y-2">
        <Label htmlFor="parentId">
          {t("dashboard.category.fields.parent")}
        </Label>
        <Input
          id="parentId"
          name="parentId"
          type="number"
          placeholder="0"
          defaultValue={initialValues.parentId}
          disabled={isPending}
          min="0"
        />
      </div>

      {/* Ordem */}
      <div className="space-y-2">
        <Label htmlFor="order">{t("dashboard.category.fields.order")}</Label>
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={initialValues.order}
          disabled={isPending}
          min="1"
        />
      </div>

      {/* Caminho da Imagem */}
      <div className="space-y-2">
        <Label htmlFor="imagePath">
          {t("dashboard.category.fields.imagePath")}
        </Label>
        <Input
          id="imagePath"
          name="imagePath"
          type="text"
          placeholder={t("dashboard.category.placeholders.imagePath")}
          defaultValue={initialValues.imagePath}
          disabled={isPending}
        />
      </div>

      {/* Meta Title - SEO */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">
          {t("dashboard.category.fields.metaTitle")}
        </Label>
        <Input
          id="metaTitle"
          name="metaTitle"
          type="text"
          placeholder={t("dashboard.category.placeholders.metaTitle")}
          defaultValue={initialValues.metaTitle}
          disabled={isPending}
          maxLength={60}
        />
      </div>

      {/* Meta Description - SEO */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">
          hhhhh {t("dashboard.category.fields.metaDescription")}
        </Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          placeholder={t("dashboard.category.placeholders.metaDescription")}
          defaultValue={initialValues.metaDescription}
          disabled={isPending}
          maxLength={160}
          rows={3}
        />
      </div>

      {/* Notas/Anotações */}
      <div className="space-y-2">
        <Label htmlFor="notes">{t("dashboard.category.fields.notes")}</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={t("dashboard.category.placeholders.notes")}
          defaultValue={initialValues.notes}
          disabled={isPending}
          rows={4}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">{t("dashboard.category.fields.status")}</Label>
        <Select
          defaultValue={initialValues.status}
          disabled={isPending}
          onValueChange={(value) => {
            const statusInput = document.querySelector(
              'input[name="status"]',
            ) as HTMLInputElement;
            if (statusInput) statusInput.value = value;
          }}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              {t("dashboard.category.status.active")}
            </SelectItem>
            <SelectItem value="1">
              {t("dashboard.category.status.inactive")}
            </SelectItem>
          </SelectContent>
        </Select>
        <input
          type="hidden"
          name="status"
          defaultValue={initialValues.status}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" disabled={isPending}>
          {t("dashboard.category.buttons.cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("dashboard.category.buttons.saving")
            : t("dashboard.category.buttons.save")}
        </Button>
      </div>
    </Form>
  );
}
