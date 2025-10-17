"use client";

import { useEffect, useState } from "react";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { ProductFilters } from "../../../../components/dashboard/product/catalog/ProductFilters";
import { ProductGrid } from "../../../../components/dashboard/product/catalog/ProductGrid";
import { useProductFilter } from "../../../../hooks/dashboard/product/catalog/useProductFilter";
import {
  mockCategories,
  mockProducts,
} from "../../../../mock/dashboard/mocked-statistics-data";
import type { ViewMode } from "../../../../types/types";

export default function CatalogoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    filters,
    updateFilters,
    resetFilters,
    paginatedProducts,
    totalProducts,
    displayedProducts,
    hasMore,
    isLoading,
    loadMore,
  } = useProductFilter({
    products: mockProducts,
    pageSize: 20,
  });

  const handleViewDetails = (productId: string) => {
    // TODO: Implementar navegação para página de detalhes do produto
    console.log("Visualizando detalhes do produto:", productId);
  };

  // Evitar erro de hidratação renderizando apenas após carregar no cliente
  if (!isClient) {
    return (
      <>
        <SiteHeaderWithBreadcrumb
          title="Catálogo"
          breadcrumbItems={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Produtos", href: "#" },
            { label: "Catálogo", isActive: true },
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-6 py-6">
              <div className="px-4 lg:px-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Catálogo de Produtos</h1>
                    <p className="text-muted-foreground mt-2">
                      Carregando catálogo...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Catálogo"
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Produtos", href: "#" },
          { label: "Catálogo", isActive: true },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                  <h1 className="text-3xl font-bold">Catálogo de Produtos</h1>
                  <p className="text-muted-foreground mt-2">
                    Gerencie e visualize todos os produtos do seu catálogo com
                    filtros avançados.
                  </p>
                </div>

                {/* Filtros */}
                <ProductFilters
                  filters={filters}
                  categories={mockCategories}
                  viewMode={viewMode}
                  onFiltersChange={updateFilters}
                  onViewModeChange={setViewMode}
                  onResetFilters={resetFilters}
                  totalProducts={totalProducts}
                  displayedProducts={displayedProducts}
                />

                {/* Grid de Produtos */}
                <ProductGrid
                  products={paginatedProducts}
                  viewMode={viewMode}
                  isLoading={isLoading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
