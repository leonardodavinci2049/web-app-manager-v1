"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface ResultsListProps {
  taxonomies: TaxonomyData[];
  isPending?: boolean;
  hasSearched?: boolean;
}

export function ResultsList({
  taxonomies,
  isPending = false,
  hasSearched = false,
}: ResultsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Resultados da Busca
          {taxonomies.length > 0 && (
            <Badge variant="secondary">{taxonomies.length} item(ns)</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Carregando taxonomias...</span>
          </div>
        ) : taxonomies.length > 0 ? (
          <div className="grid gap-4">
            {taxonomies.map((taxonomy, index) => (
              <TaxonomyCard
                key={`${taxonomy.ID_TAXONOMY || index}`}
                taxonomy={taxonomy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {hasSearched
                ? "Nenhuma taxonomia encontrada com os parâmetros informados."
                : "Execute uma busca para ver os resultados."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TaxonomyCardProps {
  taxonomy: TaxonomyData;
}

function TaxonomyCard({ taxonomy }: TaxonomyCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-lg">
              {taxonomy.TAXONOMIA || "N/A"}
            </h4>
            <p className="text-sm text-muted-foreground">
              ID: {taxonomy.ID_TAXONOMY || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Slug:</strong> {taxonomy.SLUG || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Parent ID:</strong> {taxonomy.PARENT_ID || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Level:</strong> {taxonomy.LEVEL || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Ordem:</strong> {taxonomy.ORDEM || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Registros:</strong> {taxonomy.QT_RECORDS || "N/A"}
            </p>
            <p className="text-sm">
              <strong>ID Imagem:</strong> {taxonomy.ID_IMAGEM || "N/A"}
            </p>
          </div>
        </div>
        {(taxonomy.META_TITLE ||
          taxonomy.META_DESCRIPTION ||
          taxonomy.ANOTACOES) && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {taxonomy.META_TITLE && (
              <p className="text-sm">
                <strong>Meta Title:</strong> {taxonomy.META_TITLE}
              </p>
            )}
            {taxonomy.META_DESCRIPTION && (
              <p className="text-sm">
                <strong>Meta Description:</strong> {taxonomy.META_DESCRIPTION}
              </p>
            )}
            {taxonomy.ANOTACOES && (
              <p className="text-sm">
                <strong>Anotações:</strong> {taxonomy.ANOTACOES}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
