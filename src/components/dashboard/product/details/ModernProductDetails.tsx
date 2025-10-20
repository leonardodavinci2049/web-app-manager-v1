"use client";

import {
  ArrowLeft,
  BarChart3,
  Edit,
  ImageIcon,
  Info,
  MoreHorizontal,
  Package,
  Settings,
  Star,
  Trash2,
  Upload,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { formatCurrency } from "@/utils/common-utils";

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

interface ModernProductDetailsProps {
  product: ProductDetail;
  isLoading?: boolean;
}

export function ModernProductDetails({
  product,
  isLoading = false,
}: ModernProductDetailsProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return <ModernProductDetailsSkeleton />;
  }

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

  // Format prices
  const retailPrice = product.VL_VENDA_VAREJO
    ? formatCurrency(product.VL_VENDA_VAREJO)
    : null;
  const wholesalePrice = product.VL_VENDA_ATACADO
    ? formatCurrency(product.VL_VENDA_ATACADO)
    : null;
  const corporatePrice = product.VL_CORPORATIVO
    ? formatCurrency(product.VL_CORPORATIVO)
    : null;

  // Stock status
  const stockLevel = product.QT_ESTOQUE;
  const isOutOfStock = stockLevel === 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 5;

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

  // Mock additional images for gallery
  const additionalImages = [
    productImage,
    "/images/product/no-image.jpeg", // Placeholder for additional images
    "/images/product/no-image.jpeg",
    "/images/product/no-image.jpeg",
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/product/catalog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("dashboard.products.details.backToCatalog")}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            {t("dashboard.products.details.actions.edit")}
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            {t("dashboard.products.details.actions.delete")}
          </Button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted">
                {!imageError ? (
                  <Image
                    src={additionalImages[selectedImageIndex]}
                    alt={product.PRODUTO || "Produto"}
                    fill
                    className={`object-cover transition-transform duration-300 ${
                      isImageZoomed ? "scale-110" : "scale-100"
                    }`}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => {
                      console.warn(
                        "Image loading failed for:",
                        additionalImages[selectedImageIndex],
                      );
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

          {/* Image Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {additionalImages.map((image, index) => (
              <Card
                key={`product-${product.ID_TBL_PRODUTO}-gallery-${index}`}
                className={`cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
                  selectedImageIndex === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={image}
                      alt={`${product.PRODUTO} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Image Button */}
            <Card className="cursor-pointer overflow-hidden border-dashed border-2 hover:border-primary transition-colors">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">Adicionar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={product.INATIVO ? "destructive" : "default"}>
                {product.INATIVO
                  ? t("dashboard.products.details.inactive")
                  : t("dashboard.products.details.active")}
              </Badge>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {product.PRODUTO}
              </h1>
              {product.REF && (
                <p className="text-muted-foreground mt-1">
                  {t("dashboard.products.details.referenceLabel")}:{" "}
                  {product.REF}
                </p>
              )}
            </div>

            {/* Rating Stars (Mock) */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${i + 1}`}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                (4.0 - 23 avaliações)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {retailPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t("dashboard.products.details.retailPrice")}:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {retailPrice}
                  </span>
                </div>
              )}
              {wholesalePrice && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t("dashboard.products.details.wholesalePrice")}:
                  </span>
                  <span className="text-lg font-semibold">
                    {wholesalePrice}
                  </span>
                </div>
              )}
              {corporatePrice && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {t("dashboard.products.details.corporatePrice")}:
                  </span>
                  <span className="text-lg font-semibold">
                    {corporatePrice}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("dashboard.products.details.inventory")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {t("dashboard.products.details.availableStock")}:
                </span>
                <span
                  className={`text-lg font-semibold ${
                    isOutOfStock
                      ? "text-destructive"
                      : isLowStock
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {stockLevel} {stockLevel === 1 ? "unidade" : "unidades"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="description"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Descrição</span>
            <span className="sm:hidden">Desc.</span>
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Especificações</span>
            <span className="sm:hidden">Espec.</span>
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dados Técnicos</span>
            <span className="sm:hidden">Técnico</span>
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Metadados</span>
            <span className="sm:hidden">Meta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Produto</CardTitle>
              <CardDescription>
                Informações detalhadas sobre o produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.DESCRICAO_TAB ? (
                <p className="text-muted-foreground leading-relaxed">
                  {product.DESCRICAO_TAB}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  Nenhuma descrição disponível para este produto.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Especificações</CardTitle>
              <CardDescription>
                Informações básicas e identificação do produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">ID do Produto:</span>
                  <span className="font-mono text-sm">
                    {product.ID_TBL_PRODUTO}
                  </span>
                </div>

                {product.REF && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Referência:</span>
                    <span className="font-mono text-sm">{product.REF}</span>
                  </div>
                )}

                {product.MODELO && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Modelo:</span>
                    <span>{product.MODELO}</span>
                  </div>
                )}

                {product.ETIQUETA && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Etiqueta:</span>
                    <span>{product.ETIQUETA}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Status:</span>
                  <Badge variant={product.INATIVO ? "destructive" : "default"}>
                    {product.INATIVO ? "Inativo" : "Ativo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Técnicos</CardTitle>
              <CardDescription>
                Características físicas e técnicas do produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {product.PESO_GR > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Peso:</span>
                    <span>{product.PESO_GR}g</span>
                  </div>
                )}

                {product.COMPRIMENTO_MM > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Comprimento:</span>
                    <span>{product.COMPRIMENTO_MM}mm</span>
                  </div>
                )}

                {product.LARGURA_MM > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Largura:</span>
                    <span>{product.LARGURA_MM}mm</span>
                  </div>
                )}

                {product.ALTURA_MM > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Altura:</span>
                    <span>{product.ALTURA_MM}mm</span>
                  </div>
                )}

                {product.TEMPODEGARANTIA_MES > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Garantia:</span>
                    <span>
                      {product.TEMPODEGARANTIA_MES}{" "}
                      {product.TEMPODEGARANTIA_MES === 1 ? "mês" : "meses"}
                    </span>
                  </div>
                )}

                {!(
                  product.PESO_GR > 0 ||
                  product.COMPRIMENTO_MM > 0 ||
                  product.LARGURA_MM > 0 ||
                  product.ALTURA_MM > 0 ||
                  product.TEMPODEGARANTIA_MES > 0
                ) && (
                  <p className="text-muted-foreground italic">
                    Nenhuma informação técnica disponível para este produto.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
              <CardDescription>
                Informações de registro e atualização do produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Data de Criação:</span>
                  <span>{formatDate(product.DATADOCADASTRO)}</span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Última Atualização:</span>
                  <span>{formatDate(product.DT_UPDATE)}</span>
                </div>

                {product.SLUG && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Slug:</span>
                    <span className="font-mono text-sm">{product.SLUG}</span>
                  </div>
                )}

                {product.META_TITLE && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Meta Title:</span>
                    <span className="text-sm">{product.META_TITLE}</span>
                  </div>
                )}

                {product.META_DESCRIPTION && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Meta Description:</span>
                    <span className="text-sm">{product.META_DESCRIPTION}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ModernProductDetailsSkeleton() {
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
