"use client";

import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createTaxonomyRelationship } from "@/app/actions/action-taxonomy";
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
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface AddCategoryDialogProps {
  productId: number;
  existingCategoryIds: number[];
  onSuccess?: () => void;
}

/**
 * AddCategoryDialog Component
 *
 * Dialog to add a category relationship to a product.
 * Allows searching and selecting from available categories.
 */
export function AddCategoryDialog({
  productId,
  existingCategoryIds,
  onSuccess,
}: AddCategoryDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState<TaxonomyData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load categories when dialog opens
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/taxonomy/menu", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar categorias");
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, loadCategories]);

  async function handleAddCategory(categoryId: number) {
    setIsAdding(true);

    try {
      const result = await createTaxonomyRelationship(categoryId, productId);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        setSearchTerm("");
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro inesperado ao adicionar categoria");
    } finally {
      setIsAdding(false);
    }
  }

  // Filter categories based on search and exclude existing ones
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.TAXONOMIA.toLowerCase().includes(
      searchTerm.toLowerCase(),
    );
    const notAlreadyAdded = !existingCategoryIds.includes(category.ID_TAXONOMY);
    return matchesSearch && notAlreadyAdded;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("dashboard.products.details.categories.add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.products.details.categories.addDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.products.details.categories.addDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(
                "dashboard.products.details.categories.addDialog.searchPlaceholder",
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.common.loading")}
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.products.details.categories.addDialog.noResults")}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-1 p-4">
                {filteredCategories.map((category) => (
                  <button
                    key={category.ID_TAXONOMY}
                    type="button"
                    onClick={() => handleAddCategory(category.ID_TAXONOMY)}
                    disabled={isAdding}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      {category.LEVEL &&
                        category.LEVEL > 1 &&
                        "— ".repeat(category.LEVEL - 1)}
                      <span>{category.TAXONOMIA}</span>
                    </span>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>ID: {category.ID_TAXONOMY}</span>
                      <span>
                        {t(
                          "dashboard.products.details.categories.addDialog.level",
                        )}{" "}
                        {category.LEVEL}
                      </span>
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
            disabled={isAdding}
          >
            {t("dashboard.common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
