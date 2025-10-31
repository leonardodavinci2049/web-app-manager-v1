"use client";

import { useCallback, useEffect, useState } from "react";
import type { BrandData } from "@/services/api/brand/types/brand-types";

export interface BrandOption {
  id: number;
  name: string;
}

/**
 * Hook for loading and managing brands from API
 * Loads brand list from /api/brand/list endpoint
 */
export function useBrands() {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transforms BrandData array into BrandOption array
   * @param brandData - Array of brand data from API
   * @returns Array of brand options
   */
  const transformBrandData = useCallback(
    (brandData: BrandData[]): BrandOption[] => {
      return brandData
        .filter((brand) => brand.MARCA) // Filter out null/empty brand names
        .map((brand) => ({
          id: brand.ID_MARCA,
          name: brand.MARCA || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    },
    [],
  );

  /**
   * Loads brands using fetch from API endpoint
   */
  const loadBrands = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/brand/list");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (data.success) {
        const transformedBrands = transformBrandData(data.brands);
        setBrands(transformedBrands);
      } else {
        throw new Error(data.error || "Erro ao carregar marcas");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar marcas";
      setError(errorMessage);
      console.error("Error loading brands:", err);
    } finally {
      setIsLoading(false);
    }
  }, [transformBrandData]);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  return {
    brands,
    isLoading,
    error,
    refetch: loadBrands,
  };
}
