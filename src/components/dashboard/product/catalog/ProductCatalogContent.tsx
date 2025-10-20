"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { fetchProductsWithFilters } from "@/app/actions/action-products";
import { createLogger } from "@/lib/logger";
import type { Category, FilterOptions, Product, ViewMode } from "@/types/types";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

const logger = createLogger("ProductCatalogContent");

interface ProductCatalogContentProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
  hasError?: boolean;
  errorMessage?: string;
}

export function ProductCatalogContent({
  initialProducts,
  initialTotal,
  categories,
  hasError = false,
  errorMessage,
}: ProductCatalogContentProps) {
  // State management
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    selectedCategory: "all",
    onlyInStock: false,
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // React 18 useTransition for better UX
  const [isPending, startTransition] = useTransition();

  // Show error toast if initial load failed
  if (hasError && errorMessage) {
    toast.error(errorMessage);
  }

  // Handle filter updates
  const updateFilters = async (newFilters: FilterOptions) => {
    startTransition(async () => {
      try {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page

        logger.info("Updating filters:", newFilters);

        const result = await fetchProductsWithFilters(
          newFilters.searchTerm,
          newFilters.selectedCategory,
          newFilters.onlyInStock,
          newFilters.sortBy,
          1, // First page
          20, // Products per page
        );

        if (result.success) {
          setProducts(result.products);
          setTotal(result.total);
        } else {
          toast.error(result.error || "Erro ao filtrar produtos");
          logger.error("Filter error:", result.error);
        }
      } catch (error) {
        toast.error("Erro inesperado ao filtrar produtos");
        logger.error("Unexpected filter error:", error);
      }
    });
  };

  // Reset filters to default
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      searchTerm: "",
      selectedCategory: "all",
      onlyInStock: false,
      sortBy: "newest",
    };

    updateFilters(defaultFilters);
  };

  // Load more products (pagination)
  const loadMore = async () => {
    if (isLoadingMore || products.length >= total) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;

      logger.info(`Loading more products - page ${nextPage}`);

      const result = await fetchProductsWithFilters(
        filters.searchTerm,
        filters.selectedCategory,
        filters.onlyInStock,
        filters.sortBy,
        nextPage,
        20,
      );

      if (result.success) {
        setProducts((prev) => [...prev, ...result.products]);
        setCurrentPage(nextPage);
      } else {
        toast.error(result.error || "Erro ao carregar mais produtos");
        logger.error("Load more error:", result.error);
      }
    } catch (error) {
      toast.error("Erro inesperado ao carregar mais produtos");
      logger.error("Unexpected load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle product details view
  const handleViewDetails = (productId: string) => {
    // TODO: Implement navigation to product details page
    logger.info("Viewing product details:", productId);
    toast.info(`Visualizando detalhes do produto ID: ${productId}`);
  };

  // Calculate display values
  const displayedProducts = products.length;
  const hasMore = displayedProducts < total;
  const isLoading = isPending || isLoadingMore;

  return (
    <>
      {/* Filtros */}
      <ProductFilters
        filters={filters}
        categories={categories}
        viewMode={viewMode}
        onFiltersChange={updateFilters}
        onViewModeChange={setViewMode}
        onResetFilters={resetFilters}
        totalProducts={total}
        displayedProducts={displayedProducts}
      />

      {/* Grid de Produtos */}
      <ProductGrid
        products={products}
        viewMode={viewMode}
        isLoading={isLoading}
        isInitialLoading={false} // We have initial data from server
        hasMore={hasMore}
        onLoadMore={loadMore}
        onViewDetails={handleViewDetails}
      />
    </>
  );
}
