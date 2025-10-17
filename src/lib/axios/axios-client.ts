import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { API_BASE_URL, DEFAULT_HEADERS } from "@/lib/constants/api-constants";

/**
 * Cliente Axios configurado para todas as requisições da API
 * Usa API_KEY do projeto em vez de JWT tokens
 */
class AxiosClient {
  private instance: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || "";

    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // 15 segundos - aumentado para melhor estabilidade
      headers: {
        ...DEFAULT_HEADERS,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors para requisições e respostas
   */
  private setupInterceptors(): void {
    // Interceptor para requisições
    this.instance.interceptors.request.use(
      (config) => {
        // Adicionar API_KEY ao body das requisições POST/PUT/PATCH
        if (
          config.method &&
          ["post", "put", "patch"].includes(config.method.toLowerCase())
        ) {
          const data = config.data || {};
          config.data = {
            ...data,
            API_KEY: this.apiKey,
          };
        }

        // Adicionar API_KEY aos parâmetros para requisições GET/DELETE
        if (
          config.method &&
          ["get", "delete"].includes(config.method.toLowerCase())
        ) {
          config.params = {
            ...config.params,
            API_KEY: this.apiKey,
          };
        }

        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error("❌ [Request Error]", error);
        return Promise.reject(error);
      },
    );

    // Interceptor para respostas
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ [${response.status}] ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        // Tratamento global de erros
        this.handleResponseError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Trata erros de resposta de forma global
   */
  private handleResponseError(error: AxiosError): void {
    const status = error.response?.status;
    const url = error.config?.url;

    // Log estruturado do erro
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ [${status}] ${url}:`, {
        message: error.message,
        data: error.response?.data,
      });
    }

    // Tratamento específico por código de status
    switch (status) {
      case 400:
        console.warn("Requisição inválida - verifique os dados enviados");
        break;
      case 401:
        console.warn("API_KEY inválida ou ausente");
        this.handleUnauthorized();
        break;
      case 403:
        console.warn("Acesso negado - API_KEY sem permissões suficientes");
        break;
      case 404:
        console.warn("Endpoint não encontrado");
        break;
      case 429:
        console.warn("Muitas requisições - limite de rate excedido");
        break;
      case 500:
        console.error("Erro interno do servidor");
        break;
      case 502:
      case 503:
      case 504:
        console.error("Serviço indisponível temporariamente");
        break;
      default:
        if (process.env.NODE_ENV === "development") {
          console.error("Erro não categorizado na API:", error.message);
        }
    }
  }

  /**
   * Obtém a API_KEY configurada
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Verifica se a API_KEY está configurada
   */
  public isApiKeyConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }

  /**
   * Trata erro de API_KEY inválida
   */
  private handleUnauthorized(): void {
    console.warn(
      "API_KEY inválida ou ausente. Verifique as variáveis de ambiente.",
    );

    // Em desenvolvimento, mostrar dica útil
    if (process.env.NODE_ENV === "development") {
      console.info(
        "💡 Dica: Verifique se a variável API_KEY está definida no arquivo .env",
      );
    }
  }

  /**
   * Retorna a instância do axios
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Métodos de conveniência para requisições
   */
  public get<T = unknown>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  public delete<T = unknown>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

// Instância única do cliente
const axiosClient = new AxiosClient();

export default axiosClient;
export { AxiosClient };
