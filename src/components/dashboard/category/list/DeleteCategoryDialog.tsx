"use client";

/**
 * Componente de Diálogo de Confirmação de Exclusão de Categoria
 *
 * Exibe um alerta de confirmação antes de deletar uma categoria
 * Usa Server Action para realizar a exclusão
 */

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/actions/action-categories";
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
import { useTranslation } from "@/hooks/use-translation";

interface DeleteCategoryDialogProps {
  categoryId: number;
  categoryName: string;
  onSuccess?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onSuccess,
  variant = "outline",
  size = "sm",
  showLabel = false,
}: DeleteCategoryDialogProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    // Show processing toast
    const processingToast = toast.loading(
      t("dashboard.category.list.delete.deleting"),
    );

    try {
      // Call Server Action to delete category
      const result = await deleteCategory(categoryId);

      // Dismiss processing toast
      toast.dismiss(processingToast);

      // Check if deletion was successful
      if (result.success) {
        // Show API message to user
        toast.success(result.message);

        // Close dialog
        setIsOpen(false);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Operation failed
        toast.error(
          result.message || t("dashboard.category.list.delete.error"),
        );
      }
    } catch (error) {
      // Dismiss processing toast
      toast.dismiss(processingToast);

      console.error("Error deleting category:", error);

      // Extract error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      toast.error(errorMessage || t("dashboard.category.list.delete.error"));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Trash2 className="h-4 w-4" />
          {showLabel && t("dashboard.category.list.buttonDelete")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.category.list.delete.title")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.category.list.delete.description", {
              name: categoryName,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            {t("dashboard.category.list.delete.cancelButton")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting
              ? t("dashboard.category.list.delete.deleting")
              : t("dashboard.category.list.delete.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
