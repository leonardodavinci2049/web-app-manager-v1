"use client";

import { Pencil, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProductDescription } from "@/app/actions/action-product-description";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ProductDescriptionEditorProps {
  productId: number;
  initialDescription: string | null;
}

export function ProductDescriptionEditor({
  productId,
  initialDescription,
}: ProductDescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || "");
  const [isPending, startTransition] = useTransition();

  // Handle save action
  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await updateProductDescription(productId, description);

        if (result.success) {
          toast.success(result.message);
          setIsEditing(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error saving description:", error);

        // More detailed error message
        if (error instanceof Error) {
          if (error.message.includes("fetch")) {
            toast.error(
              "Erro de conexão: Verifique se o servidor está rodando",
            );
          } else {
            toast.error(`Erro ao salvar: ${error.message}`);
          }
        } else {
          toast.error("Erro inesperado ao salvar descrição");
        }
      }
    });
  };

  // Handle cancel action
  const handleCancel = () => {
    setDescription(initialDescription || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Descrição do Produto</CardTitle>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do produto..."
              className="min-h-[200px] resize-y"
              disabled={isPending}
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={isPending} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {description ? (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                Nenhuma descrição disponível para este produto.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
