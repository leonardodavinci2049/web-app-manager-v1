// Tipos para o serviço de fornecedores (Supplier)

/**
 * Custom error class for supplier-related errors
 */
export class SupplierError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "SupplierError";
    Object.setPrototypeOf(this, SupplierError.prototype);
  }
}

/**
 * Error thrown when supplier is not found
 */
export class SupplierNotFoundError extends SupplierError {
  constructor(params?: Record<string, unknown>) {
    const message = params
      ? `Fornecedor não encontrado com os parâmetros: ${JSON.stringify(params)}`
      : "Fornecedor não encontrado";
    super(message, "SUPPLIER_NOT_FOUND", 100404);
    this.name = "SupplierNotFoundError";
    Object.setPrototypeOf(this, SupplierNotFoundError.prototype);
  }
}

/**
 * Error thrown when supplier validation fails
 */
export class SupplierValidationError extends SupplierError {
  constructor(
    message: string,
    public readonly validationErrors?: Record<string, string[]>,
  ) {
    super(message, "SUPPLIER_VALIDATION_ERROR", 100400);
    this.name = "SupplierValidationError";
    Object.setPrototypeOf(this, SupplierValidationError.prototype);
  }
}

/**
 * Base request interface with common parameters
 */
interface BaseSupplierRequest {
  pe_app_id: number;
  pe_system_client_id: number;
  pe_store_id: number;
  pe_organization_id: string;
  pe_member_id: string;
  pe_user_id: string;
  pe_person_id: number;
}

/**
 * Requisição para listar fornecedores
 */
export interface FindSupplierRequest extends BaseSupplierRequest {
  pe_id_fornecedor?: number;
  pe_fornecedor?: string;
  pe_limit?: number;
}

/**
 * Estrutura de dados do fornecedor
 */
export interface SupplierData {
  ID_FORNECEDOR: number;
  FORNECEDOR: string;
}

/**
 * Estrutura de resposta da stored procedure
 */
export interface StoredProcedureResponse {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

/**
 * Estrutura de metadados MySQL
 */
export interface MySQLMetadata {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

/**
 * Base response interface
 */
interface BaseSupplierResponse {
  statusCode: number;
  message: string;
  recordId: number;
  quantity: number;
  info1: string;
}

/**
 * Resposta da listagem de fornecedores
 */
export interface FindSupplierResponse extends BaseSupplierResponse {
  data: [SupplierData[], [StoredProcedureResponse], MySQLMetadata];
}
