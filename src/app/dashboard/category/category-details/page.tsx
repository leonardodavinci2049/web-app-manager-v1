/**
 * Página de Detalhes da Categoria - Server Component
 *
 * Renderiza a página de visualização e edição de detalhes de uma categoria
 * como Server Component, buscando dados no servidor.
 *
 * Rota: /dashboard/category/category-details?id=XXX
 */

import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import {
  findCategoryById,
  getCategoryParentName,
} from "@/app/actions/action-categories";
import { CategoryDetailsForm } from "@/components/forms/category-details-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CategoryDetailsHeaderClient } from "./category-details-header";

interface PageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

async function CategoryDetailsHeaderLoader({
  categoryId,
}: {
  categoryId: number;
}) {
  const category = await findCategoryById(categoryId);

  if (!category) {
    return null;
  }

  return <CategoryDetailsHeaderClient categoryName={category.TAXONOMIA} />;
}

async function CategoryDetailsContent({ categoryId }: { categoryId: number }) {
  // Buscar categoria no servidor
  const category = await findCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  // Buscar nome da categoria pai se houver
  const parentName = await getCategoryParentName(category.PARENT_ID);

  return (
    <div className="space-y-6 py-6">
      {/* Informações do Header */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {category.TAXONOMIA}
          </h1>
          <p className="text-sm text-muted-foreground">
            Editar detalhes da categoria ID: {category.ID_TAXONOMY}
          </p>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Categoria Pai
            </p>
            <p className="text-sm font-semibold">{parentName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Nível
            </p>
            <p className="text-sm font-semibold">{category.LEVEL || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Ordem
            </p>
            <p className="text-sm font-semibold">{category.ORDEM}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Itens
            </p>
            <p className="text-sm font-semibold">{category.QT_RECORDS || 0}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Card com Formulário */}
      <div className="px-4 lg:px-6">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Editar Categoria</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Modifique os dados abaixo e clique em Salvar para atualizar a
              categoria.
            </p>
          </div>

          <CategoryDetailsForm category={category} />
        </Card>
      </div>
    </div>
  );
}

/**
 * Fallback UI enquanto dados carregam
 */
function CategoryDetailsLoadingFallback() {
  const skeletonFields = ["header-1", "header-2", "header-3", "header-4"];
  const formFields = [
    "field-1",
    "field-2",
    "field-3",
    "field-4",
    "field-5",
    "field-6",
  ];

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {skeletonFields.map((field) => (
            <div key={field} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="space-y-6 rounded-lg border p-6">
          <div className="space-y-4">
            {formFields.map((field) => (
              <div key={field} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-6">
            <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CategoryDetailsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams.id;

  // Validar parâmetro obrigatório
  if (!categoryId) {
    redirect("/dashboard/category/category-list");
  }

  // Converter para número e validar
  const id = Number.parseInt(categoryId, 10);
  if (Number.isNaN(id) || id <= 0) {
    redirect("/dashboard/category/category-list");
  }

  return (
    <>
      {/* Header com Breadcrumb - Será preenchido após buscar dados */}
      <Suspense fallback={null}>
        <CategoryDetailsHeaderLoader categoryId={id} />
      </Suspense>

      {/* Conteúdo Principal com Suspense */}
      <Suspense fallback={<CategoryDetailsLoadingFallback />}>
        <CategoryDetailsContent categoryId={id} />
      </Suspense>
    </>
  );
}
