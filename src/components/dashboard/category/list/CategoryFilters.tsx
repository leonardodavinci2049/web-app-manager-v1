"use client";

/**
 * Componente de filtros para listagem de categorias
 *
 * Fornece busca, ordenação e filtros de status para categorias
 */

import { Filter, Grid3X3, List, RotateCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

/**
 * Opções de status
 */
const statusOptions = [
  { value: 0, key: "statusActive" }, // Ativos
  { value: 1, key: "statusInactive" }, // Inativos
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
    filters.filterStatus !== 0, // Não é status padrão (ativos)
  ].filter(Boolean).length;

  // Handler para mudança de ordenação
  const handleSortChange = (value: string) => {
    const [column, order] = value.split("-").map(Number);
    onFiltersChange({ sortColumn: column, sortOrder: order });
  };

  // Valor atual de ordenação para o Select
  const currentSortValue = `${filters.sortColumn}-${filters.sortOrder}`;

  return (
    <div className="space-y-6">
      {/* Barra de Busca Principal */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Campo de Busca */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="search-input">
            {t("dashboard.category.list.searchPlaceholder")}
          </Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="search-input"
              placeholder={t("dashboard.category.list.searchPlaceholder")}
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
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

        {/* Tipo de Busca - Badges como Radio */}
        <div className="space-y-2">
          <Label>{t("dashboard.category.list.buttonSearch")}</Label>
          <div className="flex gap-2">
            <Badge
              variant={filters.searchType === "name" ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => onFiltersChange({ searchType: "name" })}
            >
              {t("dashboard.category.list.searchByName")}
            </Badge>
            <Badge
              variant={filters.searchType === "id" ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => onFiltersChange({ searchType: "id" })}
            >
              {t("dashboard.category.list.searchById")}
            </Badge>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button onClick={onSearch} disabled={isLoading} className="gap-2">
            <Search className="h-4 w-4" />
            {t("dashboard.category.list.buttonSearch")}
          </Button>
          <Button
            variant="outline"
            onClick={onClear}
            disabled={isLoading}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("dashboard.category.list.buttonClear")}
          </Button>
        </div>
      </div>

      {/* Filtros Secundários */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Ordenação */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">
              {t("dashboard.category.list.sortBy")}
            </Label>
          </div>
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
                  {t(`category.list.${option.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Container de Filtro de Status e Modo de Visualização */}
        <div className="flex items-center gap-6">
          {/* Filtro de Status */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              {t("dashboard.category.list.filterStatus")}:
            </Label>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Badge
                  key={status.value}
                  variant={
                    filters.filterStatus === status.value
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() =>
                    onFiltersChange({ filterStatus: status.value })
                  }
                >
                  {t(`category.list.${status.key}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Botões de Modo de Visualização */}
          <div className="flex items-center gap-2 border-l pl-6">
            <Label className="text-sm font-medium">
              {t("dashboard.category.list.viewMode")}:
            </Label>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                disabled={isLoading}
                className="h-8 w-8 p-0"
                title={t("dashboard.category.list.viewModeGrid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                disabled={isLoading}
                className="h-8 w-8 p-0"
                title={t("dashboard.category.list.viewModeList")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
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
