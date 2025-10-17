/**
 * Utilitários para gerenciamento da API_KEY
 */

/**
 * Verifica se a API_KEY está configurada
 */
export function isApiKeyConfigured(): boolean {
  const apiKey = getApiKey();
  return Boolean(apiKey && apiKey.length > 0);
}

/**
 * Obtém a API_KEY do ambiente
 */
export function getApiKey(): string {
  // Prioridade: NEXT_PUBLIC_API_KEY (client) > API_KEY (server)
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_KEY || "";
  }
  return process.env.API_KEY || "";
}

/**
 * Valida o formato da API_KEY (exemplo de validação básica)
 */
export function validateApiKey(apiKey: string): boolean {
  // Validação básica: mínimo 16 caracteres, formato hexadecimal
  const hexPattern = /^[a-f0-9]{16,}$/i;
  return hexPattern.test(apiKey);
}

/**
 * Adiciona API_KEY ao payload de dados
 */
export function addApiKeyToData(
  data: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...data,
    API_KEY: getApiKey(),
  };
}

/**
 * Adiciona API_KEY aos parâmetros de query
 */
export function addApiKeyToParams(
  params: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...params,
    API_KEY: getApiKey(),
  };
}

/**
 * Log de aviso se API_KEY não estiver configurada
 */
export function warnIfApiKeyMissing(): void {
  if (!isApiKeyConfigured()) {
    console.warn(
      "⚠️  API_KEY não configurada. Verifique as variáveis de ambiente.",
    );

    if (process.env.NODE_ENV === "development") {
      console.info("💡 Dica: Adicione API_KEY no arquivo .env");
      console.info("   Exemplo: API_KEY=sua_chave_aqui");
    }
  }
}

/**
 * Máscara a API_KEY para logs (mostra apenas os primeiros e últimos caracteres)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return "***";
  }

  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  const middle = "*".repeat(Math.max(0, apiKey.length - 8));

  return `${start}${middle}${end}`;
}
