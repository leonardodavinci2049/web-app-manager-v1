import { Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDetail } from "@/services/api/product/types/product-types";

interface ProductInfoDisplayProps {
  product: ProductDetail;
  stockStatus: {
    label: string;
    variant: "default" | "destructive" | "secondary";
  };
  retailPrice: string | null;
  wholesalePrice: string | null;
  corporatePrice: string | null;
  stockLevel: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function ProductInfoDisplay({
  product,
  stockStatus,
  retailPrice,
  wholesalePrice,
  corporatePrice,
  stockLevel,
  isOutOfStock,
  isLowStock,
}: ProductInfoDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={product.INATIVO ? "destructive" : "default"}>
            {product.INATIVO ? "Inativo" : "Ativo"}
          </Badge>
          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          {product.FLAG_IMPORTADO === 1 && (
            <Badge variant="outline">Importado</Badge>
          )}
          {product.FLAG_WEBSITE_OFF === 0 && (
            <Badge variant="outline">Online</Badge>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {product.PRODUTO}
          </h1>
          {product.REF && (
            <p className="text-muted-foreground mt-1">
              Referência: {product.REF}
            </p>
          )}
          {product.MODELO && (
            <p className="text-muted-foreground">Modelo: {product.MODELO}</p>
          )}
        </div>

        {/* Rating Stars (Mock - in real app would come from reviews) */}
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
            (4.0 de 5 - 23 avaliações)
          </span>
        </div>
      </div>

      {/* Pricing Card */}
      {(retailPrice || wholesalePrice || corporatePrice) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {retailPrice && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço Varejo:</span>
                <span className="text-2xl font-bold text-green-600">
                  {retailPrice}
                </span>
              </div>
            )}
            {wholesalePrice && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preço Atacado:</span>
                <span className="text-lg font-semibold">{wholesalePrice}</span>
              </div>
            )}
            {corporatePrice && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Preço Corporativo:
                </span>
                <span className="text-lg font-semibold">{corporatePrice}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stock Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Disponível:</span>
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

          {/* Additional stock info */}
          {isOutOfStock && (
            <div className="mt-2 p-2 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive">
                Produto sem estoque disponível
              </p>
            </div>
          )}

          {isLowStock && !isOutOfStock && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-600">
                Estoque baixo - apenas {stockLevel} unidades restantes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Categories/Classification */}
      <Card>
        <CardHeader>
          <CardTitle>Classificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {product.ID_TIPO > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Tipo ID:</span>
                <span>{product.ID_TIPO}</span>
              </div>
            )}

            {product.ID_MARCA > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Marca ID:</span>
                <span>{product.ID_MARCA}</span>
              </div>
            )}

            {product.ID_FAMILIA > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Família ID:</span>
                <span>{product.ID_FAMILIA}</span>
              </div>
            )}

            {product.ID_GRUPO > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Grupo ID:</span>
                <span>{product.ID_GRUPO}</span>
              </div>
            )}

            {product.ID_SUBGRUPO > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Subgrupo ID:</span>
                <span>{product.ID_SUBGRUPO}</span>
              </div>
            )}

            {product.ID_FORNECEDOR > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Fornecedor ID:</span>
                <span>{product.ID_FORNECEDOR}</span>
              </div>
            )}
          </div>

          {!(
            product.ID_TIPO > 0 ||
            product.ID_MARCA > 0 ||
            product.ID_FAMILIA > 0 ||
            product.ID_GRUPO > 0 ||
            product.ID_SUBGRUPO > 0 ||
            product.ID_FORNECEDOR > 0
          ) && (
            <p className="text-muted-foreground italic text-sm">
              Nenhuma classificação definida
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions - Future implementation for inline editing */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Funcionalidades de edição inline serão implementadas em breve
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Veja a aba "Edição Inline" para demonstração
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
