"use client";

import { Check, Edit2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateCategoryStatus } from "@/app/actions/action-category-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";

interface CategoryStatusEditorProps {
  categoryId: number;
  initialStatus: number;
  onUpdate?: (newStatus: number) => void;
}

export function CategoryStatusEditor({
  categoryId,
  initialStatus,
  onUpdate,
}: CategoryStatusEditorProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [tempStatus, setTempStatus] = useState(status);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setTempStatus(status);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempStatus(status);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // If no changes were made
    if (tempStatus === status) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      // Call Server Action to update category status
      const result = await updateCategoryStatus(categoryId, tempStatus);

      // Check if update was successful
      if (result.success) {
        setStatus(tempStatus);
        setIsEditing(false);
        toast.success(result.message || "Status atualizado com sucesso");

        // Callback to parent component if provided
        if (onUpdate) {
          onUpdate(tempStatus);
        }
      } else {
        toast.error(result.error || "Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">
        {t("dashboard.category.fields.status")}
      </Label>
      {isEditing ? (
        <div className="space-y-3">
          <Select
            value={String(tempStatus)}
            onValueChange={(value) => setTempStatus(Number.parseInt(value, 10))}
            disabled={isSaving}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">
                {t("dashboard.category.status.active")}
              </SelectItem>
              <SelectItem value="1">
                {t("dashboard.category.status.inactive")}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            💡 Categorias inativas não aparecem no site
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              {t("dashboard.category.buttons.cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {t("dashboard.category.buttons.save")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEdit();
              }
            }}
          >
            <Badge variant={status === 0 ? "default" : "secondary"}>
              {status === 0
                ? t("dashboard.category.status.active")
                : t("dashboard.category.status.inactive")}
            </Badge>
            <div className="flex-1" />
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      )}
    </div>
  );
}
