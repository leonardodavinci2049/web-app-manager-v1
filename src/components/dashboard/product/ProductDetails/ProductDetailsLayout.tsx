import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// Server Component - não usar hooks de cliente
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { formatCurrency } from "@/utils/common-utils";
import { ProductDetailsTabs } from "./ProductDetailsTabs";
import { ProductImageGalleryServer } from "./ProductImageGalleryServer";
import { ProductInfoDisplay } from "./ProductInfoDisplay";

interface ProductDetailsLayoutProps {
  product: ProductDetail;
  productId: number;
}

export function ProductDetailsLayout({
  product,
  productId,
}: ProductDetailsLayoutProps) {
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

  // Format prices - API returns strings like "320.000000"
  const retailPrice = product.VL_VAREJO
    ? formatCurrency(Number.parseFloat(product.VL_VAREJO))
    : null;
  const wholesalePrice = product.VL_ATACADO
    ? formatCurrency(Number.parseFloat(product.VL_ATACADO))
    : null;
  const corporatePrice = product.VL_CORPORATIVO
    ? formatCurrency(Number.parseFloat(product.VL_CORPORATIVO))
    : null;

  // Stock status - use ESTOQUE_LOJA from API (not QT_ESTOQUE)
  const stockLevel = product.ESTOQUE_LOJA ?? 0;
  const isOutOfStock = stockLevel === 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 5;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        label: "Sem Estoque",
        variant: "destructive" as const,
      };
    }
    if (isLowStock) {
      return {
        label: "Estoque Baixo",
        variant: "secondary" as const,
      };
    }
    return {
      label: "Em Estoque",
      variant: "default" as const,
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/product/catalog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Link>
        </Button>
      </div>

      {/* Main Product Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images Gallery (Server Component with Client Component) */}
        <ProductImageGalleryServer
          productId={productId}
          productName={product.PRODUTO}
          fallbackImage={productImage}
        />

        {/* Right Column - Product Info (Server Component) */}
        <ProductInfoDisplay
          product={product}
          stockStatus={stockStatus}
          retailPrice={retailPrice}
          wholesalePrice={wholesalePrice}
          corporatePrice={corporatePrice}
          stockLevel={stockLevel}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />
      </div>

      {/* Tabs Section */}
      <ProductDetailsTabs product={product} productId={productId} />
    </div>
  );
}

export function ProductDetailsLayoutSkeleton() {
  return (
    <div className="space-y-6">
      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-10" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Main Layout Skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`gallery-skeleton-${i + 1}`}
                className="aspect-square w-full"
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={`rating-skeleton-${i + 1}`}
                  className="h-4 w-4"
                />
              ))}
            </div>
          </div>

          {/* Cards Skeleton */}
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
