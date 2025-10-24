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
  const isOutOfStock = product.stock === 0;
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
      <Card
        className={`transition-all duration-200 hover:shadow-md ${isOutOfStock ? "opacity-60" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Imagem */}
            <ProductCardClient
              product={product}
              viewMode={viewMode}
              onImageUploadSuccess={onImageUploadSuccess}
            />

            {/* Informações */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
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
                <Badge variant="outline" className="flex-shrink-0">
                  {categoryLabels[product.category] || product.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {/* Status badges */}
                  <div className="flex gap-1">
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
                  {/* Preços principais */}
                  <div className="flex items-center gap-2">
                    {hasPromotion && (
                      <span className="text-muted-foreground text-sm line-through">
                        {formatCurrency(product.normalPrice)}
                      </span>
                    )}
                  </div>
                  {/* Preços diferenciados - mesma linha no modo lista */}
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                    <span className="text-green-600 dark:text-green-400">
                      Atac. {formatCurrency(product.wholesalePrice)}
                    </span>
                    <span className="text-orange-600 dark:text-orange-400">
                      Vare. {formatCurrency(product.normalPrice)}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Corp. {formatCurrency(product.corporatePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
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
                        <span>{product.warrantyDays} dias</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => product.id && onViewDetails?.(product.id)}
                  className="gap-2"
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
    <Card
      className={`group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg max-w-[500px] ${isOutOfStock ? "opacity-60" : ""}`}
    >
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
