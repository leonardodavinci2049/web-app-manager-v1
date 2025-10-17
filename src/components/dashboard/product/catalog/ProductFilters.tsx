"use client";

import { Grid3X3, List, RotateCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  Category,
  FilterOptions,
  SortOption,
  ViewMode,
} from "../../../../types/types";

interface ProductFiltersProps {
  filters: FilterOptions;
  categories: Category[];
  viewMode: ViewMode;
  onFiltersChange: (filters: FilterOptions) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onResetFilters: () => void;
  totalProducts: number;
  displayedProducts: number;
}

const sortOptions = [
  { value: "name-asc" as SortOption, label: "Nome A-Z" },
  { value: "name-desc" as SortOption, label: "Nome Z-A" },
  { value: "price-asc" as SortOption, label: "Menor Preço" },
  { value: "price-desc" as SortOption, label: "Maior Preço" },
  { value: "newest" as SortOption, label: "Mais Recentes" },
];

export function ProductFilters({
  filters,
  categories,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onResetFilters,
  totalProducts,
  displayedProducts,
}: ProductFiltersProps) {
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.searchTerm && filters.searchTerm.trim() !== "",
    filters.selectedCategory !== "all",
    filters.onlyInStock,
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Barra de Pesquisa e Controles Principais */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nome ou SKU..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={filters.onlyInStock}
              onCheckedChange={(checked) =>
                updateFilter("onlyInStock", checked)
              }
              id="stock-filter"
            />
            <label
              htmlFor="stock-filter"
              className="cursor-pointer text-sm font-medium whitespace-nowrap"
            >
              Apenas c/ estoque
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              updateFilter("sortBy", value as SortOption)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-md border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-sm font-medium">
          Categorias
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                filters.selectedCategory === category.id ? "default" : "outline"
              }
              className={`hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors ${
                filters.selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => updateFilter("selectedCategory", category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="text-muted-foreground flex items-center justify-between border-t pt-4 text-sm">
        <span>
          Mostrando {displayedProducts} de {totalProducts} produtos
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
