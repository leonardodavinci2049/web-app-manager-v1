"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProductType } from "@/app/actions/action-product-updates";
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
import type { PtypeData } from "@/services/api/ptype/types/ptype-types";

interface ChangeProductTypeDialogProps {
  productId: number;
  currentTypeId: number;
  currentTypeName: string;
  onSuccess?: () => void;
}

/**
 * ChangeProductTypeDialog Component
 *
 * Dialog to change the product type.
 * Allows searching and selecting from available types.
 */
export function ChangeProductTypeDialog({
  productId,
  currentTypeId,
  currentTypeName,
  onSuccess,
}: ChangeProductTypeDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [types, setTypes] = useState<PtypeData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load types when dialog opens
  const loadTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ptype/list", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar tipos");
      }

      const data = await response.json();
      setTypes(data.types || []);
    } catch (_error) {
      toast.error(t("dashboard.products.details.type.changeDialog.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen) {
      loadTypes();
    }
  }, [isOpen, loadTypes]);

  async function handleChangeType(typeId: number) {
    // Prevent selecting the same type
    if (typeId === currentTypeId) {
      toast.info(
        t("dashboard.products.details.type.changeDialog.sameTypeSelected"),
      );
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateProductType(productId, typeId);

      if (result.success) {
        toast.success(
          result.message ||
            t("dashboard.products.details.type.changeDialog.successMessage"),
        );
        setIsOpen(false);
        setSearchTerm("");
        onSuccess?.();
      } else {
        toast.error(
          result.error ||
            t("dashboard.products.details.type.changeDialog.errorMessage"),
        );
      }
    } catch (_error) {
      toast.error(
        t("dashboard.products.details.type.changeDialog.errorMessage"),
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // Filter types based on search
  const filteredTypes = types.filter((type) => {
    const matchesSearch = type.TIPO.toLowerCase().includes(
      searchTerm.toLowerCase(),
    );
    return matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("dashboard.products.details.type.changeButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.products.details.type.changeDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.products.details.type.changeDialog.description", {
              currentType: currentTypeName,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(
                "dashboard.products.details.type.changeDialog.searchPlaceholder",
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Types List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.common.loading")}
              </p>
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.products.details.type.changeDialog.noResults")}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-1 p-4">
                {filteredTypes.map((type) => (
                  <button
                    key={type.ID_TIPO}
                    type="button"
                    onClick={() => handleChangeType(type.ID_TIPO)}
                    disabled={isUpdating || type.ID_TIPO === currentTypeId}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50 data-[current=true]:bg-muted"
                    data-current={type.ID_TIPO === currentTypeId}
                  >
                    <span className="flex items-center gap-2">
                      <span>{type.TIPO}</span>
                      {type.ID_TIPO === currentTypeId && (
                        <span className="text-xs text-muted-foreground">
                          (
                          {t(
                            "dashboard.products.details.type.changeDialog.currentType",
                          )}
                          )
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {type.ID_TIPO}
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
