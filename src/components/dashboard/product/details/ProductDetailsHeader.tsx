"use client";

import { ImageIcon, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { formatCurrency } from "@/utils/common-utils";

interface ProductDetailsHeaderProps {
  product: ProductDetail;
  isLoading?: boolean;
}

export function ProductDetailsHeader({
  product,
  isLoading = false,
}: ProductDetailsHeaderProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  if (isLoading) {
    return <ProductDetailsHeaderSkeleton />;
  }

  // Format price for display
  const retailPrice = product.VL_VENDA_VAREJO
    ? formatCurrency(product.VL_VENDA_VAREJO)
    : null;
  const wholesalePrice = product.VL_VENDA_ATACADO
    ? formatCurrency(product.VL_VENDA_ATACADO)
    : null;

  // Determine stock status
  const stockLevel = product.QT_ESTOQUE;
  const isOutOfStock = stockLevel === 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 5;

  // Get stock status for badge
  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        label: t("dashboard.products.outOfStock"),
        variant: "destructive" as const,
      };
    }
    if (isLowStock) {
      return {
        label: t("dashboard.products.lowStock"),
        variant: "secondary" as const,
      };
    }
    return {
      label: t("dashboard.products.inStock"),
      variant: "default" as const,
    };
  };

  const stockStatus = getStockStatus();

  // Helper function to validate and get product image URL
  const getProductImageUrl = (): string => {
    const defaultImage = "/images/product/no-image.jpeg";

    // Check if product has PATH_IMAGEM field
    if (product.PATH_IMAGEM && typeof product.PATH_IMAGEM === "string") {
      const pathImagem = product.PATH_IMAGEM;
      // If PATH_IMAGEM looks like a URL (starts with http/https or /)
      if (pathImagem.startsWith("http") || pathImagem.startsWith("/")) {
        try {
          // Validate URL format for external URLs
          if (pathImagem.startsWith("http")) {
            new URL(pathImagem);
          }
          return pathImagem;
        } catch {
          // Invalid URL format, continue to next check
        }
      } else if (pathImagem.length > 0) {
        // If it's a relative path, make it absolute
        return pathImagem.startsWith("/")
          ? pathImagem
          : `/images/product/${pathImagem}`;
      }
    }

    // Check if SLUG could be an image path
    if (product.SLUG && typeof product.SLUG === "string") {
      // If SLUG looks like a URL (starts with http/https or /)
      if (product.SLUG.startsWith("http") || product.SLUG.startsWith("/")) {
        try {
          // Validate URL format for external URLs
          if (product.SLUG.startsWith("http")) {
            new URL(product.SLUG);
          }
          // Only use SLUG if it looks like an image file
          if (product.SLUG.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            return product.SLUG;
          }
        } catch {
          // Invalid URL format, continue to next check
        }
      }

      // If SLUG looks like an image filename, construct path
      if (product.SLUG.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return `/images/product/${product.SLUG}`;
      }
    }

    // Default fallback
    return defaultImage;
  };

  const productImage = getProductImageUrl();

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
      {/* Product Image Section */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted">
              {!imageError ? (
                <Image
                  src={productImage}
                  alt={product.PRODUTO || "Produto"}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    isImageZoomed ? "scale-110" : "scale-100"
                  }`}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => {
                    console.warn("Image loading failed for:", productImage);
                    setImageError(true);
                  }}
                  onLoadingComplete={(result) => {
                    if (result.naturalWidth === 0) {
                      setImageError(true);
                    }
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                    <p className="text-sm">
                      {t("dashboard.products.noImageAvailable")}
                    </p>
                  </div>
                </div>
              )}

              {/* Zoom Button */}
              {!imageError && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        {/* Title and Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={product.INATIVO ? "destructive" : "default"}>
              {product.INATIVO
                ? t("dashboard.products.details.inactive")
                : t("dashboard.products.details.active")}
            </Badge>
            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.PRODUTO}
            </h1>
            {product.REF && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("dashboard.products.details.referenceLabel")}: {product.REF}
              </p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            {t("dashboard.products.details.pricing")}
          </h3>
          <div className="space-y-2">
            {retailPrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("dashboard.products.details.retailPrice")}:
                </span>
                <span className="font-medium text-lg">{retailPrice}</span>
              </div>
            )}
            {wholesalePrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("dashboard.products.details.wholesalePrice")}:
                </span>
                <span className="font-medium">{wholesalePrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stock Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            {t("dashboard.products.details.inventory")}
          </h3>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("dashboard.products.details.availableStock")}:
            </span>
            <span
              className={`font-medium ${isOutOfStock ? "text-destructive" : isLowStock ? "text-yellow-600" : "text-green-600"}`}
            >
              {stockLevel} {stockLevel === 1 ? "unidade" : "unidades"}
            </span>
          </div>
        </div>

        {/* Description */}
        {product.DESCRICAO_TAB && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {t("dashboard.products.details.descriptionLabel")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.DESCRICAO_TAB}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductDetailsHeaderSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-6">
        {/* Title and Badges */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Stock Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-20" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
