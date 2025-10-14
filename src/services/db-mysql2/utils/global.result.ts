import { ResultModel } from "./result.model";

// Constantes para códigos de resposta
export const RESPONSE_CODES = {
  SUCCESS: 100200,
  PROCESSED_SUCCESS: 100201,
  NOT_FOUND: 100404,
  VALIDATION_ERROR: 100400,
  INTERNAL_ERROR: 100500,
  UNAUTHORIZED: 100401,
  FORBIDDEN: 100403,
  CONFLICT: 100409,
  UNPROCESSABLE_ENTITY: 100422,
  TOO_MANY_REQUESTS: 100429,
  REQUEST_TIMEOUT: 100408,
  GONE: 100410,
  PRECONDITION_FAILED: 100412,
  PROCESSING_FAILED: 100422, // Não foi possível processar as informações
};

// Constantes para mensagens de feedback
export const MESSAGES = {
  USER_CREATED: "Usuário criado com sucesso",
  USER_UPDATED: "Usuário atualizado com sucesso",
  USER_DELETED: "Usuário excluído com sucesso",
  USER_NOT_FOUND: "Usuário não encontrado",
  PROCESSING_SUCCESS: "Informações processadas com sucesso",
  PROCESSING_FAILURE: "Não foi possível processar as informações",
  INVALID_TOKEN: "Token inválido",
  TOKEN_EXPIRED: "Token expirado",
  INVALID_CREDENTIALS: "Credenciais inválidas",
  PASSWORD_RESET_SUCCESS: "Senha redefinida com sucesso",
  UNKNOWN_ERROR: "Ocorreu um erro desconhecido",
  PASSWORD_REQUIREMENTS: "Use número, letras maiúscula e minuscula",
};

export function resultQueryData<T>(
  recordId: number,
  errorId: number,
  feedback: string,
  resultData: T,
  quantity: number = 0,
  info1?: string,
): ResultModel {
  const sanitizedData = JSON.parse(JSON.stringify(resultData)) as T;

  if (errorId === 0 && recordId > 0) {
    const sucessoMessage =
      feedback && feedback.trim() !== ""
        ? feedback
        : MESSAGES.PROCESSING_SUCCESS;
    return new ResultModel(
      RESPONSE_CODES.SUCCESS,
      sucessoMessage,
      recordId,
      sanitizedData,
      quantity,
      info1,
    );
  } else {
    const failedMessage =
      feedback && feedback.trim() !== ""
        ? feedback
        : MESSAGES.PROCESSING_FAILURE;

    return new ResultModel(
      RESPONSE_CODES.PROCESSING_FAILED,
      failedMessage,
      recordId,
      sanitizedData,
      quantity,
    );
  }
}
