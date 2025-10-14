import type { RowDataPacket } from "mysql2";

/**
 * Interface para feedback padrão retornado pelas procedures
 */
export interface GenericSpFeedback extends RowDataPacket {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

/**
 * Interface para resultado de operações SQL
 */
export interface GenericSpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

/**
 * Tipo genérico para qualquer resultado de procedure
 * Representa o array de resultsets retornado por procedures complexas
 */
export type GenericSpResult<T extends RowDataPacket = RowDataPacket> = [
  T[], // Dados retornados pela procedure
  GenericSpFeedback[], // Feedback da procedure
  GenericSpOperationResult, // Resultado da operação
];

/**
 * Interface para resposta padronizada de procedures
 */
export interface GenericProcedureResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  feedback: GenericSpFeedback | null;
  operationResult: GenericSpOperationResult | null;
  recordCount: number;
}

/**
 * Enum para tipos de execução de procedures
 */
export enum ProcedureExecutionType {
  GENERIC = "generic",
  DATA_ONLY = "data",
  MODIFY = "modify",
}

/**
 * Interface para configuração de execução de procedure
 */
export interface ProcedureExecutionConfig {
  type: ProcedureExecutionType;
  timeout?: number;
  validateSyntax?: boolean;
}

/**
 * Constantes para códigos de status específicos do serviço genérico
 */
export const GENERIC_STATUS_CODES = {
  SUCCESS: 100200,
  PROCEDURE_ERROR: 100422,
  VALIDATION_ERROR: 100400,
  EXECUTION_ERROR: 100500,
  NO_RECORDS: 100404,
  TIMEOUT: 100408,
} as const;

/**
 * Type helper para extrair tipo de dados de uma resposta
 */
export type ExtractDataType<T> = T extends GenericProcedureResponse<infer U>
  ? U
  : never;

/**
 * Type helper para procedures que retornam arrays de registros
 */
export type ArrayProcedureResponse<T extends RowDataPacket> =
  GenericProcedureResponse<T[]>;

/**
 * Type helper para procedures de modificação
 */
export type ModifyProcedureResponse =
  GenericProcedureResponse<GenericSpOperationResult>;
