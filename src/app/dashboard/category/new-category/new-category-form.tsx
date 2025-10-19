"use client";

/**
 * Componente de formulário para criação de nova categoria
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createCategory,
  getCategoryOptions,
} from "@/app/actions/action-categories";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

import {
  type CreateCategoryFormData,
  CreateCategoryFormSchema,
  calculateLevelFromParent,
  generateSlugFromName,
} from "./validation";

/**
 * Componente do formulário de criação de categoria
 */
export function NewCategoryForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<TaxonomyData[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Configurar formulário com React Hook Form + Zod
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      parentId: 0,
      level: 1,
      order: 1,
      imagePath: "",
      metaTitle: "",
      metaDescription: "",
      notes: "",
    },
  });

  // Carregar categorias para seleção de categoria pai
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryOptions = await getCategoryOptions();
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast.error(t("dashboard.category.errors.loadCategoriesFailed"));
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, [t]);

  // Gerar slug automaticamente baseado no nome
  const handleNameChange = (name: string) => {
    const slug = generateSlugFromName(name);
    form.setValue("slug", slug);
  };

  // Atualizar nível baseado na categoria pai selecionada
  const handleParentChange = (parentId: number) => {
    const level = calculateLevelFromParent(parentId, categories);
    form.setValue("level", level);
  };

  // Submeter formulário
  async function onSubmit(data: CreateCategoryFormData) {
    setIsSubmitting(true);

    try {
      const result = await createCategory({
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        level: data.level,
        order: data.order,
        imagePath: data.imagePath,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        notes: data.notes,
      });

      if (result.success) {
        toast.success(t("dashboard.category.messages.createdSuccess"));

        // Aguardar um momento para mostrar o toast antes do redirecionamento
        setTimeout(() => {
          router.push("/dashboard/category/category-list");
        }, 1000);
      } else {
        toast.error(
          result.error || t("dashboard.category.errors.createFailed"),
        );
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      toast.error(t("dashboard.category.errors.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Cancelar e voltar para lista
  const handleCancel = () => {
    router.push("/dashboard/category/category-list");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("dashboard.category.placeholders.name")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.name")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.slug")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("dashboard.category.placeholders.slug")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.slug")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categoria Pai */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.parent")}</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => {
                      const parentId = Number.parseInt(value, 10);
                      field.onChange(parentId);
                      handleParentChange(parentId);
                    }}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? t("dashboard.category.options.loading")
                              : t(
                                  "dashboard.category.placeholders.selectParent",
                                )
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">
                        {t("dashboard.category.options.rootCategory")}
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.ID_TAXONOMY}
                          value={category.ID_TAXONOMY.toString()}
                        >
                          {category.LEVEL &&
                            category.LEVEL > 1 &&
                            "— ".repeat(category.LEVEL - 1)}
                          {category.TAXONOMIA}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("dashboard.category.help.parent")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nível (somente leitura) */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.level")}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} disabled />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.level")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Seção: Configurações */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("dashboard.category.new.sections.settings")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.category.new.sections.settingsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ordem */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.order")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder={t("dashboard.category.placeholders.order")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.order")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Caminho da Imagem */}
            <FormField
              control={form.control}
              name="imagePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.category.fields.imagePath")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "dashboard.category.placeholders.imagePath",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.imagePath")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Seção: SEO */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.category.new.sections.seo")}</CardTitle>
            <CardDescription>
              {t("dashboard.category.new.sections.seoDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meta Title */}
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.category.fields.metaTitle")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "dashboard.category.placeholders.metaTitle",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.metaTitle")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meta Description */}
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.category.fields.metaDescription")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "dashboard.category.placeholders.metaDescription",
                      )}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.metaDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Seção: Notas */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.category.new.sections.notes")}</CardTitle>
            <CardDescription>
              {t("dashboard.category.new.sections.notesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.category.fields.notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("dashboard.category.placeholders.notes")}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("dashboard.category.help.notes")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ações do Formulário */}
        <Card>
          <CardContent className="pt-6">
            <Separator className="mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {t("dashboard.category.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("dashboard.category.buttons.creating")
                  : t("dashboard.category.buttons.create")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
