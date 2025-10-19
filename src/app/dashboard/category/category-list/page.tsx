"use client";

/**
 * Página de Listagem de Categorias
 *
 * Exibe listagem completa de categorias com filtros, busca e paginação
 * Localização: /dashboard/category/category-list
 */

import { useEffect, useState } from "react";
import { CategoryFilters } from "@/components/dashboard/category/list/CategoryFilters";
import { CategoryGrid } from "@/components/dashboard/category/list/CategoryGrid";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { useCategoryFilter } from "@/hooks/dashboard/category/use-category-filter";
import { useTranslation } from "@/hooks/use-translation";

type ViewMode = "grid" | "list";

export default function CategoryListPage() {
  const { t } = useTranslation();

  // Estado do modo de visualização (default: list)
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Hook customizado para gerenciar filtros e estado
  const {
    filters,
    categories,
    hasMore,
    totalCategories,
    displayedCategories,
    isLoading,
    isLoadingMore,
    updateFilters,
    handleSearch,
    clearSearch,
    loadMore,
    fetchCategories,
  } = useCategoryFilter();

  // Carregar categorias iniciais ao montar o componente
  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  return (
    <>
      {/* Header com Breadcrumb */}
      <SiteHeaderWithBreadcrumb
        title={t("dashboard.category.list.title")}
        breadcrumbItems={[
          { label: t("dashboard.breadcrumb.dashboard"), href: "/dashboard" },
          { label: t("dashboard.category.list.title"), isActive: true },
        ]}
      />

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                {/* Cabeçalho da Página */}
                <div>
                  <h1 className="text-3xl font-bold">
                    {t("dashboard.category.list.title")}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {t("dashboard.category.list.subtitle")}
                  </p>
                </div>

                {/* Filtros */}
                <CategoryFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onSearch={handleSearch}
                  onClear={clearSearch}
                  totalCategories={totalCategories}
                  displayedCategories={displayedCategories}
                  isLoading={isLoading}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />

                {/* Grid de Categorias */}
                <CategoryGrid
                  categories={categories}
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
