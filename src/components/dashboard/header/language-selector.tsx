"use client";

/**
 * Componente Language Selector
 *
 * Fornece interface para alternância entre idiomas com:
 * - Design integrado ao sistema de temas
 * - Indicadores visuais (bandeiras)
 * - Animações suaves
 * - Acessibilidade completa
 */

import { Check, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";
import type { Locale } from "@/lib/i18n";

export interface LanguageSelectorProps {
  /**
   * Variante do componente
   */
  variant?: "default" | "compact" | "minimal";

  /**
   * Mostrar bandeira
   */
  showFlag?: boolean;

  /**
   * Mostrar texto do idioma
   */
  showText?: boolean;

  /**
   * Tamanho do componente
   */
  size?: "sm" | "default" | "lg";

  /**
   * Direção do menu dropdown
   */
  align?: "start" | "center" | "end";

  /**
   * Callback quando idioma for alterado
   */
  onLanguageChange?: (locale: Locale) => void;

  /**
   * Classes CSS customizadas
   */
  className?: string;
}

/**
 * Seletor de idioma principal
 */
export function LanguageSelector({
  variant = "default",
  showFlag = true,
  showText = true,
  size = "default",
  align = "end",
  onLanguageChange,
  className,
}: LanguageSelectorProps) {
  const { t, locale, setLocale, availableLocales } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    onLanguageChange?.(newLocale);
  };

  const currentLocale = availableLocales.find((l) => l.code === locale);

  // Variantes de estilo
  const buttonVariants = {
    default: "ghost",
    compact: "outline",
    minimal: "ghost",
  } as const;

  const buttonSizes = {
    sm: "sm",
    default: "default",
    lg: "lg",
  } as const;

  // Renderização baseada na variante
  const renderTriggerContent = () => {
    switch (variant) {
      case "compact":
        return (
          <div className="flex items-center gap-2">
            {showFlag && currentLocale && (
              <span className="text-base" aria-hidden="true">
                {currentLocale.flag}
              </span>
            )}
            {showText && currentLocale && (
              <span className="text-sm font-medium">{currentLocale.name}</span>
            )}
          </div>
        );

      case "minimal":
        return <Globe className="h-4 w-4" />;

      default:
        return (
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {showFlag && currentLocale && (
              <span className="text-base" aria-hidden="true">
                {currentLocale.flag}
              </span>
            )}
            {showText && currentLocale && (
              <span className="hidden text-sm font-medium sm:inline">
                {currentLocale.name}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariants[variant]}
          size={buttonSizes[size]}
          className={className}
          aria-label={t("common.selectLanguage")}
        >
          {renderTriggerContent()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
          {t("common.language")}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {availableLocales.map((availableLocale) => (
          <DropdownMenuItem
            key={availableLocale.code}
            onClick={() => handleLanguageChange(availableLocale.code)}
            className="cursor-pointer"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base" aria-hidden="true">
                  {availableLocale.flag}
                </span>
                <span className="font-medium">{availableLocale.name}</span>
              </div>

              {locale === availableLocale.code && (
                <Check className="text-primary h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Seletor compacto para uso em headers
 */
export function LanguageSelectorHeader(
  props: Omit<LanguageSelectorProps, "variant">,
) {
  return (
    <LanguageSelector {...props} variant="compact" showText={false} size="sm" />
  );
}

/**
 * Seletor minimal para uso em footers ou áreas com pouco espaço
 */
export function LanguageSelectorMinimal(
  props: Omit<LanguageSelectorProps, "variant">,
) {
  return (
    <LanguageSelector
      {...props}
      variant="minimal"
      showFlag={false}
      showText={false}
      size="sm"
    />
  );
}

/**
 * Seletor inline para uso em formulários ou configurações
 */
export function LanguageSelectorInline() {
  const { t, locale, setLocale, availableLocales } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        {t("common.language")}:
      </label>

      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="border-input rounded border bg-transparent px-2 py-1 text-sm"
        aria-label={t("common.selectLanguage")}
      >
        {availableLocales.map((availableLocale) => (
          <option key={availableLocale.code} value={availableLocale.code}>
            {availableLocale.flag} {availableLocale.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Hook para usar informações do idioma atual no componente
 */
export function useCurrentLanguage() {
  const { locale, availableLocales } = useTranslation();

  return availableLocales.find((l) => l.code === locale) || availableLocales[0];
}
