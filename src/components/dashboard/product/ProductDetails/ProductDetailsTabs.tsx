import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { ProductDescriptionEditor } from "./ProductDescriptionEditor";

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

interface ProductDetailsTabsProps {
  product: ProductDetail;
  productId: number;
}

export function ProductDetailsTabs({
  product,
  productId,
}: ProductDetailsTabsProps) {
  return (
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
      </TabsList>

      <TabsContent value="description" className="space-y-4">
        <ProductDescriptionEditor
          productId={productId}
          initialDescription={product.ANOTACOES || ""}
        />
      </TabsContent>

      <TabsContent value="specifications" className="space-y-4">
        {/* Card 1 - Dados Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
            <CardDescription>
              Informações básicas e identificação do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <span className="text-muted-foreground font-medium">
                Descrição Tab:
              </span>
              <span>{product.DESCRICAO_TAB || "—"}</span>

              <span className="text-muted-foreground font-medium">
                Etiqueta:
              </span>
              <span>{product.ETIQUETA || "—"}</span>

              <span className="text-muted-foreground font-medium">
                Referência:
              </span>
              <span className="font-mono text-sm">{product.REF || "—"}</span>

              <span className="text-muted-foreground font-medium">Modelo:</span>
              <span>{product.MODELO || "—"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Características */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
            <CardDescription>
              Dimensões e características físicas do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <span className="text-muted-foreground font-medium">
                Tempo de Garantia:
              </span>
              <span>
                {product.TEMPODEGARANTIA_DIA > 0 ? (
                  <>
                    {product.TEMPODEGARANTIA_DIA} dias
                    {product.TEMPODEGARANTIA_DIA >= 30 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({Math.floor(product.TEMPODEGARANTIA_DIA / 30)}{" "}
                        {Math.floor(product.TEMPODEGARANTIA_DIA / 30) === 1
                          ? "mês"
                          : "meses"}
                        )
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="text-muted-foreground font-medium">Peso:</span>
              <span>
                {product.PESO_GR > 0 ? (
                  <>
                    {product.PESO_GR} g
                    {product.PESO_GR >= 1000 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(product.PESO_GR / 1000).toFixed(2)} kg)
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="text-muted-foreground font-medium">
                Comprimento:
              </span>
              <span>
                {product.COMPRIMENTO_MM > 0 ? (
                  <>
                    {product.COMPRIMENTO_MM} mm
                    {product.COMPRIMENTO_MM >= 10 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(product.COMPRIMENTO_MM / 10).toFixed(1)} cm)
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="text-muted-foreground font-medium">
                Largura:
              </span>
              <span>
                {product.LARGURA_MM > 0 ? (
                  <>
                    {product.LARGURA_MM} mm
                    {product.LARGURA_MM >= 10 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(product.LARGURA_MM / 10).toFixed(1)} cm)
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="text-muted-foreground font-medium">Altura:</span>
              <span>
                {product.ALTURA_MM > 0 ? (
                  <>
                    {product.ALTURA_MM} mm
                    {product.ALTURA_MM >= 10 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(product.ALTURA_MM / 10).toFixed(1)} cm)
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span className="text-muted-foreground font-medium">
                Diâmetro:
              </span>
              <span>
                {product.DIAMETRO_MM > 0 ? (
                  <>
                    {product.DIAMETRO_MM} mm
                    {product.DIAMETRO_MM >= 10 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(product.DIAMETRO_MM / 10).toFixed(1)} cm)
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Taxas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Fiscais</CardTitle>
            <CardDescription>
              Dados tributários e fiscais do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <span className="text-muted-foreground font-medium">CFOP:</span>
              <span className="font-mono text-sm">{product.CFOP || "—"}</span>

              <span className="text-muted-foreground font-medium">CST:</span>
              <span className="font-mono text-sm">{product.CST || "—"}</span>

              <span className="text-muted-foreground font-medium">EAN:</span>
              <span className="font-mono text-sm">{product.EAN || "—"}</span>

              <span className="text-muted-foreground font-medium">NCM:</span>
              <span className="font-mono text-sm">
                {product.NCM && product.NCM > 0 ? product.NCM : "—"}
              </span>

              <span className="text-muted-foreground font-medium">NBM:</span>
              <span className="font-mono text-sm">{product.NBM || "—"}</span>

              <span className="text-muted-foreground font-medium">PPB:</span>
              <span>
                {product.PPB && product.PPB > 0 ? `${product.PPB}%` : "—"}
              </span>

              <span className="text-muted-foreground font-medium">TEMP:</span>
              <span>{product.TEMP || "—"}</span>
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

              {product.TEMPODEGARANTIA_DIA > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Garantia:</span>
                  <span>
                    {product.TEMPODEGARANTIA_DIA} dias
                    {product.TEMPODEGARANTIA_DIA >= 30 &&
                      ` (${Math.floor(product.TEMPODEGARANTIA_DIA / 30)} ${Math.floor(product.TEMPODEGARANTIA_DIA / 30) === 1 ? "mês" : "meses"})`}
                  </span>
                </div>
              )}

              {!(
                product.PESO_GR > 0 ||
                product.COMPRIMENTO_MM > 0 ||
                product.LARGURA_MM > 0 ||
                product.ALTURA_MM > 0 ||
                product.TEMPODEGARANTIA_DIA > 0
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
                <span>
                  {formatDate(product.DT_UPDATE || product.DATADOCADASTRO)}
                </span>
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
  );
}
