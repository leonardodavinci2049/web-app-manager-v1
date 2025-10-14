/**
 * Hook personalizado para tradução com suporte completo a i18n
 *
 * Fornece:
 * - Função de tradução tipada
 * - Interpolação de variáveis
 * - Fallback automático
 * - Gerenciamento de idioma atual
 * - Lista de idiomas disponíveis
 */

"use client";

import { useCallback } from "react";
import { useI18n } from "@/contexts/i18n-context";
import type { Locale, TranslationParams } from "@/lib/i18n";

export interface UseTranslationReturn {
  /**
   * Função de tradução principal
   * @param key - Chave da tradução (ex: 'auth.login.title')
   * @param params - Parâmetros para interpolação (ex: {name: 'João'})
   * @returns String traduzida
   */
  t: (key: string, params?: TranslationParams) => string;

  /**
   * Idioma atual
   */
  locale: Locale;

  /**
   * Função para alterar idioma
   */
  setLocale: (locale: Locale) => void;

  /**
   * Lista de idiomas disponíveis com metadados
   */
  availableLocales: Array<{
    code: Locale;
    name: string;
    flag: string;
  }>;

  /**
   * Estado de carregamento das traduções
   */
  isLoading: boolean;
}

/**
 * Hook simplificado para tradução
 *
 * Extrai apenas as funções essenciais do contexto i18n
 * para facilitar o uso em componentes.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, locale, setLocale } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('auth.login.title')}</h1>
 *       <p>{t('common.hello', { name: 'João' })}</p>
 *       <button onClick={() => setLocale('en')}>
 *         English
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation(): UseTranslationReturn {
  const { t, locale, setLocale, availableLocales, isLoading } = useI18n();

  // Memoiza a função de tradução para otimização
  const memoizedT = useCallback(
    (key: string, params?: TranslationParams) => t(key, params),
    [t],
  );

  return {
    t: memoizedT,
    locale,
    setLocale,
    availableLocales,
    isLoading,
  };
}

/**
 * Hook para tradução com namespace específico
 *
 * Útil para componentes que usam sempre o mesmo prefixo
 *
 * @param namespace - Prefixo das chaves (ex: 'auth.login')
 * @returns Função de tradução com namespace aplicado
 */
export function useNamespacedTranslation(namespace: string) {
  const { t } = useTranslation();

  return useCallback(
    (key: string, params?: TranslationParams) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey, params);
    },
    [t, namespace],
  );
}

/**
 * Hook para pluralização simples
 *
 * @param singularKey - Chave para singular
 * @param pluralKey - Chave para plural
 * @param count - Número para determinar singular/plural
 * @param params - Parâmetros adicionais
 * @returns String traduzida com pluralização
 */
export function usePlural(
  singularKey: string,
  pluralKey: string,
  count: number,
  params?: TranslationParams,
) {
  const { t } = useTranslation();

  return useCallback(() => {
    const key = count === 1 ? singularKey : pluralKey;
    return t(key, { ...params, count });
  }, [t, singularKey, pluralKey, count, params])();
}

/**
 * Hook para formatação de datas/números localizadas
 *
 * @returns Funções de formatação baseadas no idioma atual
 */
export function useLocaleFormatters() {
  const { locale } = useTranslation();

  const localeMap: Record<Locale, string> = {
    pt: "pt-BR",
    en: "en-US",
  };

  const currentLocale = localeMap[locale];

  return {
    /**
     * Formata número com localização
     */
    formatNumber: useCallback(
      (value: number, options?: Intl.NumberFormatOptions) => {
        return new Intl.NumberFormat(currentLocale, options).format(value);
      },
      [currentLocale],
    ),

    /**
     * Formata moeda com localização
     */
    formatCurrency: useCallback(
      (value: number, currency = "BRL") => {
        return new Intl.NumberFormat(currentLocale, {
          style: "currency",
          currency,
        }).format(value);
      },
      [currentLocale],
    ),

    /**
     * Formata data com localização
     */
    formatDate: useCallback(
      (date: Date, options?: Intl.DateTimeFormatOptions) => {
        return new Intl.DateTimeFormat(currentLocale, options).format(date);
      },
      [currentLocale],
    ),

    /**
     * Formata data relativa (há 2 dias, etc.)
     */
    formatRelativeTime: useCallback(
      (value: number, unit: Intl.RelativeTimeFormatUnit) => {
        return new Intl.RelativeTimeFormat(currentLocale, {
          numeric: "auto",
        }).format(value, unit);
      },
      [currentLocale],
    ),
  };
}

/**
 * Hook para informações do idioma atual
 *
 * @returns Metadados do idioma atual
 */
export function useLocaleInfo() {
  const { locale, availableLocales } = useTranslation();

  const currentLocaleInfo = availableLocales.find((l) => l.code === locale);

  return {
    current: currentLocaleInfo,
    isRTL: false, // Nenhum dos idiomas suportados é RTL
    direction: "ltr" as const,
    all: availableLocales,
  };
}

/**
 * Hook para validação de chaves de tradução (apenas desenvolvimento)
 *
 * @param keys - Chaves para validar
 * @returns Status de validação
 */
export function useTranslationValidation(keys: string[]) {
  const { t } = useTranslation();

  if (process.env.NODE_ENV !== "development") {
    return { isValid: true, missingKeys: [] };
  }

  const missingKeys = keys.filter((key) => {
    const result = t(key);
    return result === key; // Se retorna a própria chave, não foi encontrada
  });

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
}
