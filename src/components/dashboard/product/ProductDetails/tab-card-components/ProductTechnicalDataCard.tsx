import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { ProductFlagsCard } from "./ProductFlagsCard";

interface ProductTechnicalDataCardProps {
  product: ProductDetail;
  productId: number;
}

export function ProductTechnicalDataCard({
  product,
  productId,
}: ProductTechnicalDataCardProps) {
  return (
    <div className="space-y-4">
      {/* Card 2 - Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {product.ID_TIPO > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Tipo ID:</span>
                <span>{product.ID_TIPO}</span>
              </div>
            )}
          </div>

          {!(product.ID_TIPO > 0) && (
            <p className="text-muted-foreground italic text-sm">
              Nenhum tipo definido
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 3 - Marca */}
      <Card>
        <CardHeader>
          <CardTitle>Marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {product.ID_MARCA > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Marca ID:</span>
                <span>{product.ID_MARCA}</span>
              </div>
            )}
          </div>

          {!(product.ID_MARCA > 0) && (
            <p className="text-muted-foreground italic text-sm">
              Nenhuma marca definida
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 4 - Fornecedor */}
      <Card>
        <CardHeader>
          <CardTitle>Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {product.ID_FORNECEDOR && product.ID_FORNECEDOR > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Fornecedor ID:</span>
                <span>{product.ID_FORNECEDOR}</span>
              </div>
            )}
          </div>

          {!(product.ID_FORNECEDOR && product.ID_FORNECEDOR > 0) && (
            <p className="text-muted-foreground italic text-sm">
              Nenhum fornecedor definido
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 1 - Flags */}
      <ProductFlagsCard
        productId={productId}
        controleFisico={product.FLAG_CONTROLE_FISICO}
        controlarEstoque={product.CONTROLAR_ESTOQUE}
        consignado={product.CONSIGNADO}
        destaque={product.DESTAQUE}
        promocao={product.PROMOCAO}
        servico={product.FLAG_SERVICO}
        websiteOff={product.FLAG_WEBSITE_OFF}
        inativo={product.INATIVO}
        importado={product.IMPORTADO}
      />
    </div>
  );
}
