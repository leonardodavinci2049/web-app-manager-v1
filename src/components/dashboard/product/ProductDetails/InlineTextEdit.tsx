"use client";

import { Check, Edit, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InlineTextEditProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  multiline?: boolean;
  placeholder?: string;
  validation?: z.ZodString | z.ZodOptional<z.ZodString>;
  className?: string;
}

export function InlineTextEdit({
  label,
  value,
  onSave,
  multiline = false,
  placeholder = "",
  validation,
  className = "",
}: InlineTextEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError(null);
  };

  const handleSave = async () => {
    // Validate input if validation schema is provided
    if (validation) {
      try {
        validation.parse(editValue);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.issues[0].message);
          return;
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(editValue);
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
    if (e.key === "Enter" && !multiline && !e.shiftKey) {
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
            {multiline ? (
              <p className="text-sm whitespace-pre-wrap break-words">
                {value || (
                  <span className="text-muted-foreground italic">
                    Não informado
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm">
                {value || (
                  <span className="text-muted-foreground italic">
                    Não informado
                  </span>
                )}
              </p>
            )}
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
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className={error ? "border-destructive" : ""}
            rows={3}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className={error ? "border-destructive" : ""}
            autoFocus
          />
        )}

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
