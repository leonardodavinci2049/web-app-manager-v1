"use client";

import { Server, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { ApiMethod } from "../hooks/useTaxonomySearch";

interface MethodSelectorProps {
  apiMethod: ApiMethod;
  onChange: (method: ApiMethod) => void;
  disabled?: boolean;
}

export function MethodSelector({
  apiMethod,
  onChange,
  disabled = false,
}: MethodSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Método de Requisição:</Label>
          <div className="flex gap-2">
            <Button
              variant={apiMethod === "server-action" ? "default" : "outline"}
              size="sm"
              onClick={() => onChange("server-action")}
              disabled={disabled}
            >
              <Server className="w-4 h-4 mr-2" />
              Server Action (Recomendado)
            </Button>
            <Button
              variant={apiMethod === "api-route" ? "default" : "outline"}
              size="sm"
              onClick={() => onChange("api-route")}
              disabled={disabled}
            >
              <Wifi className="w-4 h-4 mr-2" />
              API Route
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {apiMethod === "server-action"
            ? "✅ Server Actions executam no servidor e são mais seguras"
            : "⚠️ API Routes são úteis para integrações externas"}
        </p>
      </CardContent>
    </Card>
  );
}
