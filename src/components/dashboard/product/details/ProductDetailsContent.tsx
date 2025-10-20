"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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

interface ProductDetailsContentProps {
  product: ProductDetail;
  isLoading?: boolean;
}

export function ProductDetailsContent({
  product,
  isLoading = false,
}: ProductDetailsContentProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <ProductDetailsContentSkeleton />;
  }

  // Format values for display
  const retailPrice = product.VL_VENDA_VAREJO
    ? formatCurrency(product.VL_VENDA_VAREJO)
    : "—";
  const wholesalePrice = product.VL_VENDA_ATACADO
    ? formatCurrency(product.VL_VENDA_ATACADO)
    : "—";
  const corporatePrice = product.VL_CORPORATIVO
    ? formatCurrency(product.VL_CORPORATIVO)
    : "—";

  const createdDate = product.DATADOCADASTRO
    ? formatDate(product.DATADOCADASTRO)
    : "—";
  const updatedDate = product.DT_UPDATE ? formatDate(product.DT_UPDATE) : "—";

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/product/catalog">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.products.details.basicInfo")}</CardTitle>
            <CardDescription>Informações principais do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.productId")}:
                </span>
                <span className="text-sm font-mono">
                  {product.ID_TBL_PRODUTO}
                </span>
              </div>

              {product.REF && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("dashboard.products.details.referenceLabel")}:
                  </span>
                  <span className="text-sm font-mono">{product.REF}</span>
                </div>
              )}

              {product.MODELO && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("dashboard.products.details.modelLabel")}:
                  </span>
                  <span className="text-sm">{product.MODELO}</span>
                </div>
              )}

              {product.ETIQUETA && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Etiqueta:
                  </span>
                  <span className="text-sm">{product.ETIQUETA}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.status")}:
                </span>
                <span
                  className={`text-sm font-medium ${product.INATIVO ? "text-red-600" : "text-green-600"}`}
                >
                  {product.INATIVO
                    ? t("dashboard.products.details.inactive")
                    : t("dashboard.products.details.active")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.products.details.pricing")}</CardTitle>
            <CardDescription>Valores e preços do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.retailPrice")}:
                </span>
                <span className="text-sm font-medium">{retailPrice}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.wholesalePrice")}:
                </span>
                <span className="text-sm font-medium">{wholesalePrice}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.corporatePrice")}:
                </span>
                <span className="text-sm font-medium">{corporatePrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.products.details.inventory")}</CardTitle>
            <CardDescription>Controle de estoque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.products.details.availableStock")}:
                </span>
                <span
                  className={`text-sm font-medium ${
                    product.QT_ESTOQUE === 0
                      ? "text-red-600"
                      : product.QT_ESTOQUE <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {product.QT_ESTOQUE}{" "}
                  {product.QT_ESTOQUE === 1 ? "unidade" : "unidades"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
            <CardDescription>
              Características físicas e técnicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {product.PESO_GR > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Peso:</span>
                  <span className="text-sm">{product.PESO_GR}g</span>
                </div>
              )}

              {product.COMPRIMENTO_MM > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Comprimento:
                  </span>
                  <span className="text-sm">{product.COMPRIMENTO_MM}mm</span>
                </div>
              )}

              {product.LARGURA_MM > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Largura:
                  </span>
                  <span className="text-sm">{product.LARGURA_MM}mm</span>
                </div>
              )}

              {product.ALTURA_MM > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Altura:</span>
                  <span className="text-sm">{product.ALTURA_MM}mm</span>
                </div>
              )}

              {product.TEMPODEGARANTIA_MES > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Garantia:
                  </span>
                  <span className="text-sm">
                    {product.TEMPODEGARANTIA_MES}{" "}
                    {product.TEMPODEGARANTIA_MES === 1 ? "mês" : "meses"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.products.details.metadata")}</CardTitle>
          <CardDescription>
            Informações de registro e atualização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {t("dashboard.products.details.createdAt")}:
              </span>
              <span className="text-sm">{createdDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {t("dashboard.products.details.updatedAt")}:
              </span>
              <span className="text-sm">{updatedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductDetailsContentSkeleton() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-18" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-34" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Technical Info Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-50" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
