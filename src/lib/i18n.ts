/**
 * Sistema de Internacionalização (i18n) - Core
 *
 * Sistema completo para suporte a múltiplos idiomas com:
 * - Suporte a português brasileiro (pt-BR) e inglês americano (en-US)
 * - Persistência da preferência do usuário
 * - Tipagem TypeScript completa
 * - Fallback automático
 * - Configuração via variáveis de ambiente
 */

import { I18nConfig, type Locale } from "./i18n-config";

// Re-export tipos e configurações
export type { Locale };
export const defaultLocale = I18nConfig.defaultLocale;
export const locales = I18nConfig.supportedLocales;

// Metadados dos idiomas
export const localeNames: Record<Locale, string> = {
  pt: I18nConfig.getLocaleMetadata().pt.name,
  en: I18nConfig.getLocaleMetadata().en.name,
} as const;

export const localeFlags: Record<Locale, string> = {
  pt: I18nConfig.getLocaleMetadata().pt.flag,
  en: I18nConfig.getLocaleMetadata().en.flag,
} as const;

// Chave para localStorage
const LOCALE_STORAGE_KEY = "dashboard-preferred-locale";

/**
 * Obtém o idioma atual do localStorage ou retorna o padrão
 */
export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn("Erro ao recuperar idioma do localStorage:", error);
  }

  return defaultLocale;
}

/**
 * Define o idioma atual e persiste no localStorage
 */
export function setCurrentLocale(locale: Locale): void {
  if (!locales.includes(locale)) {
    console.warn(
      `Idioma não suportado: ${locale}. Usando padrão: ${defaultLocale}`,
    );
    locale = defaultLocale;
  }

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      // Dispatch custom event para notificar componentes
      window.dispatchEvent(new CustomEvent("localeChange", { detail: locale }));
    }
  } catch (error) {
    console.warn("Erro ao salvar idioma no localStorage:", error);
  }
}

/**
 * Obtém informações completas de um idioma
 */
export function getLocaleInfo(locale: Locale) {
  return {
    code: locale,
    name: localeNames[locale],
    flag: localeFlags[locale],
  };
}

/**
 * Obtém todos os idiomas disponíveis com suas informações
 */
export function getAvailableLocales() {
  return locales.map(getLocaleInfo);
}

/**
 * Verifica se um idioma é válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Detecta idioma preferido do navegador (fallback)
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  try {
    const browserLang = navigator.language.toLowerCase();

    // Verifica se é português (pt, pt-br, pt-pt, etc.)
    if (browserLang.startsWith("pt")) {
      return "pt";
    }

    // Verifica se é inglês (en, en-us, en-gb, etc.)
    if (browserLang.startsWith("en")) {
      return "en";
    }
  } catch (error) {
    console.warn("Erro ao detectar idioma do navegador:", error);
  }

  return defaultLocale;
}

/**
 * Inicializa o sistema de idiomas
 * Verifica localStorage -> navegador -> padrão
 */
export function initializeLocale(): Locale {
  const storedLocale = getCurrentLocale();

  // Se já tem no localStorage, usa ele
  if (storedLocale !== defaultLocale) {
    return storedLocale;
  }

  // Senão, tenta detectar do navegador
  const browserLocale = detectBrowserLocale();
  if (browserLocale !== defaultLocale) {
    setCurrentLocale(browserLocale);
    return browserLocale;
  }

  return defaultLocale;
}

// Tipos para o sistema de traduções
export type TranslationParams = Record<string, string | number>;

export interface Translation {
  [key: string]: string | Translation;
}

export type TranslationFunction = (
  key: string,
  params?: TranslationParams,
) => string;

/**
 * Interpola parâmetros em uma string de tradução
 * Exemplo: interpolate("Olá {{name}}!", {name: "João"}) -> "Olá João!"
 */
export function interpolate(
  template: string,
  params?: TranslationParams,
): string {
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

/**
 * Busca uma tradução aninhada usando notação de ponto
 * Exemplo: getNestedTranslation(translations, "auth.login.title")
 */
export function getNestedTranslation(
  translations: Translation,
  key: string,
): string | null {
  const keys = key.split(".");
  let current: Translation | string = translations;

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }

  return typeof current === "string" ? current : null;
}

/**
 * Cria uma função de tradução para um idioma específico
 */
export function createTranslationFunction(
  translations: Translation,
  fallbackTranslations?: Translation,
): TranslationFunction {
  return (key: string, params?: TranslationParams): string => {
    // Tenta buscar na tradução principal
    let translation = getNestedTranslation(translations, key);

    // Se não encontrar e há fallback, tenta no fallback
    if (!translation && fallbackTranslations) {
      translation = getNestedTranslation(fallbackTranslations, key);
    }

    // Se ainda não encontrou, retorna a própria chave como fallback
    if (!translation) {
      console.warn(`Tradução não encontrada para a chave: ${key}`);
      return key;
    }

    // Interpola parâmetros se necessário
    return interpolate(translation, params);
  };
}

/**
 * Inicializa o sistema i18n e mostra configurações em desenvolvimento
 */
export function initializeI18nSystem() {
  if (process.env.NODE_ENV === "development") {
    I18nConfig.logConfig();
  }
  return {
    defaultLocale,
    supportedLocales: locales,
    currentSettings: {
      defaultFromEnv: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
      supportedFromEnv: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES,
    },
  };
}
