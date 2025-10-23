"use client";

import { Check, Edit, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/common-utils";

interface InlineNumberEditProps {
  label: string;
  value: number;
  onSave: (value: number) => Promise<void>;
  type?: "currency" | "number" | "decimal";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}

export function InlineNumberEdit({
  label,
  value,
  onSave,
  type = "number",
  min,
  max,
  step = 1,
  suffix = "",
  className = "",
}: InlineNumberEditProps) {
  // Ensure value is never undefined
  const safeValue = value ?? 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(safeValue.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDisplayValue = (val: number): string => {
    if (type === "currency") {
      return formatCurrency(val);
    }
    if (type === "decimal") {
      return val.toFixed(2) + (suffix ? ` ${suffix}` : "");
    }
    return val.toString() + (suffix ? ` ${suffix}` : "");
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(safeValue.toString());
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(safeValue.toString());
    setError(null);
  };

  const validateAndParseNumber = (inputValue: string): number | null => {
    // Remove non-numeric characters except for decimal point and minus
    const cleanValue = inputValue.replace(/[^\d.,-]/g, "");

    // Replace comma with dot for decimal parsing
    const normalizedValue = cleanValue.replace(",", ".");

    const parsed = parseFloat(normalizedValue);

    if (Number.isNaN(parsed)) {
      setError("Valor deve ser um número válido");
      return null;
    }

    if (min !== undefined && parsed < min) {
      setError(`Valor deve ser maior ou igual a ${min}`);
      return null;
    }

    if (max !== undefined && parsed > max) {
      setError(`Valor deve ser menor ou igual a ${max}`);
      return null;
    }

    return parsed;
  };

  const handleSave = async () => {
    const parsedValue = validateAndParseNumber(editValue);

    if (parsedValue === null) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(parsedValue);
      setIsEditing(false);
      toast.success(`${label} atualizado com sucesso!`);
    } catch (error) {
      console.error("Error saving:", error);
      setError("Erro ao salvar alterações");
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`group flex items-center gap-2 ${className}`}>
        <div className="flex-1">
          <Label className="text-sm font-medium text-muted-foreground">
            {label}
          </Label>
          <div className="mt-1">
            <p className="text-sm font-medium">
              {formatDisplayValue(safeValue)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleStartEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1 space-y-2">
        <Input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Digite o ${label.toLowerCase()}`}
          disabled={isLoading}
          className={error ? "border-destructive" : ""}
          autoFocus
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
