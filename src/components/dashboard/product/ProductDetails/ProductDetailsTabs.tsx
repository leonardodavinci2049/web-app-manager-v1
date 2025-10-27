import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { ProductCharacteristicsCard } from "./ProductCharacteristicsCard";
import { ProductDescriptionEditor } from "./ProductDescriptionEditor";
import { ProductFlagsCard } from "./ProductFlagsCard";
import { ProductGeneralDataCard } from "./ProductGeneralDataCard";
import { ProductTaxValuesCard } from "./ProductTaxValuesCard";

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
        <ProductGeneralDataCard
          productId={productId}
          productName={product.PRODUTO}
          descriptionTab={product.DESCRICAO_TAB || ""}
          label={product.ETIQUETA || ""}
          reference={product.REF || ""}
          model={product.MODELO || ""}
        />

        {/* Card 2 - Características */}
        <ProductCharacteristicsCard
          productId={productId}
          warrantyDays={product.TEMPODEGARANTIA_DIA}
          weightGr={product.PESO_GR}
          lengthMm={product.COMPRIMENTO_MM}
          widthMm={product.LARGURA_MM}
          heightMm={product.ALTURA_MM}
          diameterMm={product.DIAMETRO_MM}
        />

        {/* Card 3 - Taxas */}
        <ProductTaxValuesCard
          productId={productId}
          cfop={product.CFOP}
          cst={product.CST}
          ean={product.EAN}
          ncm={product.NCM}
          nbm={product.NBM}
          ppb={product.PPB}
          temp={product.TEMP}
        />
      </TabsContent>

      <TabsContent value="technical" className="space-y-4">
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
