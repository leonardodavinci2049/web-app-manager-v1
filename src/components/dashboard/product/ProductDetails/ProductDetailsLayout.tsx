import { ArrowLeft, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
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
// Server Component - não usar hooks de cliente
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { formatCurrency } from "@/utils/common-utils";
import { ProductImageGalleryServer } from "./ProductImageGalleryServer";
import { ProductInfoDisplay } from "./ProductInfoDisplay";
import { ProductInlineEditDemo } from "./ProductInlineEditDemo";

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

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
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
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="description"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            Descrição
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            Especificações
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            Dados Técnicos
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            Metadados
          </TabsTrigger>
          <TabsTrigger
            value="inline-edit"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            Edição Inline
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

                {product.SKU && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SKU:</span>
                    <span className="font-mono text-sm">{product.SKU}</span>
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

        <TabsContent value="inline-edit" className="space-y-4">
          <ProductInlineEditDemo product={product} />
        </TabsContent>
      </Tabs>
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
