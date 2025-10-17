"use client";

import { useCallback, useState } from "react";

/**
 * States para operações de API
 */
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook genérico para chamadas de API
 */
export function useApiCall<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook para operações CRUD com cache simples
 */
export function useApiResource<T>() {
  const [cache, setCacheState] = useState<Map<string, T>>(new Map());
  const apiCall = useApiCall<T>();

  const getCached = useCallback(
    (key: string) => {
      return cache.get(key) || null;
    },
    [cache],
  );

  const setCache = useCallback((key: string, data: T) => {
    setCacheState((prev) => new Map(prev).set(key, data));
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      setCacheState((prev) => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
    } else {
      setCacheState(new Map());
    }
  }, []);

  const executeWithCache = useCallback(
    async (key: string, apiCallFn: () => Promise<T>, useCache = true) => {
      // Verificar cache primeiro
      if (useCache) {
        const cached = getCached(key);
        if (cached) {
          return cached;
        }
      }

      // Executar chamada da API
      const result = await apiCallFn();

      // Salvar no cache
      setCache(key, result);

      return result;
    },
    [getCached, setCache],
  );

  return {
    ...apiCall,
    cache,
    getCached,
    setCache,
    clearCache,
    executeWithCache,
  };
}
