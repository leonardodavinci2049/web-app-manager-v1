"use client";

import { useCallback, useEffect, useState } from "react";
import type { PtypeData } from "@/services/api/ptype/types/ptype-types";

export interface PtypeOption {
  id: number;
  name: string;
}

/**
 * Hook for loading and managing product types from API
 * Loads product types list from /api/ptype/list endpoint
 */
export function usePtypes() {
  const [ptypes, setPtypes] = useState<PtypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transforms PtypeData array into PtypeOption array
   * @param ptypeData - Array of product type data from API
   * @returns Array of product type options
   */
  const transformPtypeData = useCallback(
    (ptypeData: PtypeData[]): PtypeOption[] => {
      return ptypeData
        .filter((ptype) => ptype.TIPO) // Filter out null/empty type names
        .map((ptype) => ({
          id: ptype.ID_TIPO,
          name: ptype.TIPO || "",
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    },
    [],
  );

  /**
   * Loads product types using fetch from API endpoint
   */
  const loadPtypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ptype/list");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (data.success) {
        const transformedPtypes = transformPtypeData(data.types);
        setPtypes(transformedPtypes);
      } else {
        throw new Error(data.error || "Erro ao carregar tipos de produto");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar tipos de produto";
      setError(errorMessage);
      console.error("Error loading product types:", err);
    } finally {
      setIsLoading(false);
    }
  }, [transformPtypeData]);

  // Load product types on component mount
  useEffect(() => {
    loadPtypes();
  }, [loadPtypes]);

  return {
    ptypes,
    isLoading,
    error,
    refetch: loadPtypes,
  };
}
