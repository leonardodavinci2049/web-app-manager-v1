import { Button } from "@/components/ui/button";
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
        <CardContent>
          {product.ID_TIPO > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">
                      Nome do Tipo
                    </th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 text-sm">{product.ID_TIPO}</td>
                    <td className="py-2 px-2 text-sm">{product.TIPO}</td>
                    <td className="py-2 px-2">
                      <Button variant="outline" size="sm">
                        Alterar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
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
