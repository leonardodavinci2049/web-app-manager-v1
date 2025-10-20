"use client";

/**
 * Componente de formulário para criação de novo produto
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createProduct } from "@/app/actions/action-products";
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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";

import { generateSlugFromName } from "./validation";

/**
 * Componente do formulário de criação de produto
 */
export function NewProductForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    reference: "",
    model: "",
    description: "",
    tags: "",
    retailPrice: 0,
    stock: 0,
    additionalInfo: "",
  });

  // Gerar slug automaticamente baseado no nome
  const handleNameChange = (name: string) => {
    const slug = generateSlugFromName(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug,
    }));
  };

  // Submeter formulário
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar campos obrigatórios
      if (!formData.name.trim()) {
        toast.error(t("dashboard.products.errors.nameRequired"));
        return;
      }

      if (!formData.slug.trim()) {
        toast.error(t("dashboard.products.errors.slugRequired"));
        return;
      }

      const result = await createProduct({
        name: formData.name,
        slug: formData.slug,
        reference: formData.reference,
        model: formData.model,
        description: formData.description,
        tags: formData.tags,
        retailPrice: formData.retailPrice,
        stock: formData.stock,
        businessType: 1,
        additionalInfo: formData.additionalInfo,
      });

      if (result.success) {
        toast.success(t("dashboard.products.messages.createdSuccess"));

        // Aguardar um momento para mostrar o toast antes do redirecionamento
        setTimeout(() => {
          router.push("/dashboard/product");
        }, 1000);
      } else {
        toast.error(
          result.error || t("dashboard.products.messages.createFailed"),
        );
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error(t("dashboard.products.messages.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Cancelar e voltar para lista
  const handleCancel = () => {
    router.push("/dashboard/product");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.products.new.sections.basicInfo")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.products.new.sections.basicInfoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome do Produto */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("dashboard.products.new.fields.name")}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={t("dashboard.products.new.placeholders.name")}
              required
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.name")}
            </p>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              {t("dashboard.products.new.fields.slug")}
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder={t("dashboard.products.new.placeholders.slug")}
              required
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.slug")}
            </p>
          </div>

          {/* Referência */}
          <div className="space-y-2">
            <Label htmlFor="reference">
              {t("dashboard.products.new.fields.reference")}
            </Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reference: e.target.value }))
              }
              placeholder={t("dashboard.products.new.placeholders.reference")}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.reference")}
            </p>
          </div>

          {/* Modelo */}
          <div className="space-y-2">
            <Label htmlFor="model">
              {t("dashboard.products.new.fields.model")}
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, model: e.target.value }))
              }
              placeholder={t("dashboard.products.new.placeholders.model")}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.model")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preço e Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.products.new.sections.pricing")}</CardTitle>
          <CardDescription>
            {t("dashboard.products.new.sections.pricingDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preço de Venda */}
          <div className="space-y-2">
            <Label htmlFor="retailPrice">
              {t("dashboard.products.new.fields.retailPrice")}
            </Label>
            <Input
              id="retailPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.retailPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  retailPrice: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder={t("dashboard.products.new.placeholders.retailPrice")}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.retailPrice")}
            </p>
          </div>

          {/* Estoque */}
          <div className="space-y-2">
            <Label htmlFor="stock">
              {t("dashboard.products.new.fields.stock")}
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: parseInt(e.target.value, 10) || 0,
                }))
              }
              placeholder={t("dashboard.products.new.placeholders.stock")}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.stock")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Descrição e Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.products.new.sections.description")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.products.new.sections.descriptionDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("dashboard.products.new.fields.description")}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder={t("dashboard.products.new.placeholders.description")}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.description")}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">
              {t("dashboard.products.new.fields.tags")}
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder={t("dashboard.products.new.placeholders.tags")}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.tags")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("dashboard.products.new.sections.additional")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.products.new.sections.additionalDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informações Adicionais */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">
              {t("dashboard.products.new.fields.additionalInfo")}
            </Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalInfo: e.target.value,
                }))
              }
              placeholder={t(
                "dashboard.products.new.placeholders.additionalInfo",
              )}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              {t("dashboard.products.new.help.additionalInfo")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {t("dashboard.products.new.actions.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? t("dashboard.products.new.actions.creating")
            : t("dashboard.products.new.actions.create")}
        </Button>
      </div>
    </form>
  );
}
