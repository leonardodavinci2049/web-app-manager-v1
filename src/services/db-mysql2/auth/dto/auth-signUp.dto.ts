export interface AuthSignUpDto {
  USER_ID?: number;
  NAME: string;
  EMAIL: string;
  PASSWORD_MD5: string;
  INFO1?: string;
}

// Função de validação para CNPJ
export function validateAuthSignUpDto(data: unknown): AuthSignUpDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de ID_USUARIO (opcional)
  if (
    dto.USER_ID !== undefined &&
    (typeof dto.USER_ID !== "number" || dto.USER_ID <= 0)
  ) {
    throw new Error("ID_USUARIO deve ser um número inteiro positivo");
  }

  // Validação de NOME
  if (typeof dto.NAME !== "string" || dto.NAME.trim() === "") {
    throw new Error("NOME deve ser uma string válida não vazia");
  }

  // Validação de EMAIL
  if (
    typeof dto.EMAIL !== "string" ||
    dto.EMAIL.trim() === "" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.EMAIL)
  ) {
    throw new Error("EMAIL deve ser um endereço de email válido");
  }

  // Validação de SENHA_MD5
  if (
    typeof dto.PASSWORD_MD5 !== "string" ||
    dto.PASSWORD_MD5.trim() === "" ||
    !/^[a-f0-9]{32}$/.test(dto.PASSWORD_MD5.trim())
  ) {
    throw new Error(
      "PASSWORD_MD5 deve ser um hash MD5 válido (32 caracteres hexadecimais)",
    );
  }

  // Validação de INFO1 (opcional)
  if (
    dto.INFO1 !== undefined &&
    (typeof dto.INFO1 !== "string" || dto.INFO1.trim() === "")
  ) {
    throw new Error("INFO1 deve ser uma string válida não vazia");
  }

  return {
    USER_ID: dto.USER_ID,
    NAME: dto.NAME.trim(),
    EMAIL: dto.EMAIL.trim(),
    PASSWORD_MD5: dto.PASSWORD_MD5.trim(),
    INFO1: dto.INFO1 ? dto.INFO1.trim() : undefined,
  };
}
