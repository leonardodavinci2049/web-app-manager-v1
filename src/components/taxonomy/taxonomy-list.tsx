"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";
import { TaxonomySearch } from "./taxonomy-search";
import { TaxonomyTable } from "./taxonomy-table";

interface TaxonomyListProps {
  initialTaxonomies: TaxonomyData[];
  initialTotal: number;
}

/**
 * Componente principal de listagem de taxonomias com busca
 * Este é um componente cliente que gerencia o estado de busca
 */
export function TaxonomyList({
  initialTaxonomies,
  initialTotal,
}: TaxonomyListProps) {
  const { t } = useTranslation();
  const [taxonomies, setTaxonomies] =
    useState<TaxonomyData[]>(initialTaxonomies);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultCount, setResultCount] = useState(initialTotal);

  // Função para realizar busca
  const performSearch = useCallback(
    async (query: string, type: "name" | "id") => {
      // Se a query estiver vazia, restaura os dados iniciais sem fazer requisição
      if (!query.trim()) {
        setTaxonomies(initialTaxonomies);
        setResultCount(initialTotal);
        return;
      }

      // Valida mínimo de 3 caracteres para busca por nome (API exige isso)
      if (type === "name" && query.trim().length < 3) {
        // Não faz nada, aguarda o usuário digitar mais caracteres
        return;
      }

      setIsLoading(true);
      try {
        const searchParams: Record<string, unknown> = {};

        if (type === "id") {
          const taxonomyId = parseInt(query.trim(), 10);
          if (!Number.isNaN(taxonomyId)) {
            searchParams.pe_id_taxonomy = taxonomyId;
          }
        } else {
          searchParams.pe_taxonomia = query.trim();
        }

        const response = await TaxonomyServiceApi.findTaxonomies(searchParams);

        if (TaxonomyServiceApi.isValidTaxonomyResponse(response)) {
          const taxonomyList = TaxonomyServiceApi.extractTaxonomyList(response);
          setTaxonomies(taxonomyList);
          setResultCount(response.quantity || taxonomyList.length);

          // Se não há resultados, exibe mensagem informativa
          if (taxonomyList.length === 0) {
            toast.info(
              "Nenhuma taxonomia encontrada com os critérios de busca",
            );
          }
        } else {
          throw new Error(response.message || "Erro ao buscar taxonomias");
        }
      } catch (error) {
        console.error("Erro na busca de taxonomias:", error);

        // Mensagem mais amigável para o usuário
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao conectar com o servidor";

        toast.error(`Não foi possível buscar as taxonomias: ${errorMessage}`);
        setTaxonomies([]);
        setResultCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [initialTaxonomies, initialTotal],
  );

  // Handler para busca
  const handleSearch = useCallback(
    (query: string, type: "name" | "id") => {
      setSearchQuery(query);
      performSearch(query, type);
    },
    [performSearch],
  );

  // Carrega dados iniciais quando componente monta
  useEffect(() => {
    setTaxonomies(initialTaxonomies);
    setResultCount(initialTotal);
  }, [initialTaxonomies, initialTotal]);

  return (
    <div className="space-y-6">
      {/* Busca */}
      <TaxonomySearch onSearch={handleSearch} isLoading={isLoading} />

      {/* Resultados */}
      {searchQuery && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.taxonomies.foundResults", { count: resultCount })}
          </p>
        </div>
      )}

      {/* Tabela */}
      <TaxonomyTable taxonomies={taxonomies} isLoading={isLoading} />
    </div>
  );
}
