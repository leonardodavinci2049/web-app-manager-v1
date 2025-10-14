import type { RowDataPacket } from "mysql2";
import {
  GENERIC_STATUS_CODES,
  type GenericProcedureResponse,
  type GenericSpResult,
} from "../types/generic.types";

/**
 * Funções utilitárias para formatação de respostas de procedures
 */

/**
 * Formata a resposta de procedures que retornam múltiplos resultsets
 * @param resultData - Dados retornados pela procedure
 * @returns Resposta formatada
 */
export function formatProcedureResponse<
  T extends RowDataPacket = RowDataPacket,
>(resultData: GenericSpResult<T>): GenericProcedureResponse<T[]> {
  try {
    // Extrai os diferentes resultados
    const [dataRecords, feedbackRecords, operationResult] = resultData;

    // Obtém feedback se existir
    const feedback =
      feedbackRecords && feedbackRecords.length > 0 ? feedbackRecords[0] : null;

    // Determina sucesso baseado no feedback ou quantidade de registros
    const success = feedback
      ? feedback.sp_error_id === 0
      : dataRecords.length >= 0; // Para procedures que não têm feedback

    // Define mensagem
    const message =
      feedback?.sp_message ||
      (success
        ? "Procedure executada com sucesso"
        : "Erro na execução da procedure");

    // Define status code baseado no sucesso
    const statusCode = success
      ? GENERIC_STATUS_CODES.SUCCESS
      : GENERIC_STATUS_CODES.PROCEDURE_ERROR;

    return {
      success,
      statusCode,
      message,
      data: dataRecords || [],
      feedback,
      operationResult,
      recordCount: dataRecords?.length || 0,
    };
  } catch (err) {
    return {
      success: false,
      statusCode: GENERIC_STATUS_CODES.EXECUTION_ERROR,
      message: `Erro ao formatar resposta: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
      data: [] as T[],
      feedback: null,
      operationResult: null,
      recordCount: 0,
    };
  }
}

/**
 * Formata resposta para procedures simples (apenas dados)
 * @param resultData - Dados retornados pela procedure
 * @returns Resposta formatada
 */
export function formatDataResponse<T extends RowDataPacket = RowDataPacket>(
  resultData: T[],
): GenericProcedureResponse<T[]> {
  return {
    success: true,
    statusCode: GENERIC_STATUS_CODES.SUCCESS,
    message: "Procedure executada com sucesso",
    data: resultData,
    feedback: null,
    operationResult: null,
    recordCount: resultData.length,
  };
}

/**
 * Formata resposta para procedures de modificação
 * @param resultData - Resultado da operação
 * @returns Resposta formatada
 */
export function formatModifyResponse(resultData: {
  affectedRows: number;
  [key: string]: unknown;
}): GenericProcedureResponse<unknown> {
  const hasAffectedRows = resultData.affectedRows > 0;

  return {
    success: hasAffectedRows,
    statusCode: hasAffectedRows
      ? GENERIC_STATUS_CODES.SUCCESS
      : GENERIC_STATUS_CODES.NO_RECORDS,
    message: hasAffectedRows
      ? `Operação realizada com sucesso. ${resultData.affectedRows} registro(s) afetado(s)`
      : "Nenhum registro foi afetado",
    data: resultData,
    feedback: null,
    operationResult: null,
    recordCount: resultData.affectedRows,
  };
}

/**
 * Formata resposta de erro
 * @param error - Erro ocorrido
 * @param statusCode - Código de status (opcional)
 * @returns Resposta de erro formatada
 */
export function formatErrorResponse<T = unknown>(
  error: Error | string,
  statusCode: number = GENERIC_STATUS_CODES.EXECUTION_ERROR,
): GenericProcedureResponse<T> {
  const errorMessage = error instanceof Error ? error.message : error;

  return {
    success: false,
    statusCode,
    message: errorMessage,
    data: null as T,
    feedback: null,
    operationResult: null,
    recordCount: 0,
  };
}

/**
 * Formata e exibe resultados de forma legível
 * @param response - Resposta da procedure
 * @returns String formatada para visualização
 */
export function formatForDisplay(
  response: GenericProcedureResponse<unknown>,
): string {
  const lines = [
    `=== RESULTADO DA PROCEDURE ===`,
    `Status: ${response.success ? "SUCESSO" : "ERRO"}`,
    `Código: ${response.statusCode}`,
    `Mensagem: ${response.message}`,
    `Registros: ${response.recordCount}`,
  ];

  if (response.feedback) {
    lines.push(`=== FEEDBACK DA PROCEDURE ===`);
    lines.push(`Return ID: ${response.feedback.sp_return_id}`);
    lines.push(`Error ID: ${response.feedback.sp_error_id}`);
    lines.push(`Message: ${response.feedback.sp_message}`);
  }

  if (
    response.data &&
    Array.isArray(response.data) &&
    response.data.length > 0
  ) {
    lines.push(`=== DADOS RETORNADOS ===`);
    lines.push(JSON.stringify(response.data, null, 2));
  }

  if (response.operationResult) {
    lines.push(`=== RESULTADO DA OPERAÇÃO ===`);
    lines.push(`Affected Rows: ${response.operationResult.affectedRows}`);
    lines.push(`Insert ID: ${response.operationResult.insertId}`);
  }

  return lines.join("\n");
}

/**
 * Converte resposta para formato JSON compacto
 * @param response - Resposta da procedure
 * @returns JSON compacto da resposta
 */
export function toCompactJSON(
  response: GenericProcedureResponse<unknown>,
): string {
  const compact = {
    success: response.success,
    status: response.statusCode,
    message: response.message,
    records: response.recordCount,
    hasData: response.data !== null && response.recordCount > 0,
    hasFeedback: response.feedback !== null,
  };

  return JSON.stringify(compact);
}

/**
 * Extrai apenas os dados da resposta
 * @param response - Resposta da procedure
 * @returns Apenas os dados ou null se não houver
 */
export function extractData<T>(
  response: GenericProcedureResponse<T>,
): T | null {
  return response.success ? response.data : null;
}

/**
 * Verifica se a resposta indica sucesso com dados
 * @param response - Resposta da procedure
 * @returns True se sucesso e tem dados
 */
export function hasSuccessWithData(
  response: GenericProcedureResponse<unknown>,
): boolean {
  return response.success && response.recordCount > 0;
}

/**
 * Extrai mensagem de erro se houver
 * @param response - Resposta da procedure
 * @returns Mensagem de erro ou null se sucesso
 */
export function getErrorMessage(
  response: GenericProcedureResponse<unknown>,
): string | null {
  return response.success ? null : response.message;
}
