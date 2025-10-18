import { useCallback, useState, useTransition } from "react";
import { searchTaxonomiesAction } from "@/app/actions/action-taxonomy-test";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

export type ApiMethod = "server-action" | "api-route";

interface SearchResult {
  success: boolean;
  data?: TaxonomyData[];
  responseInfo?: {
    statusCode: number;
    message: string;
    quantity: number;
    totalPages: number;
  };
  error?: string;
  errorType?: string;
  retryable?: boolean;
}

interface UseTaxonomySearchOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  onSuccess?: (
    data: TaxonomyData[],
    info: SearchResult["responseInfo"],
  ) => void;
  onError?: (error: string, errorType?: string) => void;
}

/**
 * Hook customizado para busca de taxonomias
 * Suporta Server Actions e API Routes com retry automático
 */
export function useTaxonomySearch(options: UseTaxonomySearchOptions = {}) {
  const [isPending, startTransition] = useTransition();
  const [taxonomies, setTaxonomies] = useState<TaxonomyData[]>([]);
  const [responseInfo, setResponseInfo] = useState<
    SearchResult["responseInfo"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [apiMethod, setApiMethod] = useState<ApiMethod>("server-action");

  /**
   * Executa busca via Server Action
   */
  const searchViaServerAction = useCallback(
    async (params: unknown): Promise<SearchResult> => {
      return await searchTaxonomiesAction(params);
    },
    [],
  );

  /**
   * Executa busca via API Route
   */
  const searchViaApiRoute = useCallback(
    async (params: unknown): Promise<SearchResult> => {
      const response = await fetch("/api/taxonomy/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    [],
  );

  /**
   * Busca taxonomias com retry automático
   */
  const search = useCallback(
    async (params: unknown, retryCount = 0) => {
      // Limpa estados anteriores
      setError(null);
      setTaxonomies([]);
      setResponseInfo(null);

      startTransition(() => {
        (async () => {
          try {
            // Escolhe método de busca
            const searchFn =
              apiMethod === "server-action"
                ? searchViaServerAction
                : searchViaApiRoute;

            const result = await searchFn(params);

            // Se sucesso
            if (result.success && result.data) {
              setTaxonomies(result.data);
              setResponseInfo(result.responseInfo || null);
              options.onSuccess?.(result.data, result.responseInfo);
              return;
            }

            // Se erro mas retryable
            if (
              !result.success &&
              result.retryable &&
              options.autoRetry &&
              retryCount < (options.maxRetries || 3)
            ) {
              console.warn(
                `⚠️ Tentando novamente... (${retryCount + 1}/${options.maxRetries || 3})`,
              );

              // Espera exponencial: 1s, 2s, 4s
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * 2 ** retryCount),
              );

              search(params, retryCount + 1);
              return;
            }

            // Erro final
            const errorMessage = result.error || "Erro desconhecido";
            setError(errorMessage);
            options.onError?.(errorMessage, result.errorType);
          } catch (err) {
            console.error("❌ [useTaxonomySearch] Erro:", err);
            const errorMessage =
              err instanceof Error ? err.message : "Erro desconhecido";
            setError(errorMessage);
            options.onError?.(errorMessage);
          }
        })();
      });
    },
    [apiMethod, searchViaServerAction, searchViaApiRoute, options],
  );

  /**
   * Reseta todos os estados
   */
  const reset = useCallback(() => {
    setTaxonomies([]);
    setResponseInfo(null);
    setError(null);
  }, []);

  /**
   * Altera método de busca
   */
  const changeMethod = useCallback((method: ApiMethod) => {
    setApiMethod(method);
  }, []);

  return {
    // Estados
    isPending,
    taxonomies,
    responseInfo,
    error,
    apiMethod,

    // Ações
    search,
    reset,
    changeMethod,
  };
}
