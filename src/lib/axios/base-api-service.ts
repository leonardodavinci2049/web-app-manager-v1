import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { API_STATUS_CODES } from "@/lib/constants/api-constants";
import serverAxiosClient from "./server-axios-client";
/**
 * Interface para resposta padrão da API
 */
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  recordId?: number;
  quantity?: number;
  info1?: string;
}

/**
 * Classe base para todos os serviços de API
 */
export abstract class BaseApiService {
  /**
   * Executa requisição GET
   */
  protected async get<T>(
    endpoint: string,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await serverAxiosClient.get(
        endpoint,
        config,
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Executa requisição POST
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await serverAxiosClient.post(
        endpoint,
        data,
        config,
      );

      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Executa requisição PUT
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await serverAxiosClient.put(
        endpoint,
        data,
        config,
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Executa requisição PATCH
   */
  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await serverAxiosClient.patch(
        endpoint,
        data,
        config,
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Executa requisição DELETE
   */
  protected async delete<T>(
    endpoint: string,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await serverAxiosClient.delete(
        endpoint,
        config,
      );
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica se a resposta tem a estrutura esperada da API
   */
  private isApiResponse<T>(data: unknown): data is ApiResponse<T> {
    return (
      data !== null &&
      typeof data === "object" &&
      "statusCode" in data &&
      "message" in data &&
      typeof (data as Record<string, unknown>).statusCode === "number" &&
      typeof (data as Record<string, unknown>).message === "string"
    );
  }

  /**
   * Trata resposta da API
   */
  private handleResponse<T>(response: AxiosResponse<T>): T {
    // Verifica se a resposta tem a estrutura esperada da API
    if (this.isApiResponse<T>(response.data)) {
      const apiResponse = response.data;

      // Para casos especiais como "not found" mas com dados válidos
      if (
        apiResponse.message &&
        (apiResponse.message.includes("not found") ||
          apiResponse.message.includes("não encontrado")) &&
        apiResponse.data &&
        Array.isArray(apiResponse.data) &&
        apiResponse.data.length > 0
      ) {
        // Retorna a resposta mesmo com mensagem "not found" se há dados
        return response.data;
      }

      // Para código 100422 (Product not found), permite que o serviço específico trate
      if (apiResponse.statusCode === API_STATUS_CODES.NOT_FOUND) {
        // Retorna a resposta para que o serviço específico possa tratar
        return response.data;
      }

      // Verifica se o statusCode indica sucesso
      if (apiResponse.statusCode !== API_STATUS_CODES.SUCCESS) {
        throw new Error(apiResponse.message || "Erro na resposta da API");
      }
    }

    return response.data;
  }

  /**
   * Trata erros das requisições
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      // Erro de resposta HTTP
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Se a resposta tem estrutura da API
        if (data && typeof data === "object" && "message" in data) {
          return new Error(data.message || "Erro na API");
        }

        // Mensagens padrão por código de status
        switch (status) {
          case 400:
            return new Error("Requisição inválida");
          case 401:
            return new Error("Não autorizado");
          case 403:
            return new Error("Acesso negado");
          case 404:
            return new Error("Recurso não encontrado");
          case 500:
            return new Error("Erro interno do servidor");
          default:
            return new Error(`Erro HTTP ${status}`);
        }
      }

      // Erro de requisição (sem resposta)
      if (error.request) {
        return new Error("Erro de conexão com a API");
      }

      // Erro de configuração
      return new Error("Erro na configuração da requisição");
    }

    // Erro genérico
    if (error instanceof Error) {
      return error;
    }

    return new Error("Erro desconhecido");
  }

  /**
   * Monta payload padrão para requisições
   */
  protected buildPayload(
    data: Record<string, unknown>,
    additionalFields?: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      ...data,
      ...additionalFields,
    };
  }

  /**
   * Valida se uma resposta da API é válida
   */
  protected isValidApiResponse<T>(response: ApiResponse<T>): boolean {
    return response.statusCode === API_STATUS_CODES.SUCCESS;
  }

  /**
   * Extrai dados da resposta da API
   */
  protected extractData<T>(response: ApiResponse<T>): T | null {
    return response.data || null;
  }

  /**
   * Extrai mensagem da resposta da API
   */
  protected extractMessage<T>(response: ApiResponse<T>): string {
    return response.message || "";
  }
}
