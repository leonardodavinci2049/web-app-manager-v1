"use client";

import { Eye, Package } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "../../../../types/types";
import { formatCurrency } from "../../../../utils/common-utils";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onViewDetails?: (productId: string) => void;
}

export function ProductCard({
  product,
  viewMode,
  onViewDetails,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const hasPromotion =
    product.promotionalPrice && product.promotionalPrice < product.normalPrice;
  const finalPrice = hasPromotion
    ? product.promotionalPrice
    : product.normalPrice;

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
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={product.image}
                alt={`Imagem do produto ${product.name}`}
                fill
                className="rounded-md object-cover"
                sizes="(max-width: 96px) 100vw, 96px"
                loading="lazy"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                  <Badge variant="destructive" className="text-xs">
                    Esgotado
                  </Badge>
                </div>
              )}
            </div>

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
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  {categoryLabels[product.category] || product.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {hasPromotion && (
                      <span className="text-muted-foreground text-sm line-through">
                        {formatCurrency(product.normalPrice)}
                      </span>
                    )}
                    <span
                      className={`font-bold ${hasPromotion ? "text-green-600" : "text-foreground"}`}
                    >
                      {formatCurrency(finalPrice || 0)}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Package className="h-3 w-3" />
                    <span>{product.stock} em estoque</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={isOutOfStock}
                  onClick={() => onViewDetails?.(product.id)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {isOutOfStock ? "Indisponível" : "Ver detalhes"}
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
      className={`group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isOutOfStock ? "opacity-60" : ""}`}
    >
      <CardContent className="flex h-full flex-col p-4">
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-md">
          <Image
            src={product.image}
            alt={`Imagem do produto ${product.name}`}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Badges sobrepostos */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasPromotion && (
              <Badge className="bg-red-500 text-xs hover:bg-red-600">
                Promoção
              </Badge>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive">Esgotado</Badge>
            </div>
          )}
        </div>

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
            <p className="text-muted-foreground text-xs">SKU: {product.sku}</p>
          </div>

          {/* Preços */}
          <div className="space-y-1">
            {hasPromotion && (
              <span className="text-muted-foreground block text-xs line-through">
                {formatCurrency(product.normalPrice)}
              </span>
            )}
            <span
              className={`block text-lg font-bold ${hasPromotion ? "text-green-600" : "text-foreground"}`}
            >
              {formatCurrency(finalPrice || 0)}
            </span>
          </div>

          {/* Estoque */}
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Package className="h-3 w-3" />
            <span>{product.stock} em estoque</span>
          </div>

          {/* Espaçador flexível para empurrar o botão para baixo */}
          <div className="flex-1"></div>

          {/* Botão de ação - sempre no rodapé */}
          <Button
            size="sm"
            className="mt-auto w-full gap-2"
            disabled={isOutOfStock}
            onClick={() => onViewDetails?.(product.id)}
          >
            <Eye className="h-4 w-4" />
            {isOutOfStock ? "Indisponível" : "Ver detalhes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
