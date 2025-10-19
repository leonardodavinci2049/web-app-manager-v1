"use client";

/**
 * Componente de Grid para exibir categorias
 *
 * Exibe cards de categorias em layout responsivo com loading e empty states
 * Suporta modo grid e list
 */

import { FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";
import { CategoryList } from "./CategoryList";
import { CategoryCard } from "@/components/dashboard/category/list/CategoryCard";

type ViewMode = "grid" | "list";

interface CategoryGridProps {
  categories: TaxonomyData[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  viewMode?: ViewMode;
}

/**
 * Skeleton para carregamento inicial
 */
function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={`skeleton-cat-${Date.now()}-${index}`} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function CategoryGrid({
  categories,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  viewMode = "list",
}: CategoryGridProps) {
  const { t } = useTranslation();

  // Loading inicial
  if (isLoading && categories.length === 0) {
    return viewMode === "grid" ? (
      <CategoryGridSkeleton />
    ) : (
      <CategoryList categories={[]} isLoading={true} />
    );
  }

  // Empty State
  if (categories.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">
          {t("dashboard.category.list.emptyState")}
        </h3>
        <p className="max-w-md text-muted-foreground">
          {t("dashboard.category.list.emptyStateDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid ou List de Categorias */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.ID_TAXONOMY} category={category} />
          ))}
        </div>
      ) : (
        <CategoryList categories={categories} isLoading={false} />
      )}

      {/* Loading State para paginação */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("dashboard.category.list.loading")}</span>
          </div>
        </div>
      )}

      {/* Botão Carregar Mais */}
      {!isLoadingMore && hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            className="min-w-[200px]"
            disabled={isLoadingMore}
          >
            {t("dashboard.category.list.buttonLoadMore")}
          </Button>
        </div>
      )}

      {/* Indicador de fim da lista */}
      {!isLoadingMore && !hasMore && categories.length > 0 && (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Todas as categorias foram carregadas
          </p>
        </div>
      )}
    </div>
  );
}
