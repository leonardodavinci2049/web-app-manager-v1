// Exportações principais do serviço genérico
export { default as genericService, GenericService } from "./generic.service";
// Exportações de tipos e interfaces
// Re-exportação para compatibilidade com versões anteriores
export type {
  ArrayProcedureResponse,
  ExtractDataType,
  GenericProcedureResponse,
  GenericSpFeedback,
  GenericSpFeedback as SpFeedback,
  GenericSpOperationResult,
  GenericSpOperationResult as SpOperationResult,
  GenericSpResult,
  ModifyProcedureResponse,
  ProcedureExecutionConfig,
} from "./types/generic.types";
export {
  GENERIC_STATUS_CODES,
  ProcedureExecutionType,
} from "./types/generic.types";
// Exportações de utilitários de validação
export {
  extractProcedureName,
  formatValidationError,
  isSafeProcedureCall,
  isValidProcedureCall,
  isValidTimeout,
  sanitizeProcedureCall,
  validateExecutionConfig,
} from "./utils/procedure-validator";
// Exportações de utilitários de formatação
export {
  extractData,
  formatDataResponse,
  formatErrorResponse,
  formatForDisplay,
  formatModifyResponse,
  formatProcedureResponse,
  getErrorMessage,
  hasSuccessWithData,
  toCompactJSON,
} from "./utils/response-formatter";
