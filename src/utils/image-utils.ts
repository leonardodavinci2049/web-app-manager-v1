/**
 * Image validation and fallback utilities
 */

// Lista de domínios permitidos para imagens externas
const ALLOWED_DOMAINS = [
  "mundialmegastore.com.br",
  "localhost",
  "127.0.0.1",
  // Adicione outros domínios conforme necessário
];

// Imagem padrão para fallback
export const DEFAULT_PRODUCT_IMAGE = "/images/product/no-image.jpeg";

/**
 * Valida se uma URL de imagem é válida e de um domínio permitido
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return false;
  }

  const trimmedUrl = url.trim();

  // Se é uma URL relativa (começa com /), é válida
  if (trimmedUrl.startsWith("/")) {
    return true;
  }

  try {
    const urlObj = new URL(trimmedUrl);

    // Verifica se é HTTPS ou HTTP
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Verifica se o domínio está na lista de permitidos
    const hostname = urlObj.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

/**
 * Valida se uma extensão de arquivo é de imagem
 */
export function isValidImageExtension(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const lowerUrl = url.toLowerCase();

  return validExtensions.some((ext) => lowerUrl.includes(ext));
}

/**
 * Retorna uma URL de imagem válida ou a imagem padrão
 */
export function getValidImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmedUrl = url.trim();

  // Se não passa na validação básica, usa a imagem padrão
  if (!isValidImageUrl(trimmedUrl)) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  // Se não tem extensão de imagem válida, usa a imagem padrão
  if (!isValidImageExtension(trimmedUrl)) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  return trimmedUrl;
}

/**
 * Hook personalizado para gerenciar estado de erro de imagem
 */
export function createImageErrorHandler(
  fallbackUrl: string = DEFAULT_PRODUCT_IMAGE,
) {
  return {
    onError: (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = event.currentTarget;
      if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
      }
    },
    onLoad: () => {
      // Opcional: pode ser usado para resetar estados de erro
    },
  };
}
