"use client";

/**
 * Componente de filtros para listagem de categorias
 *
 * Fornece busca, ordenação e filtros de status para categorias
 */

import { Grid3X3, List, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryFilterOptions } from "@/hooks/dashboard/category/use-category-filter";
import { useTranslation } from "@/hooks/use-translation";

export type ViewMode = "grid" | "list";

interface CategoryFiltersProps {
  filters: CategoryFilterOptions;
  onFiltersChange: (filters: Partial<CategoryFilterOptions>) => void;
  onSearch: () => void;
  onClear: () => void;
  totalCategories: number;
  displayedCategories: number;
  isLoading?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
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

export function CategoryFilters({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  totalCategories,
  displayedCategories,
  isLoading = false,
  viewMode,
  onViewModeChange,
}: CategoryFiltersProps) {
  const { t } = useTranslation();

  // Contar filtros ativos
  const activeFiltersCount = [
    filters.searchTerm && filters.searchTerm.trim() !== "",
    filters.sortColumn !== 2 || filters.sortOrder !== 1, // Não é ordenação padrão
  ].filter(Boolean).length;

  // Handler para mudança de ordenação
  const handleSortChange = (value: string) => {
    const [column, order] = value.split("-").map(Number);
    onFiltersChange({ sortColumn: column, sortOrder: order });
    // Busca automaticamente ao mudar ordenação (usando queueMicrotask para evitar loop)
    queueMicrotask(() => onSearch());
  };

  // Valor atual de ordenação para o Select
  const currentSortValue = `${filters.sortColumn}-${filters.sortOrder}`;

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
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="search-input"
                placeholder={t("dashboard.category.list.searchPlaceholder")}
                value={filters.searchTerm}
                onChange={(e) =>
                  onFiltersChange({ searchTerm: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button
              onClick={onSearch}
              disabled={isLoading}
              size="icon"
              title={t("dashboard.category.list.buttonSearch")}
            >
              <Search className="h-4 w-4" />
            </Button>
            {filters.searchTerm && filters.searchTerm.trim() !== "" && (
              <Button
                variant="outline"
                onClick={onClear}
                disabled={isLoading}
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
          <Select
            value={currentSortValue}
            onValueChange={handleSortChange}
            disabled={isLoading}
          >
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

          {/* Botões de Modo de Visualização */}
          <div className="flex gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              disabled={isLoading}
              className="h-9 w-9 p-0"
              title={t("dashboard.category.list.viewModeGrid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              disabled={isLoading}
              className="h-9 w-9 p-0"
              title={t("dashboard.category.list.viewModeList")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Botão de Reset (se houver filtros ativos) */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={isLoading}
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
          Mostrando {displayedCategories} de {totalCategories} categorias
        </span>
        {activeFiltersCount > 0 && (
          <span>
            {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""}{" "}
            ativo{activeFiltersCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
