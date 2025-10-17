import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { envs } from "@/core/config";
import { API_BASE_URL, DEFAULT_HEADERS } from "@/lib/constants/api-constants";

/**
 * Cliente Axios configurado para uso no servidor (Server Components e API Routes)
 * Usa API_KEY do projeto para autenticação
 */
class ServerAxiosClient {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.apiKey = envs.API_KEY || "";

    if (!this.apiKey) {
      console.warn("⚠️  Atenção: API_KEY não configurada no servidor");
    }
  }

  /**
   * Cria uma instância axios com configuração da API_KEY
   */
  private createInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 segundos (maior timeout para servidor)
      headers: {
        ...DEFAULT_HEADERS,
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "User-Agent": "NextJS-Server/1.0",
      },
    });

    this.setupInterceptors(instance);
    return instance;
  }

  /**
   * Configura interceptors para a instância
   */
  private setupInterceptors(instance: AxiosInstance): void {
    // Interceptor para requisições
    instance.interceptors.request.use(
      (config) => {
        // Adicionar API_KEY ao header Authorization
        if (this.apiKey) {
          config.headers.Authorization = `Bearer ${this.apiKey}`;
        }

        // Log estruturado para servidor
        if (process.env.NODE_ENV === "development") {
          console.log(
            `🚀 [SERVER ${config.method?.toUpperCase()}] ${config.url}`,
          );
        }

        return config;
      },
      (error) => {
        console.error("[Server Request Error]", error);
        return Promise.reject(error);
      },
    );

    // Interceptor para respostas
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ [SERVER ${response.status}] ${response.config.url}`);
          console.log(
            "📥 [RESPONSE DATA]:",
            JSON.stringify(response.data, null, 2),
          );
        }
        return response;
      },
      (error: AxiosError) => {
        // Log estruturado de erros do servidor
        console.error("[Server API Error]", {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          data: error.response?.data,
          timestamp: new Date().toISOString(),
        });

        return Promise.reject(error);
      },
    );
  }

  /**
   * Métodos de requisição
   */
  public get<T = unknown>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const instance = this.createInstance();
    return instance.get<T>(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const instance = this.createInstance();
    return instance.post<T>(url, data, config);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const instance = this.createInstance();
    return instance.put<T>(url, data, config);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const instance = this.createInstance();
    return instance.patch<T>(url, data, config);
  }

  public delete<T = unknown>(
    url: string,
    config?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> {
    const instance = this.createInstance();
    return instance.delete<T>(url, config);
  }

  /**
   * Métodos utilitários
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  public isApiKeyConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }
}

// Instância única do cliente servidor
const serverAxiosClient = new ServerAxiosClient();

export default serverAxiosClient;
export { ServerAxiosClient };
