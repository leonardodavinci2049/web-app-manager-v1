import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxonomyList } from "@/components/taxonomy/taxonomy-list";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

/**
 * Função para carregar dados iniciais de taxonomias (Server Component)
 */
async function loadInitialTaxonomies(): Promise<{
  taxonomies: TaxonomyData[];
  total: number;
  error?: string;
}> {
  try {
    console.log("🔍 [Taxonomy Page] Carregando taxonomias iniciais...");

    const response = await TaxonomyServiceApi.findTaxonomies({
      pe_qt_registros: 50, // Carrega as primeiras 50 taxonomias
      pe_pagina_id: 0, // MySQL começa em 0
      pe_coluna_id: 2, // Ordena por nome
      pe_ordem_id: 1, // Ordem crescente
    });

    console.log("📦 [Taxonomy Page] Resposta da API:", {
      statusCode: response.statusCode,
      quantity: response.quantity,
      hasData: !!response.data,
      dataLength: response.data?.[0]?.length,
    });

    if (TaxonomyServiceApi.isValidTaxonomyResponse(response)) {
      const taxonomies = TaxonomyServiceApi.extractTaxonomyList(response);
      console.log(
        "✅ [Taxonomy Page] Taxonomias extraídas:",
        taxonomies.length,
      );
      return {
        taxonomies,
        total: response.quantity || taxonomies.length,
      };
    } else {
      console.log("❌ [Taxonomy Page] Resposta inválida:", response.message);
      return {
        taxonomies: [],
        total: 0,
        error: response.message || "Erro ao carregar taxonomias",
      };
    }
  } catch (error) {
    console.error(
      "💥 [Taxonomy Page] Erro ao carregar taxonomias iniciais:",
      error,
    );

    // Determina a mensagem de erro baseada no tipo de erro
    let errorMessage = "Erro interno do servidor";

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Chave de API não configurada ou inválida";
      } else if (error.message.includes("Não autorizado")) {
        errorMessage = "Não autorizado - verifique as credenciais da API";
      } else if (error.message.includes("conexão")) {
        errorMessage = "Erro de conexão com a API";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      taxonomies: [],
      total: 0,
      error: errorMessage,
    };
  }
}

/**
 * Página de listagem de taxonomias
 * Server Component que carrega os dados iniciais e renderiza o componente cliente
 */
export default async function TaxonomyPage() {
  const { taxonomies, total, error } = await loadInitialTaxonomies();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Taxonomias
          </h1>
          <p className="text-muted-foreground">
            Gerencie as categorias e classificações dos produtos
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <span>Lista de Taxonomias</span>
              {total > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {total} registros
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mx-auto max-w-md space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-destructive/10 rounded-full">
                    <svg
                      className="w-8 h-8 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Ícone de erro"
                      role="img"
                    >
                      <title>Erro</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-destructive">
                      Erro ao carregar dados
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {error}
                    </p>
                    {error.includes("API") && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Verifique a configuração da API_KEY no arquivo .env
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <TaxonomyList
                initialTaxonomies={taxonomies}
                initialTotal={total}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
