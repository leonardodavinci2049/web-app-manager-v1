export interface CheckIfEmailExistsDto {
  USER_ID: number;
  TERM: string;
}

// Função de validação para email
export function validateCheckIfEmailExistsDto(
  data: unknown,
): CheckIfEmailExistsDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  if (typeof dto.USER_ID !== "number" || dto.USER_ID <= 0) {
    throw new Error("ID_USUARIO deve ser um número inteiro positivo");
  }

  if (typeof dto.TERM !== "string" || dto.TERM.trim() === "") {
    throw new Error("TERM deve ser uma string válida não vazia");
  }

  return {
    USER_ID: dto.USER_ID as number,
    TERM: (dto.TERM as string).trim(),
  };
}
