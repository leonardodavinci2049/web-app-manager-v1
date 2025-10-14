/**
 * Funções utilitárias para validação de procedures e parâmetros
 */

/**
 * Valida se a string é uma chamada de procedure válida
 * @param procedureCall - String da chamada da procedure
 * @returns True se válida
 */
export function isValidProcedureCall(procedureCall: string): boolean {
  if (!procedureCall || typeof procedureCall !== "string") {
    return false;
  }

  const trimmed = procedureCall.trim().toUpperCase();
  return trimmed.startsWith("CALL ");
}

/**
 * Extrai o nome da procedure da string de chamada
 * @param procedureCall - String da chamada da procedure
 * @returns Nome da procedure ou null se inválida
 */
export function extractProcedureName(procedureCall: string): string | null {
  if (!isValidProcedureCall(procedureCall)) {
    return null;
  }

  const trimmed = procedureCall.trim();
  const match = trimmed.match(/^CALL\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
  return match ? match[1] : null;
}

/**
 * Valida se a procedure call não contém comandos SQL perigosos
 * @param procedureCall - String da chamada da procedure
 * @returns True se segura
 */
export function isSafeProcedureCall(procedureCall: string): boolean {
  if (!isValidProcedureCall(procedureCall)) {
    return false;
  }

  const dangerous = [
    "DROP",
    "DELETE",
    "UPDATE",
    "INSERT",
    "CREATE",
    "ALTER",
    "TRUNCATE",
    "GRANT",
    "REVOKE",
    "--",
    "/*",
    "*/",
  ];

  const upperCall = procedureCall.toUpperCase();
  return !dangerous.some(
    (cmd) => upperCall.includes(cmd) && !upperCall.startsWith("CALL "),
  );
}

/**
 * Sanitiza a string da procedure removendo caracteres perigosos
 * @param procedureCall - String da chamada da procedure
 * @returns String sanitizada
 */
export function sanitizeProcedureCall(procedureCall: string): string {
  // Remove comentários SQL
  let sanitized = procedureCall.replace(/--.*$/gm, "");
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove quebras de linha extras e espaços
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
}

/**
 * Valida timeout para execução de procedure
 * @param timeout - Timeout em millisegundos
 * @returns True se válido
 */
export function isValidTimeout(timeout?: number): boolean {
  if (timeout === undefined) return true;
  return typeof timeout === "number" && timeout > 0 && timeout <= 300000; // Máximo 5 minutos
}

/**
 * Valida parâmetros de configuração de execução
 * @param config - Configuração de execução
 * @returns Array de erros (vazio se válido)
 */
export function validateExecutionConfig(config?: {
  timeout?: number;
  [key: string]: unknown;
}): string[] {
  const errors: string[] = [];

  if (!config) return errors;

  if (config.timeout !== undefined && !isValidTimeout(config.timeout)) {
    errors.push("Timeout deve ser um número positivo até 300000ms (5 minutos)");
  }

  return errors;
}

/**
 * Formata erro de validação
 * @param field - Campo que falhou na validação
 * @param value - Valor que falhou
 * @param reason - Razão da falha
 * @returns Mensagem de erro formatada
 */
export function formatValidationError(
  field: string,
  value: unknown,
  reason: string,
): string {
  return `Validação falhou para '${field}': ${reason}. Valor recebido: ${JSON.stringify(value)}`;
}
