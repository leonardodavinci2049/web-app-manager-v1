// Tipos para o serviço de taxonomias

/**
 * Base request interface with common parameters
 */
interface BaseTaxonomyRequest {
  pe_app_id: number;
  pe_system_client_id: number;
  pe_store_id: number;
  pe_organization_id: string;
  pe_member_id: string;
  pe_user_id: string;
  pe_person_id: number;
}

/**
 * Requisição para buscar taxonomias do menu
 */
export interface FindTaxonomyMenuRequest extends BaseTaxonomyRequest {
  pe_id_tipo: number;
  pe_parent_id: number;
}

/**
 * Requisição para listar taxonomias
 */
export interface FindTaxonomyRequest extends BaseTaxonomyRequest {
  pe_id_parent?: number;
  pe_id_taxonomy?: number;
  pe_taxonomia?: string;
  pe_flag_inativo: number;
  pe_qt_registros: number;
  pe_pagina_id: number;
  pe_coluna_id: number;
  pe_ordem_id: number;
}

/**
 * Requisição para buscar taxonomy por ID
 */
export interface FindTaxonomyByIdRequest extends BaseTaxonomyRequest {
  pe_id_taxonomy: number;
  pe_slug_taxonomy?: string;
}

/**
 * Requisição para criar nova taxonomy
 */
export interface CreateTaxonomyRequest extends BaseTaxonomyRequest {
  pe_id_tipo: number;
  pe_parent_id: number;
  pe_taxonomia: string;
  pe_slug: string;
  pe_level: number;
}

/**
 * Requisição para atualizar taxonomy existente
 */
export interface UpdateTaxonomyRequest extends BaseTaxonomyRequest {
  pe_id_taxonomy: number;
  pe_parent_id: number;
  pe_taxonomia: string;
  pe_slug: string;
  pe_path_imagem: string;
  pe_ordem: number;
  pe_meta_title: string;
  pe_meta_description: string;
  pe_inativo: number;
  pe_info: string;
}

/**
 * Requisição para excluir taxonomy
 */
export interface DeleteTaxonomyRequest extends BaseTaxonomyRequest {
  pe_id_taxonomy: number;
}

/**
 * Estrutura de dados da taxonomy
 */
export interface TaxonomyData {
  ID_TAXONOMY: number;
  PARENT_ID: number;
  TAXONOMIA: string;
  ANOTACOES?: string | null;
  PATH_IMAGEM?: string | null;
  SLUG?: string | null;
  LEVEL?: number | null;
  ORDEM: number;
  ID_IMAGEM?: number | null;
  QT_RECORDS?: number | null;
  META_TITLE?: string | null;
  META_DESCRIPTION?: string | null;
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
interface BaseTaxonomyResponse {
  statusCode: number;
  message: string;
  recordId: number;
  quantity: number;
  info1: string;
}

/**
 * Resposta da busca de taxonomias do menu
 */
export interface FindTaxonomyMenuResponse extends BaseTaxonomyResponse {
  data: [TaxonomyData[], MySQLMetadata];
}

/**
 * Resposta da listagem de taxonomias
 */
export interface FindTaxonomyResponse extends BaseTaxonomyResponse {
  data: [TaxonomyData[], MySQLMetadata];
}

/**
 * Resposta da busca de taxonomy por ID
 */
export interface FindTaxonomyByIdResponse extends BaseTaxonomyResponse {
  data: [[TaxonomyData], [StoredProcedureResponse], MySQLMetadata];
}

/**
 * Resposta da criação de taxonomy
 */
export interface CreateTaxonomyResponse extends BaseTaxonomyResponse {
  data: [[StoredProcedureResponse], MySQLMetadata];
}

/**
 * Resposta da atualização de taxonomy
 */
export interface UpdateTaxonomyResponse extends BaseTaxonomyResponse {
  data: [[StoredProcedureResponse], MySQLMetadata];
}

/**
 * Resposta da exclusão de taxonomy
 */
export interface DeleteTaxonomyResponse extends BaseTaxonomyResponse {
  data: [[StoredProcedureResponse], MySQLMetadata];
}
