"use client";

/**
 * Category Details Inline Edit Component
 *
 * Displays category information with inline editing capability
 * Each field can be edited directly without entering a full form mode
 *
 * Features:
 * - Click on field value to enable edit mode
 * - ESC to cancel, Enter/Click outside to save (not implemented yet)
 * - Visual feedback for editing state
 * - Responsive layout
 */

import { Check, Edit2, X } from "lucide-react";
import { useState } from "react";
import { CategoryNameEditor } from "@/components/dashboard/category/category-details/CategoryNameEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface CategoryDetailsInlineEditProps {
  category: TaxonomyData;
  section: "basic" | "media" | "seo" | "notes";
}

interface EditingState {
  field: string | null;
  value: string | number;
}

export function CategoryDetailsInlineEdit({
  category,
  section,
}: CategoryDetailsInlineEditProps) {
  const { t } = useTranslation();
  const [editingState, setEditingState] = useState<EditingState>({
    field: null,
    value: "",
  });

  // Local state for form values
  const [formData, setFormData] = useState({
    name: category.TAXONOMIA || "",
    slug: category.SLUG || "",
    parentId: category.PARENT_ID || 0,
    order: category.ORDEM || 1,
    imagePath: category.PATH_IMAGEM || "",
    metaTitle: category.META_TITLE || "",
    metaDescription: category.META_DESCRIPTION || "",
    notes: category.ANOTACOES || "",
    status: 0, // Default active
  });

  // Check if a field is being edited
  const isEditing = (fieldName: string) => editingState.field === fieldName;

  // Start editing a field
  const startEditing = (fieldName: string, currentValue: string | number) => {
    setEditingState({ field: fieldName, value: currentValue });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingState({ field: null, value: "" });
  };

  // Save changes (placeholder - will implement later)
  const saveField = (fieldName: string) => {
    // Update local state
    setFormData((prev) => ({
      ...prev,
      [fieldName]: editingState.value,
    }));

    // TODO: Implement API call to save changes
    console.log(`Saving ${fieldName}:`, editingState.value);

    // Exit editing mode
    cancelEditing();
  };

  // Handle Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveField(fieldName);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  // Render Basic Information Section
  const renderBasicInfo = () => (
    <div className="space-y-4">
      {/* Name Field */}
      <CategoryNameEditor
        categoryId={category.ID_TAXONOMY}
        initialName={formData.name}
        onUpdate={(newName) =>
          setFormData((prev) => ({ ...prev, name: newName }))
        }
      />

      {/* Parent ID Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.parent")}
        </Label>
        {isEditing("parentId") ? (
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={editingState.value as number}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: Number.parseInt(e.target.value, 10) || 0,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "parentId")}
              autoFocus
              className="flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => saveField("parentId")}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() => startEditing("parentId", formData.parentId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("parentId", formData.parentId);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground">
              {formData.parentId === 0
                ? t("dashboard.category.noParent")
                : formData.parentId}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Order Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.order")}
        </Label>
        {isEditing("order") ? (
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              value={editingState.value as number}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: Number.parseInt(e.target.value, 10) || 1,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "order")}
              autoFocus
              className="flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => saveField("order")}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() => startEditing("order", formData.order)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("order", formData.order);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground">
              {formData.order}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Status Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.status")}
        </Label>
        {isEditing("status") ? (
          <div className="flex gap-2">
            <Select
              value={String(editingState.value)}
              onValueChange={(value) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: Number.parseInt(value, 10),
                }))
              }
            >
              <SelectTrigger className="flex-1">
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
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => saveField("status")}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() => startEditing("status", formData.status)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("status", formData.status);
              }
            }}
          >
            <Badge variant={formData.status === 0 ? "default" : "secondary"}>
              {formData.status === 0
                ? t("dashboard.category.status.active")
                : t("dashboard.category.status.inactive")}
            </Badge>
            <div className="flex-1" />
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>
    </div>
  );

  // Render Media Section
  const renderMedia = () => (
    <div className="space-y-4">
      {/* Image Path Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.imagePath")}
        </Label>
        {isEditing("imagePath") ? (
          <div className="flex gap-2">
            <Input
              value={editingState.value as string}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "imagePath")}
              autoFocus
              className="flex-1"
              placeholder={t("dashboard.category.placeholders.imagePath")}
            />
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => saveField("imagePath")}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() => startEditing("imagePath", formData.imagePath)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("imagePath", formData.imagePath);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground truncate">
              {formData.imagePath ||
                t("dashboard.category.placeholders.imagePath")}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>
    </div>
  );

  // Render SEO Section
  const renderSeo = () => (
    <div className="space-y-4">
      {/* Meta Title Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.metaTitle")}
        </Label>
        {isEditing("metaTitle") ? (
          <div className="flex gap-2">
            <Input
              value={editingState.value as string}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "metaTitle")}
              maxLength={60}
              autoFocus
              className="flex-1"
              placeholder={t("dashboard.category.placeholders.metaTitle")}
            />
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => saveField("metaTitle")}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-center gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() => startEditing("metaTitle", formData.metaTitle)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("metaTitle", formData.metaTitle);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground">
              {formData.metaTitle ||
                t("dashboard.category.placeholders.metaTitle")}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Meta Description Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.metaDescription")}
        </Label>
        {isEditing("metaDescription") ? (
          <div className="flex gap-2">
            <Textarea
              value={editingState.value as string}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "metaDescription")}
              maxLength={160}
              rows={3}
              autoFocus
              className="flex-1"
              placeholder={t("dashboard.category.placeholders.metaDescription")}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={() => saveField("metaDescription")}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-start gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer"
            onClick={() =>
              startEditing("metaDescription", formData.metaDescription)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("metaDescription", formData.metaDescription);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground">
              {formData.metaDescription ||
                t("dashboard.category.placeholders.metaDescription")}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-0.5" />
          </div>
        )}
      </div>
    </div>
  );

  // Render Notes Section
  const renderNotes = () => (
    <div className="space-y-4">
      {/* Notes Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {t("dashboard.category.fields.notes")}
        </Label>
        {isEditing("notes") ? (
          <div className="flex gap-2">
            <Textarea
              value={editingState.value as string}
              onChange={(e) =>
                setEditingState((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              onKeyDown={(e) => handleKeyDown(e, "notes")}
              rows={4}
              autoFocus
              className="flex-1"
              placeholder={t("dashboard.category.placeholders.notes")}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={() => saveField("notes")}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            className="group flex items-start gap-2 rounded-md border border-transparent bg-muted/50 px-3 py-2 transition-colors hover:border-border hover:bg-background cursor-pointer min-h-[100px]"
            onClick={() => startEditing("notes", formData.notes)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing("notes", formData.notes);
              }
            }}
          >
            <p className="flex-1 text-sm text-muted-foreground whitespace-pre-wrap">
              {formData.notes || t("dashboard.category.placeholders.notes")}
            </p>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-0.5" />
          </div>
        )}
      </div>
    </div>
  );

  // Render section based on prop
  const renderSection = () => {
    switch (section) {
      case "basic":
        return renderBasicInfo();
      case "media":
        return renderMedia();
      case "seo":
        return renderSeo();
      case "notes":
        return renderNotes();
      default:
        return null;
    }
  };

  return <div>{renderSection()}</div>;
}
