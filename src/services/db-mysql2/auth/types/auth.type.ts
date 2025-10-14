import type { RowDataPacket } from "mysql2";

export interface tblSystemUser extends RowDataPacket {
  USER_ID: number;
  SYSTEM_CLIENT_ID?: number;
  STORE_ID?: number;
  NOME?: string;
  EMAIL?: string;
  SENHA?: string;
  ROLE?: number;
  PATH_IMAGEM?: string;
}

// Login feedback information

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

// Database operation result
export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

// Or keep the tuple type and create a related interface
export type SpResultData = [
  tblSystemUser[], // Primeiro item: array de usuários
  SpDefaultFeedback[], // Terceiro item: resultado SQL
  SpOperationResult, // Segundo item: array de feedbacks
];
