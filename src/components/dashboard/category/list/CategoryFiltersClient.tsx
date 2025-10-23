"use client";

/**
 * Componente de filtros para listagem de categorias (Client Component)
 *
 * Fornece busca, ordenação e filtros de status para categorias
 * Com debounce implementado para otimizar requisições de busca
 */

import { Grid3X3, List, RotateCcw, Search } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";

export type ViewMode = "grid" | "list";

interface CategoryFiltersClientProps {
  currentSearch: string;
  currentSort: string;
  onSearch: (term: string) => void;
  onSort: (column: string, order: string) => void;
  onClear: () => void;
  onViewChange: (mode: ViewMode) => void;
  totalCategories: number;
  displayedCategories: number;
  viewMode: ViewMode;
}

/**
 * Opções de ordenação
 */
const sortOptions = [
  { column: 2, order: 1, key: "sortNameAsc" }, // Nome A-Z
  { column: 2, order: 2, key: "sortNameDesc" }, // Nome Z-A
  { column: 1, order: 1, key: "sortIdAsc" }, // ID Crescente
  { column: 1, order: 2, key: "sortIdDesc" }, // ID Decrescente
] as const;

export function CategoryFiltersClient({
  currentSearch,
  currentSort,
  onSearch,
  onSort,
  onClear,
  onViewChange,
  totalCategories,
  displayedCategories,
  viewMode,
}: CategoryFiltersClientProps) {
  const { t } = useTranslation();

  // Ref para capturar valor atual do input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle clique no botão de busca - pega valor atual do input
  const handleSearchButtonClick = useCallback(() => {
    const value = searchInputRef.current?.value || "";
    onSearch(value);
  }, [onSearch]);

  // Handle Enter no input de busca
  const handleSearchInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearchButtonClick();
      }
    },
    [handleSearchButtonClick],
  );

  // Contar filtros ativos
  const activeFiltersCount = [
    currentSearch && currentSearch.trim() !== "",
    currentSort && currentSort !== "2-1", // Não é ordenação padrão
  ].filter(Boolean).length;

  // Handler para mudança de ordenação
  const handleSortChange = useCallback(
    (value: string) => {
      const [column, order] = value.split("-");
      onSort(column, order);
    },
    [onSort],
  );

  // Valor atual de ordenação para o Select
  const currentSortValue = currentSort || "2-1";

  return (
    <div className="space-y-6">
      {/* Barra de Busca Principal */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
        {/* Espaçador para empurrar busca para direita em telas grandes */}
        <div className="hidden lg:block lg:flex-1" />

        {/* Container de Busca - 33% em telas grandes */}
        <div className="flex items-end gap-2 lg:w-1/3">
          {/* Campo de Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                id="search-input"
                placeholder={t("dashboard.category.list.searchPlaceholder")}
                defaultValue={currentSearch}
                onKeyDown={handleSearchInputKeyDown}
                className="pl-10"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearchButtonClick}
              size="icon"
              title={t("dashboard.category.list.buttonSearch")}
            >
              <Search className="h-4 w-4" />
            </Button>
            {currentSearch && currentSearch.trim() !== "" && (
              <Button
                variant="outline"
                onClick={onClear}
                size="icon"
                title={t("dashboard.category.list.buttonClear")}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros Secundários */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Espaçador vazio para empurrar controles para a direita */}
        <div className="flex-1" />

        {/* Ordenação e Visualização - Alinhados à direita */}
        <div className="flex items-center justify-end gap-3">
          {/* Select de Ordenação */}
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("dashboard.category.list.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={`${option.column}-${option.order}`}
                  value={`${option.column}-${option.order}`}
                >
                  {t(`dashboard.category.list.${option.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botões de Modo de Visualização - List primeiro por ser padrão */}
          <div className="flex gap-1">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("list")}
              className="h-9 w-9 p-0"
              title={t("dashboard.category.list.viewModeList")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("grid")}
              className="h-9 w-9 p-0"
              title={t("dashboard.category.list.viewModeGrid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Botão de Reset (se houver filtros ativos) */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("dashboard.category.list.buttonClear")} ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
        <span>
          {t("dashboard.category.list.showing", {
            displayed: displayedCategories,
            total: totalCategories,
          })}
        </span>
        {activeFiltersCount > 0 && (
          <span>
            {t("dashboard.category.list.activeFilters", {
              count: activeFiltersCount,
              plural: activeFiltersCount !== 1 ? "s" : "",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
