import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  ProductDetail,
  ProductRelatedTaxonomy,
} from "@/services/api/product/types/product-types";
import { ProductCategoriesCard } from "./ProductCategoriesCard";
import { ProductNameEditor } from "./ProductNameEditor";
import { ProductPricingCard } from "./ProductPricingCard";
import { ShortDescriptionEditor } from "./ShortDescriptionEditor";
import { ProductStockCard } from "./tab-card-components/ProductStockCard";

interface ProductInfoDisplayProps {
  product: ProductDetail;
  relatedTaxonomies: ProductRelatedTaxonomy[];
  stockStatus: {
    label: string;
    variant: "default" | "destructive" | "secondary";
  };
  retailPrice: string | null;
  wholesalePrice: string | null;
  corporatePrice: string | null;
  retailPriceRaw: number;
  wholesalePriceRaw: number;
  corporatePriceRaw: number;
  stockLevel: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function ProductInfoDisplay({
  product,
  relatedTaxonomies,
  stockStatus,
  retailPrice,
  wholesalePrice,
  corporatePrice,
  retailPriceRaw,
  wholesalePriceRaw,
  corporatePriceRaw,
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
          <ProductNameEditor
            productId={product.ID_PRODUTO}
            initialName={product.PRODUTO}
          />
          {product.SKU && (
            <p className="text-muted-foreground mt-1">SKU: {product.SKU}</p>
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
      <ProductPricingCard
        productId={product.ID_PRODUTO}
        retailPrice={retailPrice}
        wholesalePrice={wholesalePrice}
        corporatePrice={corporatePrice}
        retailPriceRaw={retailPriceRaw}
        wholesalePriceRaw={wholesalePriceRaw}
        corporatePriceRaw={corporatePriceRaw}
      />

      {/* Stock Info Card */}
      <ProductStockCard
        productId={product.ID_PRODUTO}
        stockLevel={stockLevel}
        isOutOfStock={isOutOfStock}
        isLowStock={isLowStock}
        stockStatus={stockStatus}
      />

      {/* Categories Card */}
      <ProductCategoriesCard relatedTaxonomies={relatedTaxonomies} />

      {/* Short Description Editor - Inline editing for sales description */}
      <ShortDescriptionEditor
        productId={product.ID_PRODUTO}
        initialDescription={product.DESCRICAO_VENDA}
      />
    </div>
  );
}
