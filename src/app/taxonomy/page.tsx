"use client";

import { AlertCircle, Loader2, Wifi } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { checkTaxonomyApiHealth } from "@/app/actions/action-taxonomy-test";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MethodSelector } from "./components/MethodSelector";
import { ResponseInfo } from "./components/ResponseInfo";
import { ResultsList } from "./components/ResultsList";
import { SearchForm } from "./components/SearchForm";
import { useTaxonomySearch } from "./hooks/useTaxonomySearch";
import { taxonomySearchSchema } from "./types/form-types";

const TaxonomyTestPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const {
    isPending,
    taxonomies,
    responseInfo,
    error,
    apiMethod,
    search,
    reset,
    changeMethod,
  } = useTaxonomySearch({
    autoRetry: true,
    maxRetries: 3,
    onSuccess: () => {
      toast.success("Busca realizada com sucesso!");
    },
    onError: (errorMessage, errorType) => {
      toast.error(`Erro: ${errorMessage}`);
      console.error(`[TaxonomyTest] Erro ${errorType}:`, errorMessage);
    },
  });

  const handleSubmit = (formData: FormData) => {
    // Converte FormData para objeto
    const rawData = {
      pe_id_parent: formData.get("pe_id_parent"),
      pe_id_taxonomy: formData.get("pe_id_taxonomy"),
      pe_taxonomia: formData.get("pe_taxonomia"),
      pe_flag_inativo: formData.get("pe_flag_inativo"),
      pe_qt_registros: formData.get("pe_qt_registros"),
      pe_pagina_id: formData.get("pe_pagina_id"),
      pe_coluna_id: formData.get("pe_coluna_id"),
      pe_ordem_id: formData.get("pe_ordem_id"),
    };

    // Valida e transforma com Zod
    const validatedData = taxonomySearchSchema.parse(rawData);

    console.log("🧪 [TaxonomyTest] Enviando parâmetros:", validatedData);
    setHasSearched(true);
    search(validatedData);
  };

  const handleReset = () => {
    reset();
    setHasSearched(false);
  };

  const testApiHealth = async () => {
    setIsTestingApi(true);
    try {
      const result = await checkTaxonomyApiHealth();
      if (result.success) {
        toast.success(result.message, {
          description: result.details
            ? `Tempo de resposta: ${result.details.responseTime}ms`
            : undefined,
        });
      } else {
        toast.error("API Offline", {
          description: result.error,
        });
      }
    } catch (err) {
      toast.error("Erro ao testar API", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Teste - Serviço de Taxonomias
            </h1>
            <p className="text-muted-foreground">
              Interface de teste para o método{" "}
              <code className="bg-muted px-2 py-1 rounded">findTaxonomies</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testApiHealth}
              disabled={isTestingApi || isPending}
            >
              {isTestingApi ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              Testar API
            </Button>
          </div>
        </div>

        {/* Seletor de Método */}
        <MethodSelector
          apiMethod={apiMethod}
          onChange={changeMethod}
          disabled={isPending}
        />
      </div>

      {/* Formulário e Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SearchForm
          onSubmit={handleSubmit}
          onReset={handleReset}
          isPending={isPending}
        />
        <ResponseInfo responseInfo={responseInfo} />
      </div>

      {/* Área de Erro */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de Resultados */}
      <div className="mt-6">
        <ResultsList
          taxonomies={taxonomies}
          isPending={isPending}
          hasSearched={hasSearched}
        />
      </div>
    </div>
  );
};

export default TaxonomyTestPage;
