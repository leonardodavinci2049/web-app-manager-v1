"use client";

/**
 * Componente de formulário modernizado para criação de nova categoria
 * Implementação otimizada seguindo Next.js 15 e diretrizes do projeto
 */

import Form from "next/form";
import { useState } from "react";
import { toast } from "sonner";
import { createCategoryAction } from "@/app/actions/action-categories";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/use-translation";
import {
  calculateLevelFromParent,
  generateSlugFromName,
} from "@/lib/validations/category-validations";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface NewCategoryFormProps {
  categories: TaxonomyData[];
}

/**
 * Componente do formulário de criação de categoria modernizado
 * Usa Next.js Form component com Server Actions
 */
export function NewCategoryForm({ categories }: NewCategoryFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "0",
    level: "1",
  });

  // Gerar slug automaticamente baseado no nome
  const handleNameChange = (name: string) => {
    const slug = generateSlugFromName(name);
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  // Atualizar nível baseado na categoria pai selecionada
  const handleParentChange = (parentId: string) => {
    const level = calculateLevelFromParent(
      Number(parentId),
      categories,
    ).toString();
    setFormData((prev) => ({ ...prev, parentId, level }));
  };

  // Handler para ação de cancelar
  function handleCancel() {
    window.location.href = "/dashboard/category/category-list";
  }

  // Handler para erros do Server Action
  async function handleFormAction(formData: FormData) {
    try {
      await createCategoryAction(formData);
      // Se chegou aqui, houve erro (o sucesso redireciona automaticamente)
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      toast.error(errorMessage);
    }
  }

  return (
    <Form action={handleFormAction} className="space-y-6">
      {/* Seção: Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.category.new.sections.basicInfo")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.category.new.sections.basicInfoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome da Categoria */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("dashboard.category.fields.name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={t("dashboard.category.placeholders.name")}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">{t("dashboard.category.fields.slug")}</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder={t("dashboard.category.placeholders.slug")}
              required
              minLength={2}
              maxLength={100}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              title="Slug deve conter apenas letras minúsculas, números e hífens"
            />
          </div>

          {/* Categoria Pai */}
          <div className="space-y-2">
            <Label htmlFor="parentId">
              {t("dashboard.category.fields.parent")}
            </Label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={(e) => handleParentChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="0">
                {t("dashboard.category.options.rootCategory")}
              </option>
              {categories.map((category) => (
                <option
                  key={category.ID_TAXONOMY}
                  value={category.ID_TAXONOMY.toString()}
                >
                  {category.LEVEL &&
                    category.LEVEL > 1 &&
                    "— ".repeat(category.LEVEL - 1)}
                  {category.TAXONOMIA}
                </option>
              ))}
            </select>
          </div>

          {/* Nível (somente leitura) */}
          <div className="space-y-2">
            <Label htmlFor="level">
              {t("dashboard.category.fields.level")}
            </Label>
            <input type="hidden" name="level" value={formData.level} />
            <Input
              id="level"
              name="level"
              value={formData.level}
              disabled
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Informação sobre campos opcionais */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            ℹ️ {t("dashboard.category.new.info.optionalFields")}
          </p>
        </CardContent>
      </Card>

      {/* Ações do Formulário */}
      <Card>
        <CardContent className="pt-6">
          <Separator className="mb-6" />
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {t("dashboard.category.buttons.cancel")}
            </Button>
            <SubmitButton
              pendingText={t("dashboard.category.buttons.creating")}
            >
              {t("dashboard.category.buttons.create")}
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </Form>
  );
}
