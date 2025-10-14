"use client";

/**
 * Context Provider para Internacionalização (i18n)
 *
 * Fornece gerenciamento global de estado para o sistema de idiomas,
 * incluindo persistência, hot-reload e integração com componentes.
 */

import type React from "react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createTranslationFunction,
  defaultLocale,
  getAvailableLocales,
  getCurrentLocale,
  initializeI18nSystem,
  type Locale,
  setCurrentLocale,
  type Translation,
  type TranslationFunction,
  type TranslationParams,
} from "@/lib/i18n";
import enTranslations from "@/lib/translations/en.json";
// Importações estáticas das traduções
import ptTranslations from "@/lib/translations/pt.json";

// Interface do Context
interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationFunction;
  availableLocales: ReturnType<typeof getAvailableLocales>;
  isLoading: boolean;
}

// Contexto
const I18nContext = createContext<I18nContextValue | null>(null);

// Props do Provider
interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

/**
 * Provider de Internacionalização
 *
 * Envolve a aplicação para fornecer acesso global ao sistema i18n
 */
export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || defaultLocale,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [translations] = useState<{
    pt: Translation;
    en: Translation;
  }>({ pt: ptTranslations as Translation, en: enTranslations as Translation });

  // Inicialização das traduções
  useEffect(() => {
    // Inicializa o sistema i18n (mostra config em dev)
    initializeI18nSystem();

    // Define o idioma inicial (localStorage > prop > padrão)
    const savedLocale = getCurrentLocale();
    setLocaleState(savedLocale);
    setIsLoading(false);
  }, []);

  // Escuta mudanças do localStorage (para sincronizar entre abas)
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === "dashboard-preferred-locale" && event.newValue) {
        setLocaleState(event.newValue as Locale);
      }
    }

    // Escuta eventos customizados de mudança de idioma
    function handleLocaleChange(event: CustomEvent) {
      setLocaleState(event.detail);
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "localeChange",
      handleLocaleChange as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localeChange",
        handleLocaleChange as EventListener,
      );
    };
  }, []);

  // Função para alterar idioma
  const setLocale = useCallback((newLocale: Locale) => {
    setCurrentLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  // Função de tradução
  const t = useCallback(
    (key: string, params?: TranslationParams): string => {
      const currentTranslations = translations[locale];
      const fallbackTranslations =
        locale !== defaultLocale ? translations[defaultLocale] : undefined;

      if (!currentTranslations && !fallbackTranslations) {
        return key;
      }

      const translateFn = createTranslationFunction(
        currentTranslations,
        fallbackTranslations,
      );
      return translateFn(key, params);
    },
    [locale, translations],
  );

  // Idiomas disponíveis
  const availableLocales = getAvailableLocales();

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    availableLocales,
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook para usar o contexto de i18n
 *
 * @returns Objeto com estado e funções de tradução
 * @throws Error se usado fora do I18nProvider
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n deve ser usado dentro de um I18nProvider");
  }

  return context;
}

/**
 * HOC para injetar i18n em componentes
 */
export function withI18n<P extends object>(
  Component: React.ComponentType<P & { i18n: I18nContextValue }>,
) {
  return function WrappedComponent(props: P) {
    const i18n = useI18n();
    return <Component {...props} i18n={i18n} />;
  };
}

/**
 * Hook simplificado que retorna apenas a função de tradução
 */
export function useTranslation() {
  const { t, locale, setLocale, availableLocales } = useI18n();
  return { t, locale, setLocale, availableLocales };
}
