import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductPricingCardProps {
  retailPrice: string | null;
  wholesalePrice: string | null;
  corporatePrice: string | null;
}

export function ProductPricingCard({
  retailPrice,
  wholesalePrice,
  corporatePrice,
}: ProductPricingCardProps) {
  // Don't render if no prices are available
  if (!retailPrice && !wholesalePrice && !corporatePrice) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Preços de Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Table-like layout aligned to left */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            {retailPrice && (
              <>
                <span className="text-muted-foreground font-medium">
                  Preço Varejo:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {retailPrice}
                </span>
              </>
            )}
            {wholesalePrice && (
              <>
                <span className="text-muted-foreground font-medium">
                  Preço Atacado:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {wholesalePrice}
                </span>
              </>
            )}
            {corporatePrice && (
              <>
                <span className="text-muted-foreground font-medium">
                  Preço Corporativo:
                </span>
                <span className="text-lg font-bold text-purple-600">
                  {corporatePrice}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
