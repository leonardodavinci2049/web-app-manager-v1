"use client";

import { Check, Edit2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateProductPrice } from "@/app/actions/action-product-updates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductPricingCardProps {
  productId: number;
  retailPrice: string | null;
  wholesalePrice: string | null;
  corporatePrice: string | null;
  retailPriceRaw: number;
  wholesalePriceRaw: number;
  corporatePriceRaw: number;
}

export function ProductPricingCard({
  productId,
  retailPrice,
  wholesalePrice,
  corporatePrice,
  retailPriceRaw,
  wholesalePriceRaw,
  corporatePriceRaw,
}: ProductPricingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State for each price field
  const [tempRetailPrice, setTempRetailPrice] = useState(
    retailPriceRaw.toString(),
  );
  const [tempWholesalePrice, setTempWholesalePrice] = useState(
    wholesalePriceRaw.toString(),
  );
  const [tempCorporatePrice, setTempCorporatePrice] = useState(
    corporatePriceRaw.toString(),
  );

  // Validation constants
  const MIN_PRICE = 0.1;

  // Don't render if no prices are available
  if (!retailPrice && !wholesalePrice && !corporatePrice) {
    return null;
  }

  const handleEdit = () => {
    setTempRetailPrice(retailPriceRaw.toString());
    setTempWholesalePrice(wholesalePriceRaw.toString());
    setTempCorporatePrice(corporatePriceRaw.toString());
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempRetailPrice(retailPriceRaw.toString());
    setTempWholesalePrice(wholesalePriceRaw.toString());
    setTempCorporatePrice(corporatePriceRaw.toString());
    setIsEditing(false);
  };

  const validatePrices = (): { valid: boolean; error?: string } => {
    const retail = Number.parseFloat(tempRetailPrice);
    const wholesale = Number.parseFloat(tempWholesalePrice);
    const corporate = Number.parseFloat(tempCorporatePrice);

    // Check if all values are valid numbers
    if (
      Number.isNaN(retail) ||
      Number.isNaN(wholesale) ||
      Number.isNaN(corporate)
    ) {
      return {
        valid: false,
        error: "Todos os preços devem ser números válidos",
      };
    }

    // Check minimum value
    if (retail < MIN_PRICE || wholesale < MIN_PRICE || corporate < MIN_PRICE) {
      return {
        valid: false,
        error: `Todos os preços devem ser maiores ou iguais a R$ ${MIN_PRICE.toFixed(2)}`,
      };
    }

    // Check if all values are greater than zero
    if (retail <= 0 || wholesale <= 0 || corporate <= 0) {
      return {
        valid: false,
        error: "Todos os preços devem ser maiores que zero",
      };
    }

    return { valid: true };
  };

  const handleSave = async () => {
    // Validate prices
    const validation = validatePrices();
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const retail = Number.parseFloat(tempRetailPrice);
    const wholesale = Number.parseFloat(tempWholesalePrice);
    const corporate = Number.parseFloat(tempCorporatePrice);

    // Check if any price changed
    if (
      retail === retailPriceRaw &&
      wholesale === wholesalePriceRaw &&
      corporate === corporatePriceRaw
    ) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      // Call Server Action with all three prices
      const result = await updateProductPrice(
        productId,
        wholesale,
        corporate,
        retail,
      );

      if (result.success) {
        toast.success("Preços atualizados com sucesso!");
        setIsEditing(false);
        // Reload page to reflect changes
        window.location.reload();
      } else {
        toast.error(result.error || "Erro ao atualizar preços");
      }
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Erro ao atualizar preços");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: string): string => {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Preços de Venda</CardTitle>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 gap-2"
          >
            <Edit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* Retail Price */}
            <div className="space-y-2">
              <Label htmlFor="retail-price" className="text-sm font-medium">
                Preço Varejo
              </Label>
              <Input
                id="retail-price"
                type="number"
                step="0.01"
                min={MIN_PRICE}
                value={tempRetailPrice}
                onChange={(e) => setTempRetailPrice(e.target.value)}
                disabled={isSaving}
                className="font-mono"
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Valor formatado: {formatCurrency(tempRetailPrice)}
              </p>
            </div>

            {/* Wholesale Price */}
            <div className="space-y-2">
              <Label htmlFor="wholesale-price" className="text-sm font-medium">
                Preço Atacado
              </Label>
              <Input
                id="wholesale-price"
                type="number"
                step="0.01"
                min={MIN_PRICE}
                value={tempWholesalePrice}
                onChange={(e) => setTempWholesalePrice(e.target.value)}
                disabled={isSaving}
                className="font-mono"
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Valor formatado: {formatCurrency(tempWholesalePrice)}
              </p>
            </div>

            {/* Corporate Price */}
            <div className="space-y-2">
              <Label htmlFor="corporate-price" className="text-sm font-medium">
                Preço Corporativo
              </Label>
              <Input
                id="corporate-price"
                type="number"
                step="0.01"
                min={MIN_PRICE}
                value={tempCorporatePrice}
                onChange={(e) => setTempCorporatePrice(e.target.value)}
                disabled={isSaving}
                className="font-mono"
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Valor formatado: {formatCurrency(tempCorporatePrice)}
              </p>
            </div>

            {/* Validation message */}
            <p className="text-xs text-muted-foreground border-t pt-3">
              ⚠️ Todos os três preços devem ser maiores que R${" "}
              {MIN_PRICE.toFixed(2)}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
