"use client";

import { Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product, ViewMode } from "../../../../types/types";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductSkeleton";

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onViewDetails?: (productId: string) => void;
}

export function ProductGrid({
  products,
  viewMode,
  isLoading = false,
  isInitialLoading = false,
  hasMore = false,
  onLoadMore,
  onViewDetails,
}: ProductGridProps) {
  // Initial Loading State
  if (isInitialLoading) {
    return <ProductGridSkeleton viewMode={viewMode} count={8} />;
  }

  // Empty State
  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="text-muted-foreground mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">
          Nenhum produto encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Não encontramos produtos que correspondam aos filtros aplicados. Tente
          ajustar os filtros ou limpar a pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de Produtos */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando produtos...</span>
          </div>
        </div>
      )}

      {/* Botão Carregar Mais */}
      {!isLoading && hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            className="min-w-[200px]"
          >
            Carregar mais produtos
          </Button>
        </div>
      )}

      {/* Indicador de fim da lista */}
      {!isLoading && !hasMore && products.length > 0 && (
        <div className="py-6 text-center">
          <p className="text-muted-foreground text-sm">
            Todos os produtos foram carregados
          </p>
        </div>
      )}
    </div>
  );
}
