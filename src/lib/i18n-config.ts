/**
 * Configuração de Internacionalização (i18n)
 *
 * Gerencia as configurações de idioma baseadas em variáveis de ambiente,
 * fornecendo uma interface consistente para todo o sistema.
 */

export type Locale = "pt" | "en";

// Variáveis de cache para as configurações
let _defaultLocale: Locale | null = null;
let _supportedLocales: Locale[] | null = null;

/**
 * Verifica se um idioma é válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return ["pt", "en"].includes(locale);
}

/**
 * Obtém o idioma padrão configurado via env
 */
export function getDefaultLocale(): Locale {
  if (_defaultLocale === null) {
    const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "pt";
    _defaultLocale = isValidLocale(envDefault) ? envDefault : "pt";
  }
  return _defaultLocale;
}

/**
 * Obtém a lista de idiomas suportados via env
 */
export function getSupportedLocales(): Locale[] {
  if (_supportedLocales === null) {
    const envSupported = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "pt,en";
    _supportedLocales = envSupported
      .split(",")
      .map((locale: string) => locale.trim())
      .filter((locale: string) => isValidLocale(locale)) as Locale[];

    // Garante que pelo menos o idioma padrão esteja na lista
    if (!_supportedLocales.includes(getDefaultLocale())) {
      _supportedLocales.unshift(getDefaultLocale());
    }
  }
  return _supportedLocales;
}

/**
 * Obtém metadados dos idiomas
 */
export function getLocaleMetadata() {
  return {
    pt: {
      name: "Português",
      flag: "🇧🇷",
      locale: "pt-BR",
    },
    en: {
      name: "English",
      flag: "🇺🇸",
      locale: "en-US",
    },
  } as const;
}

/**
 * Recarrega as configurações (útil em desenvolvimento)
 */
export function reloadI18nConfig() {
  _defaultLocale = null;
  _supportedLocales = null;
}

/**
 * Log das configurações atuais (debug)
 */
export function logI18nConfig() {
  if (process.env.NODE_ENV === "development") {
    /*
    console.log("🌍 i18n Configuration:");
    console.log(`  Default Locale: ${getDefaultLocale()}`);
    console.log(`  Supported Locales: ${getSupportedLocales().join(", ")}`);
    console.log(`  Environment Variables:`);
    console.log(
      `    NEXT_PUBLIC_DEFAULT_LOCALE: ${process.env.NEXT_PUBLIC_DEFAULT_LOCALE}`,
    );
    console.log(
      `    NEXT_PUBLIC_SUPPORTED_LOCALES: ${process.env.NEXT_PUBLIC_SUPPORTED_LOCALES}`,
    );
    */
  }
}

// Export das configurações para compatibilidade
export const defaultLocale = getDefaultLocale();
export const locales = getSupportedLocales();
