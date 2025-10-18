"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResponseInfoProps {
  responseInfo?: {
    statusCode?: number;
    message?: string;
    quantity?: number;
    totalPages?: number;
  } | null;
}

export function ResponseInfo({ responseInfo }: ResponseInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Resposta</CardTitle>
      </CardHeader>
      <CardContent>
        {responseInfo ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status Code:</span>
              <Badge
                variant={
                  responseInfo.statusCode === 100200 ? "default" : "destructive"
                }
              >
                {responseInfo.statusCode}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade:</span>
              <Badge variant="secondary">{responseInfo.quantity || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Páginas:</span>
              <Badge variant="outline">{responseInfo.totalPages || 0}</Badge>
            </div>
            {responseInfo.message && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {responseInfo.message}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Execute uma busca para ver informações da resposta
          </p>
        )}
      </CardContent>
    </Card>
  );
}
