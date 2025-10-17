"use client";

import { Search, X } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

interface TaxonomySearchProps {
  onSearch: (query: string, searchType: "name" | "id") => void;
  isLoading?: boolean;
}

// Mínimo de caracteres para iniciar busca por nome
const MIN_SEARCH_LENGTH = 3;
// Tempo de debounce em milissegundos
const DEBOUNCE_TIME = 800;

/**
 * Componente de busca para taxonomias
 * Permite buscar por nome ou ID da taxonomia
 */
export function TaxonomySearch({
  onSearch,
  isLoading = false,
}: TaxonomySearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "id">("name");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função de debounce customizada
  const debouncedSearch = useCallback(
    (searchQuery: string, type: "name" | "id") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(searchQuery, type);
      }, DEBOUNCE_TIME);
    },
    [onSearch],
  );

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Auto-detecta se é busca por ID (somente números)
    const isNumeric = /^\d+$/.test(value.trim());
    const currentSearchType = isNumeric && value.trim() ? "id" : "name";
    setSearchType(currentSearchType);

    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Valida mínimo de caracteres
    if (value.trim()) {
      // Para busca por ID, permite qualquer quantidade de números
      // Para busca por nome, exige mínimo de caracteres
      if (
        currentSearchType === "id" ||
        value.trim().length >= MIN_SEARCH_LENGTH
      ) {
        debouncedSearch(value, currentSearchType);
      }
      // Se não atingiu o mínimo, não faz nada (não limpa nem busca)
    } else {
      // Se o input estiver vazio, limpa a busca imediatamente
      onSearch("", "name");
    }
  };

  const clearSearch = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setQuery("");
    setSearchType("name");
    onSearch("", "name");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("dashboard.taxonomies.searchPlaceholder")}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isLoading}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={clearSearch}
            disabled={isLoading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {query && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {searchType === "id"
              ? t("dashboard.taxonomies.searchById")
              : query.length < MIN_SEARCH_LENGTH
                ? `Digite ${MIN_SEARCH_LENGTH - query.length} caractere(s) para buscar`
                : t("dashboard.taxonomies.searchByName")}
          </span>
        </div>
      )}
    </div>
  );
}
