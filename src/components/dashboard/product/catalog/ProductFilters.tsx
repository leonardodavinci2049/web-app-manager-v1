"use client";

import { Grid3X3, List, Loader2, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  isLoading?: boolean;
}

const sortOptions = [
  { value: "name-asc" as SortOption, label: "Nome A-Z" },
  { value: "name-desc" as SortOption, label: "Nome Z-A" },
  { value: "newest" as SortOption, label: "Mais Recentes" },
  { value: "price-asc" as SortOption, label: "Menor Preço" },
  { value: "price-desc" as SortOption, label: "Maior Preço" },
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
  isLoading = false,
}: ProductFiltersProps) {
  // Estado local para o input de busca
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);

  // Sincronizar o input local quando os filtros mudam externamente
  useEffect(() => {
    setSearchInputValue(filters.searchTerm);
  }, [filters.searchTerm]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Função para executar a busca
  const handleSearch = () => {
    if (searchInputValue.trim() !== filters.searchTerm) {
      updateFilter("searchTerm", searchInputValue.trim());
    }
  };

  // Função para limpar a busca
  const handleClearSearch = () => {
    setSearchInputValue("");
    if (filters.searchTerm !== "") {
      updateFilter("searchTerm", "");
    }
  };

  // Função para lidar com Enter no input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Função para resetar todos os filtros incluindo o input local
  const handleResetFilters = () => {
    setSearchInputValue(""); // Limpa o input local primeiro
    onResetFilters(); // Depois chama a função do pai
  };

  const activeFiltersCount = [
    filters.searchTerm && filters.searchTerm.trim() !== "",
    filters.selectedCategory !== "all",
    filters.onlyInStock,
    filters.sortBy !== "name-asc",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Card de Pesquisa */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center gap-4">
            {/* Linha principal - Input e botão de pesquisa centralizados */}
            <div className="flex items-center justify-center gap-3 w-full">
              <div className="relative w-full max-w-sm lg:w-[33vw] lg:max-w-none">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Buscar por nome ou SKU..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                {searchInputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute top-1/2 right-1 h-6 w-6 p-0 -translate-y-1/2 hover:bg-transparent"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <Button
                onClick={handleSearch}
                disabled={
                  isLoading || searchInputValue.trim() === filters.searchTerm
                }
                size="sm"
                className="gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Pesquisar
              </Button>
            </div>

            {/* Linha secundária - Botões de ação */}
            {(filters.searchTerm || activeFiltersCount > 0) && (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {filters.searchTerm && (
                  <Button
                    variant="outline"
                    onClick={handleClearSearch}
                    disabled={isLoading}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <X className="h-4 w-4" />
                    Limpar Busca
                  </Button>
                )}

                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="gap-2 whitespace-nowrap"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                    Limpar Filtros ({activeFiltersCount})
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filtros de Categoria */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Categorias
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  filters.selectedCategory === category.id
                    ? "default"
                    : "outline"
                }
                className={`transition-colors ${
                  isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-primary hover:text-primary-foreground cursor-pointer"
                } ${
                  filters.selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10"
                }`}
                onClick={() =>
                  !isLoading && updateFilter("selectedCategory", category.id)
                }
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Filtro e Visualização */}
      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={filters.onlyInStock}
                onCheckedChange={(checked) =>
                  updateFilter("onlyInStock", checked)
                }
                id="stock-filter"
                disabled={isLoading}
              />
              <label
                htmlFor="stock-filter"
                className="cursor-pointer text-sm font-medium whitespace-nowrap"
              >
                ESTOQUE
              </label>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  updateFilter("sortBy", value as SortOption)
                }
                disabled={isLoading}
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
                  disabled={isLoading}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="rounded-l-none"
                  disabled={isLoading}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
