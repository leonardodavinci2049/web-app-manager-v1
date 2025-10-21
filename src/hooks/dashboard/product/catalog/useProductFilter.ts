"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  FilterOptions,
  Product,
  SortOption,
} from "../../../../types/types";
import { debounce } from "../../../../utils/common-utils";

interface UseProductFilterProps {
  products: Product[];
  pageSize: number;
}

export function useProductFilter({
  products,
  pageSize,
}: UseProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    selectedCategory: "all",
    onlyInStock: false,
    sortBy: "name-asc" as SortOption,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search to avoid excessive filtering
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(filters.searchTerm);
  }, [filters.searchTerm, debouncedSetSearch]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search term (name or SKU)
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toString().includes(searchLower),
      );
    }

    // Filter by category
    if (filters.selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === filters.selectedCategory,
      );
    }

    // Filter by stock
    if (filters.onlyInStock) {
      result = result.filter((product) => product.stock > 0);
    }

    // Sort products
    switch (filters.sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => {
          const priceA = a.promotionalPrice || a.normalPrice;
          const priceB = b.promotionalPrice || b.normalPrice;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = a.promotionalPrice || a.normalPrice;
          const priceB = b.promotionalPrice || b.normalPrice;
          return priceB - priceA;
        });
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    debouncedSearchTerm,
    filters.selectedCategory,
    filters.onlyInStock,
    filters.sortBy,
  ]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "all",
      onlyInStock: false,
      sortBy: "name-asc",
    });
    setCurrentPage(1);
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset pagination when filters change
  };

  // Reset pagination when filters change (except search term)
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    paginatedProducts,
    totalProducts: filteredProducts.length,
    displayedProducts: paginatedProducts.length,
    hasMore,
    isLoading,
    loadMore,
  };
}
