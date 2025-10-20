"use client";

import { Grid3X3, List, Loader2, Search, X } from "lucide-react";
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
import { mockCategoryHierarchy } from "@/mock/dashboard/mocked-statistics-data";
import type {
  Category,
  FilterOptions,
  SortOption,
  Subcategory,
  Subgroup,
  ViewMode,
} from "@/types/types";

interface ProductFiltersImprovedProps {
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

export function ProductFiltersImproved({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onResetFilters,
  totalProducts,
  displayedProducts,
  isLoading = false,
}: ProductFiltersImprovedProps) {
  // Estado local para o input de busca
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);

  // Estado para subcategorias disponíveis
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);

  // Estado para subgrupos disponíveis
  const [availableSubgroups, setAvailableSubgroups] = useState<Subgroup[]>([]);

  // Sincronizar o input local quando os filtros mudam externamente
  useEffect(() => {
    setSearchInputValue(filters.searchTerm);
  }, [filters.searchTerm]);

  // Atualizar subcategorias quando a categoria muda
  useEffect(() => {
    if (filters.selectedCategory && filters.selectedCategory !== "all") {
      const categoryData =
        mockCategoryHierarchy[
          filters.selectedCategory as keyof typeof mockCategoryHierarchy
        ];
      if (categoryData) {
        setAvailableSubcategories(categoryData.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
      setAvailableSubgroups([]);
      // Limpar subcategoria e subgrupo quando "Todas" for selecionada
      if (filters.selectedSubcategory || filters.selectedSubgroup) {
        onFiltersChange({
          ...filters,
          selectedSubcategory: undefined,
          selectedSubgroup: undefined,
        });
      }
    }
  }, [
    filters.selectedCategory,
    filters.selectedSubcategory,
    filters.selectedSubgroup,
    filters,
    onFiltersChange,
  ]);

  // Atualizar subgrupos quando a subcategoria muda
  useEffect(() => {
    if (filters.selectedSubcategory && filters.selectedSubcategory !== "all") {
      const subcategory = availableSubcategories.find(
        (sub) => sub.id === filters.selectedSubcategory,
      );
      if (subcategory?.subgroups) {
        setAvailableSubgroups(subcategory.subgroups);
      } else {
        setAvailableSubgroups([]);
      }
    } else {
      setAvailableSubgroups([]);
      // Limpar subgrupo quando subcategoria muda
      if (filters.selectedSubgroup) {
        onFiltersChange({ ...filters, selectedSubgroup: undefined });
      }
    }
  }, [
    filters.selectedSubcategory,
    filters.selectedSubgroup,
    availableSubcategories,
    filters,
    onFiltersChange,
  ]);

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

  // Função para alterar categoria (limpa subcategoria automaticamente)
  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      selectedCategory: categoryId,
      selectedSubcategory: undefined, // Limpa subcategoria
    });
  };

  // Função para remover filtro específico
  const removeFilter = (
    filterType: "category" | "subcategory" | "subgroup" | "search" | "stock",
  ) => {
    switch (filterType) {
      case "category":
        onFiltersChange({
          ...filters,
          selectedCategory: "all",
          selectedSubcategory: undefined,
          selectedSubgroup: undefined,
        });
        break;
      case "subcategory":
        onFiltersChange({
          ...filters,
          selectedSubcategory: undefined,
          selectedSubgroup: undefined,
        });
        break;
      case "subgroup":
        updateFilter("selectedSubgroup", undefined);
        break;
      case "search":
        handleClearSearch();
        break;
      case "stock":
        updateFilter("onlyInStock", false);
        break;
    }
  };

  // Calcular filtros ativos para exibir como badges
  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      activeFilters.push({
        type: "search" as const,
        label: `Busca: "${filters.searchTerm}"`,
        value: filters.searchTerm,
      });
    }

    if (filters.selectedCategory && filters.selectedCategory !== "all") {
      const categoryData =
        mockCategoryHierarchy[
          filters.selectedCategory as keyof typeof mockCategoryHierarchy
        ];
      if (categoryData) {
        activeFilters.push({
          type: "category" as const,
          label: categoryData.name,
          value: filters.selectedCategory,
        });
      }
    }

    if (filters.selectedSubcategory) {
      const subcategory = availableSubcategories.find(
        (sub) => sub.id === filters.selectedSubcategory,
      );
      if (subcategory) {
        activeFilters.push({
          type: "subcategory" as const,
          label: subcategory.name,
          value: filters.selectedSubcategory,
        });
      }
    }

    if (filters.selectedSubgroup) {
      const subgroup = availableSubgroups.find(
        (sub) => sub.id === filters.selectedSubgroup,
      );
      if (subgroup) {
        activeFilters.push({
          type: "subgroup" as const,
          label: subgroup.name,
          value: filters.selectedSubgroup,
        });
      }
    }

    if (filters.onlyInStock) {
      activeFilters.push({
        type: "stock" as const,
        label: "Apenas em Estoque",
        value: "stock",
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-6">
      {/* Card de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Card de Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            🏷️ Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Linha de Dropdowns: Família, Grupo, Subgrupo + Botão Limpar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Dropdown Família (Categoria) */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Família
              </div>
              <Select
                value={filters.selectedCategory}
                onValueChange={handleCategoryChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma família" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Famílias</SelectItem>
                  {Object.values(mockCategoryHierarchy)
                    .filter((cat) => cat.id !== "all")
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dropdown Grupo (Subcategoria) */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Grupo
              </div>
              <Select
                value={filters.selectedSubcategory || "all"}
                onValueChange={(value) =>
                  updateFilter(
                    "selectedSubcategory",
                    value === "all" ? undefined : value,
                  )
                }
                disabled={isLoading || availableSubcategories.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      availableSubcategories.length === 0
                        ? "Selecione uma família primeiro"
                        : "Selecione um grupo"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Grupos</SelectItem>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dropdown Subgrupo */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Subgrupo
              </div>
              <Select
                value={filters.selectedSubgroup || "all"}
                onValueChange={(value) =>
                  updateFilter(
                    "selectedSubgroup",
                    value === "all" ? undefined : value,
                  )
                }
                disabled={isLoading || availableSubgroups.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      availableSubgroups.length === 0
                        ? "Selecione um grupo primeiro"
                        : "Selecione um subgrupo"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Subgrupos</SelectItem>
                  {availableSubgroups.map((subgroup) => (
                    <SelectItem key={subgroup.id} value={subgroup.id}>
                      {subgroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros - só aparece quando há categoria selecionada */}
            <div className="flex justify-end">
              {filters.selectedCategory !== "all" && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Filtros Ativos como Badges */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Filtros ativos
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={`${filter.type}-${index}`}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs"
                  >
                    <span>{filter.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter.type)}
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      disabled={isLoading}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                ))}

                {/* Botão Limpar Filtros */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-6 px-2 text-xs"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controles de Filtro e Visualização */}
      <Card>
        <CardContent className="pt-6">
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
                APENAS EM ESTOQUE
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
        {hasActiveFilters && (
          <span>
            {activeFilters.length} filtro{activeFilters.length !== 1 ? "s" : ""}{" "}
            ativo{activeFilters.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
