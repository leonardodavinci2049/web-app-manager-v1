export interface AuthNewPasswordDto {
  USER_ID?: number;
  PASSWORD_MD5: string;
}

// Função de validação para CNPJ
export function validateAuthNewPasswordDto(data: unknown): AuthNewPasswordDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  if (typeof dto.USER_ID !== "number" || dto.USER_ID <= 0) {
    throw new Error("USER_ID deve ser um número inteiro positivo");
  }

  // Validação da PASSWORD_MD5
  if (
    typeof dto.PASSWORD_MD5 !== "string" ||
    dto.PASSWORD_MD5.trim() === "" ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      dto.PASSWORD_MD5,
    )
  ) {
    throw new Error(
      "SENHA deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial",
    );
  }

  return {
    USER_ID: dto.USER_ID,
    PASSWORD_MD5: dto.PASSWORD_MD5.trim(),
  };
}
