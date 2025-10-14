import type { RowDataPacket } from "mysql2";

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

export interface tblCheckRecords extends RowDataPacket {
  ID_CHECK?: number;
  ID_RECORD: number;
}

export type SpCheckIfEmailExistType = [
  tblCheckRecords[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export type SpCheckIfCpfExistType = [
  tblCheckRecords[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export type SpCheckIfCnpjExistType = [
  tblCheckRecords[],
  SpDefaultFeedback[],
  SpOperationResult,
];
