import type { RowDataPacket } from "mysql2";
import type { SpResultData } from "../../auth/types/auth.type";
import dbService from "../../dbConnection";
import { MESSAGES, resultQueryData } from "../../utils/global.result";
import { ResultModel } from "../../utils/result.model";

// Tipos genéricos para procedures
export interface GenericSpFeedback extends RowDataPacket {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

export interface GenericSpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

// Tipo genérico para qualquer resultado de procedure
export type GenericSpResult<T extends RowDataPacket = RowDataPacket> = [
  T[], // Dados retornados pela procedure
  GenericSpFeedback[], // Feedback da procedure
  GenericSpOperationResult, // Resultado da operação
];

// Interface para retorno formatado
export interface GenericProcedureResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  feedback: GenericSpFeedback | null;
  operationResult: GenericSpOperationResult | null;
  recordCount: number;
  rawResult: unknown;
}

export class GenericService {
  /**
   * Método principal para executar qualquer procedure e retornar dados formatados
   * @param callProcedureString - String da chamada da procedure (ex: "CALL sp_test(1, 2)")
   * @returns Promise com resposta formatada da procedure
   */
  async executeGenericProcedure<T extends RowDataPacket = RowDataPacket>(
    callProcedureString: string,
  ): Promise<GenericProcedureResponse<T[]>> {
    try {
      const resultData = (await dbService.selectExecute(
        callProcedureString,
      )) as GenericSpResult<T>;

      return this.formatProcedureResponse(resultData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return {
        success: false,
        statusCode: 100500,
        message: errorMessage,
        data: [] as T[],
        feedback: null,
        operationResult: null,
        recordCount: 0,
        rawResult: null,
      };
    }
  }

  /**
   * Executa procedure que retorna apenas dados (sem feedback estruturado)
   * @param callProcedureString - String da chamada da procedure
   * @returns Promise com dados da procedure
   */
  async executeDataProcedure<T extends RowDataPacket = RowDataPacket>(
    callProcedureString: string,
  ): Promise<GenericProcedureResponse<T[]>> {
    try {
      const resultData = (await dbService.selectExecute(
        callProcedureString,
      )) as T[];

      return {
        success: true,
        statusCode: 100200,
        message: "Procedure executada com sucesso",
        data: resultData,
        feedback: null,
        operationResult: null,
        recordCount: resultData.length,
        rawResult: resultData,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return {
        success: false,
        statusCode: 100500,
        message: errorMessage,
        data: [] as T[],
        feedback: null,
        operationResult: null,
        recordCount: 0,
        rawResult: null,
      };
    }
  }

  /**
   * Executa procedure de modificação (INSERT/UPDATE/DELETE)
   * @param callProcedureString - String da chamada da procedure
   * @returns Promise com resultado da operação
   */
  async executeModifyProcedure(
    callProcedureString: string,
  ): Promise<GenericProcedureResponse<unknown>> {
    try {
      const resultData = await dbService.ModifyExecute(callProcedureString);

      return {
        success: resultData.affectedRows > 0,
        statusCode: resultData.affectedRows > 0 ? 100200 : 100404,
        message:
          resultData.affectedRows > 0
            ? `Operação realizada com sucesso. ${resultData.affectedRows} registro(s) afetado(s)`
            : "Nenhum registro foi afetado",
        data: resultData,
        feedback: null,
        operationResult: null,
        recordCount: resultData.affectedRows,
        rawResult: resultData,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;

      return {
        success: false,
        statusCode: 100500,
        message: errorMessage,
        data: null,
        feedback: null,
        operationResult: null,
        recordCount: 0,
        rawResult: null,
      };
    }
  }

  /**
   * Formata a resposta de procedures que retornam múltiplos resultsets
   * @param resultData - Dados retornados pela procedure
   * @returns Resposta formatada
   */
  private formatProcedureResponse<T extends RowDataPacket = RowDataPacket>(
    resultData: GenericSpResult<T>,
  ): GenericProcedureResponse<T[]> {
    try {
      // Extrai os diferentes resultados
      const [dataRecords, feedbackRecords, operationResult] = resultData;

      // Obtém feedback se existir
      const feedback =
        feedbackRecords && feedbackRecords.length > 0
          ? feedbackRecords[0]
          : null;

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
      const statusCode = success ? 100200 : 100500;

      return {
        success,
        statusCode,
        message,
        data: dataRecords || [],
        feedback,
        operationResult,
        recordCount: dataRecords?.length || 0,
        rawResult: resultData,
      };
    } catch (err) {
      return {
        success: false,
        statusCode: 100500,
        message: `Erro ao formatar resposta: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
        data: [] as T[],
        feedback: null,
        operationResult: null,
        recordCount: 0,
        rawResult: resultData,
      };
    }
  }

  /**
   * Método utilitário para formatar e exibir resultados de forma legível
   * @param response - Resposta da procedure
   * @returns String formatada para visualização
   */
  formatResponseForDisplay(
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

  // Método legacy mantido para compatibilidade (agora usa o novo método)
  async tskGenericStoreProcedure(
    callProcedureString: string,
  ): Promise<ResultModel> {
    try {
      const response = await this.executeGenericProcedure(callProcedureString);

      // Converte para o formato legacy
      const recordId =
        response.feedback?.sp_return_id ||
        (response.data.length > 0
          ? (response.data[0] as RowDataPacket & { USER_ID?: number })
              ?.USER_ID || response.recordCount
          : 0);

      return resultQueryData<SpResultData>(
        recordId,
        response.success ? 0 : 1,
        response.message,
        response.rawResult as SpResultData,
        response.recordCount,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }
}

// Instância singleton do serviço genérico
const genericService = new GenericService();
export default genericService;
