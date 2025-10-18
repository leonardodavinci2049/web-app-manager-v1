/**
 * Constantes da API para endpoints e configurações
 */

// Base URL da API (apenas server-side)
// Valida rigorosamente em produção para evitar fallback silencioso
export const API_BASE_URL = (() => {
  const url = process.env.API_BASE_URL;

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "❌ API_BASE_URL must be defined in production environment",
      );
    }
    console.warn("⚠️  Using default API_BASE_URL for development");
    return "http://localhost:3333";
  }

  return url;
})();

// Configurações de timeout (em milissegundos)
export const API_TIMEOUTS = {
  CLIENT_DEFAULT: 15000, // 15 segundos para requisições normais do cliente
  CLIENT_UPLOAD: 60000, // 60 segundos para uploads de arquivos
  SERVER_DEFAULT: 30000, // 30 segundos para requisições normais do servidor
  SERVER_LONG_RUNNING: 120000, // 120 segundos para operações longas (relatórios, exports)
  SERVER_UPLOAD: 180000, // 180 segundos para uploads grandes no servidor
} as const;

// Endpoints de Produto
export const PRODUCT_ENDPOINTS = {
  FIND_PRODUCTS: "/product/v1/find-product",
  FIND_BY_ID: "/product/v1/find-product-id",
} as const;

// Endpoints de Carrinho
export const CART_ENDPOINTS = {
  ADD_ITEM: "/cart/v1/cart-item-add",
  UPDATE_QUANTITY: "/cart/v1/cart-item-qt-update",
  DELETE_ITEM: "/cart/v1/cart-item-delete",
  SELECT_ITEMS: "/cart/v1/cart-items-select",
  VIEW_CUSTOMER: "/cart/v1/cart-view-customer",
  CREATE_ORDER: "/cart/v1/cart-order-create",
  QUANTITY_ITEMS: "/cart/v1/cart-quantity-items",
  CLEAR_ALL: "/cart/v1/cart-clear-all",
} as const;

// Endpoints de Cliente
export const CUSTOMER_ENDPOINTS = {
  CHECK_CUSTOMER: "/cart/v1/cart-check-customer",
} as const;

// Endpoints de Category (Legacy)
export const CATEGORY_ENDPOINTS = {
  FIND_MENU: "/category/v1/category-find-menu",
  FIND_BY_ID: "/category/v1/category-find-id",
} as const;

// Endpoints de Checkout
export const CHECKOUT_ENDPOINTS = {
  VIEW_CUSTOMER: "/cart/v1/cart-view-customer",
  CREATE_ORDER: "/cart/v1/cart-order-create",
} as const;

// Endpoints de Taxonomy
export const TAXONOMY_ENDPOINTS = {
  FIND_MENU: "/api/taxonomy/v2/taxonomy-find-menu",
  FIND: "/api/taxonomy/v2/taxonomy-find",
  FIND_BY_ID: "/api/taxonomy/v2/taxonomy-find-id",
  CREATE: "/api/taxonomy/v2/taxonomy-create",
  UPDATE: "/api/taxonomy/v2/taxonomy-update",
  DELETE: "/api/taxonomy/v2/taxonomy-delete",
} as const;

// Endpoints de Account (Dashboard da Conta)
export const ACCOUNT_ENDPOINTS = {
  // Endpoints de consulta (01-09)
  STATISTICS: "/account/v1/find-account-statistics",
  LATEST_ORDERS: "/account/v1/find-account-orders-latest",
  SUMMARY: "/account/v1/find-account-summary",
  PROFILE: "/account/v1/find-account-profile",
  ORDERS_LIST: "/account/v1/find-account-orders-list",
  ORDER_SUMMARY: "/account/v1/find-account-orders-summary",
  PROMOTIONS: "/account/v1/find-account-promotion",
  SERVICES: "/account/v1/find-account-services",
  CONFIG: "/account/v1/find-account-config",

  // Endpoints de atualização (10-19)
  UPDATE_GENERAL: "/account/v1/upd-account-general",
  UPDATE_TYPE: "/account/v1/upd-account-type",
  UPDATE_BUSINESS: "/account/v1/upd-account-business",
  UPDATE_PERSONAL: "/account/v1/upd-account-personal",
  UPDATE_ADDRESS: "/account/v1/upd-account-address",
  UPDATE_SOCIAL: "/account/v1/upd-account-internet",
  UPDATE_THEME: "/account/v1/upd-account-theme",
  UPDATE_NOTIFICATIONS: "/account/v1/upd-account-notification",
  UPDATE_EMAIL: "/account/v1/upd-account-email",
  UPDATE_PASSWORD: "/account/v1/upd-account-password",
} as const;

// Endpoints de Validação (Check if Exists)
export const CHECK_ENDPOINTS = {
  EMAIL: "/check/v1/check-if-email-exists",
  CPF: "/check/v1/check-if-cpf-exists",
  CNPJ: "/check/v1/check-if-cnpj-exists",
} as const;

// Configurações padrão do sistema
export const SYSTEM_CONFIG = {
  ID_SYSTEM: 1,
  ID_LOJA: 1,
  ID_TIPO: 1,
} as const;

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
} as const;

// Configurações de retry
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  RETRY_CODES: [408, 429, 500, 502, 503, 504],
} as const;

// Tipos de resposta da API
/**
 * Códigos de status da API externa (NestJS)
 * ATENÇÃO: São diferentes dos códigos HTTP padrão
 * A API retorna códigos customizados no formato 100XXX
 */
export const API_STATUS_CODES = {
  SUCCESS: 100200, // Operação bem-sucedida
  EMPTY_RESULT: 100204, // Busca válida mas sem resultados
  ERROR: 100400, // Erro de validação ou regra de negócio
  NOT_FOUND: 100404, // Recurso não encontrado
  UNPROCESSABLE: 100422, // Entidade não processável (deprecated - usar NOT_FOUND)
} as const;

/**
 * Mapeia os códigos de status customizados da API para códigos HTTP padrão
 * Útil para integração com bibliotecas que esperam status HTTP convencionais
 *
 * @param apiStatus - Código de status da API (100XXX)
 * @returns Código HTTP padrão correspondente
 *
 * @example
 * ```typescript
 * const httpStatus = mapApiStatusToHttp(100200); // 200
 * const notFoundStatus = mapApiStatusToHttp(100404); // 404
 * ```
 */
export function mapApiStatusToHttp(apiStatus: number): number {
  switch (apiStatus) {
    case API_STATUS_CODES.SUCCESS:
      return 200;
    case API_STATUS_CODES.EMPTY_RESULT:
      return 204;
    case API_STATUS_CODES.NOT_FOUND:
    case API_STATUS_CODES.UNPROCESSABLE:
      return 404;
    case API_STATUS_CODES.ERROR:
      return 400;
    default:
      return 500;
  }
}

/**
 * Verifica se um código de status da API representa sucesso
 *
 * @param apiStatus - Código de status da API
 * @returns true se for código de sucesso
 */
export function isApiSuccess(apiStatus: number): boolean {
  return (
    apiStatus === API_STATUS_CODES.SUCCESS ||
    apiStatus === API_STATUS_CODES.EMPTY_RESULT
  );
}

/**
 * Verifica se um código de status da API representa erro
 *
 * @param apiStatus - Código de status da API
 * @returns true se for código de erro
 */
export function isApiError(apiStatus: number): boolean {
  return !isApiSuccess(apiStatus);
}
