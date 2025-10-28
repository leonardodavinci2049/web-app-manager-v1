"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProductBrand } from "@/app/actions/action-product-updates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/use-translation";
import type { BrandData } from "@/services/api/brand/types/brand-types";

interface ChangeProductBrandDialogProps {
  productId: number;
  currentBrandId: number;
  currentBrandName: string;
  onSuccess?: () => void;
}

/**
 * ChangeProductBrandDialog Component
 *
 * Dialog to change the product brand.
 * Allows searching and selecting from available brands.
 */
export function ChangeProductBrandDialog({
  productId,
  currentBrandId,
  currentBrandName,
  onSuccess,
}: ChangeProductBrandDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load brands when dialog opens
  const loadBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/brand/list", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar marcas");
      }

      const data = await response.json();
      setBrands(data.brands || []);
    } catch (_error) {
      toast.error(t("dashboard.products.details.brand.changeDialog.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen) {
      loadBrands();
    }
  }, [isOpen, loadBrands]);

  async function handleChangeBrand(brandId: number) {
    // Prevent selecting the same brand
    if (brandId === currentBrandId) {
      toast.info(
        t("dashboard.products.details.brand.changeDialog.sameBrandSelected"),
      );
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateProductBrand(productId, brandId);

      if (result.success) {
        toast.success(
          result.message ||
            t("dashboard.products.details.brand.changeDialog.successMessage"),
        );
        setIsOpen(false);
        setSearchTerm("");
        onSuccess?.();
      } else {
        toast.error(
          result.error ||
            t("dashboard.products.details.brand.changeDialog.errorMessage"),
        );
      }
    } catch (_error) {
      toast.error(
        t("dashboard.products.details.brand.changeDialog.errorMessage"),
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) => {
    const brandName = brand.MARCA || "";
    const matchesSearch = brandName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("dashboard.products.details.brand.changeButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.products.details.brand.changeDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.products.details.brand.changeDialog.description", {
              currentBrand: currentBrandName,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(
                "dashboard.products.details.brand.changeDialog.searchPlaceholder",
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Brands List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.common.loading")}
              </p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.products.details.brand.changeDialog.noResults")}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-1 p-4">
                {filteredBrands.map((brand) => (
                  <button
                    key={brand.ID_MARCA}
                    type="button"
                    onClick={() => handleChangeBrand(brand.ID_MARCA)}
                    disabled={isUpdating || brand.ID_MARCA === currentBrandId}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50 data-[current=true]:bg-muted"
                    data-current={brand.ID_MARCA === currentBrandId}
                  >
                    <span className="flex items-center gap-2">
                      <span>{brand.MARCA || "(Sem nome)"}</span>
                      {brand.ID_MARCA === currentBrandId && (
                        <span className="text-xs text-muted-foreground">
                          (
                          {t(
                            "dashboard.products.details.brand.changeDialog.currentBrand",
                          )}
                          )
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {brand.ID_MARCA}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
            disabled={isUpdating}
          >
            {t("dashboard.common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
