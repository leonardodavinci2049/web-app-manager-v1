import { Eye, Package, Plane, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "../../../../types/types";
import { formatCurrency } from "../../../../utils/common-utils";
import { ProductCardClient } from "./ProductCardClient";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onViewDetails?: (productId: string) => void;
  onImageUploadSuccess?: () => void;
}

export function ProductCard({
  product,
  viewMode,
  onViewDetails,
  onImageUploadSuccess,
}: ProductCardProps) {
  const hasPromotion = Boolean(
    product.promotionalPrice && product.promotionalPrice < product.normalPrice,
  );

  const categoryLabels: Record<string, string> = {
    electronics: "Eletrônicos",
    clothing: "Roupas & Acessórios",
    "home-garden": "Casa & Jardim",
    sports: "Esportes & Lazer",
    "books-media": "Livros & Mídia",
  };

  if (viewMode === "list") {
    return (
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Imagem */}
            <div className="flex-shrink-0">
              <ProductCardClient
                product={product}
                viewMode={viewMode}
                onImageUploadSuccess={onImageUploadSuccess}
              />
            </div>

            {/* Informações - Layout fluido */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Header: Nome, SKU, Categoria */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-2 text-base font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      SKU: {product.sku}
                    </p>
                    {product.brand && (
                      <p className="text-muted-foreground text-xs">
                        Marca: {product.brand}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="flex-shrink-0 w-fit">
                    {categoryLabels[product.category] || product.category}
                  </Badge>
                </div>

                {/* Status badges - Em linha no mobile */}
                {(product.isNew || product.isImported) && (
                  <div className="flex flex-wrap gap-2">
                    {product.isNew && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Lançamento
                      </Badge>
                    )}
                    {product.isImported && (
                      <Badge variant="outline" className="text-xs">
                        <Plane className="h-3 w-3 mr-1" />
                        Importado
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Preços - Grid responsivo */}
              <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-4">
                {hasPromotion && (
                  <div className="col-span-3 md:w-auto">
                    <p className="text-muted-foreground text-xs md:text-sm line-through">
                      {formatCurrency(product.normalPrice)}
                    </p>
                  </div>
                )}
                <div className="text-center md:text-left">
                  <p className="text-xs text-muted-foreground">Atac.</p>
                  <p className="text-sm md:text-base font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(product.wholesalePrice)}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs text-muted-foreground">Vare.</p>
                  <p className="text-sm md:text-base font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(product.normalPrice)}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs text-muted-foreground">Corp.</p>
                  <p className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.corporatePrice)}
                  </p>
                </div>
              </div>

              {/* Estoque e Garantia - Layout responsivo */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div
                  className={`flex items-center gap-1 font-medium ${
                    product.stock === 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span>Estoque: {product.stock}</span>
                </div>
                {product.warrantyDays > 0 && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs md:text-sm">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span>{product.warrantyDays} dias</span>
                  </div>
                )}
              </div>

              {/* Botão - Em linha no desktop, full width no mobile */}
              <div className="flex">
                <Button
                  size="sm"
                  onClick={() => product.id && onViewDetails?.(product.id)}
                  className="gap-2 w-full md:w-auto"
                >
                  <Eye className="h-4 w-4" />
                  Ver detalhes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg max-w-[500px]">
      <CardContent className="flex h-full flex-col p-4">
        {/* Imagem */}
        <ProductCardClient
          product={product}
          viewMode={viewMode}
          onImageUploadSuccess={onImageUploadSuccess}
          hasPromotion={hasPromotion}
        />

        {/* Conteúdo flexível */}
        <div className="mt-4 flex flex-1 flex-col gap-3">
          {/* Categoria */}
          <Badge variant="outline" className="w-fit text-xs">
            {categoryLabels[product.category] || product.category}
          </Badge>

          {/* Nome e SKU */}
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-sm leading-tight font-semibold">
              {product.name}
            </h3>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                SKU: {product.sku}
              </p>
              {product.brand && (
                <p className="text-muted-foreground text-xs">
                  Marca: {product.brand}
                </p>
              )}
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-1">
            {hasPromotion && (
              <span className="text-muted-foreground block text-xs line-through">
                Preço original: {formatCurrency(product.normalPrice)}
              </span>
            )}
            {/* Preços diferenciados - linhas diferentes no modo grid */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                Atac. {formatCurrency(product.wholesalePrice)}
              </div>
              <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Vare. {formatCurrency(product.normalPrice)}
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Corp. {formatCurrency(product.corporatePrice)}
              </div>
            </div>
          </div>

          {/* Estoque e Garantia */}
          <div className="space-y-1">
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                product.stock === 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              <Package className="h-3 w-3" />
              <span>Estoque: {product.stock}</span>
            </div>
            {product.warrantyDays > 0 && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Shield className="h-3 w-3" />
                <span>{product.warrantyDays} dias de garantia</span>
              </div>
            )}
          </div>

          {/* Espaçador flexível para empurrar o botão para baixo */}
          <div className="flex-1"></div>

          {/* Botão de ação - sempre no rodapé */}
          <Button
            size="sm"
            className="mt-auto w-full gap-2"
            onClick={() => product.id && onViewDetails?.(product.id)}
          >
            <Eye className="h-4 w-4" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
