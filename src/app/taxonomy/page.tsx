"use client";

import { AlertCircle, Loader2, Search, Server, Wifi } from "lucide-react";
import { useState, useTransition } from "react";
import {
  searchTaxonomiesAction,
  testTaxonomyServiceAction,
} from "@/app/actions/action-taxonomy-test";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  FindTaxonomyRequest,
  TaxonomyData,
} from "@/services/api/taxonomy/types/taxonomy-types";

interface FormData {
  pe_id_parent: string;
  pe_id_taxonomy: string;
  pe_taxonomia: string;
  pe_flag_inativo: string;
  pe_qt_registros: string;
  pe_pagina_id: string;
  pe_coluna_id: string;
  pe_ordem_id: string;
}

const TaxonomyTestPage = () => {
  const [formData, setFormData] = useState<FormData>({
    pe_id_parent: "-1",
    pe_id_taxonomy: "0",
    pe_taxonomia: "",
    pe_flag_inativo: "0",
    pe_qt_registros: "20",
    pe_pagina_id: "0",
    pe_coluna_id: "2",
    pe_ordem_id: "1",
  });

  const [isPending, startTransition] = useTransition();
  const [taxonomies, setTaxonomies] = useState<TaxonomyData[]>([]);
  const [responseInfo, setResponseInfo] = useState<{
    statusCode?: number;
    message?: string;
    quantity?: number;
    totalPages?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiMethod, setApiMethod] = useState<"server-action" | "api-route">(
    "server-action",
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpa estados anteriores
    setError(null);
    setTaxonomies([]);
    setResponseInfo(null);

    // Converte os valores string para number quando necessário
    const params: Partial<FindTaxonomyRequest> = {
      pe_id_parent: formData.pe_id_parent
        ? Number(formData.pe_id_parent)
        : undefined,
      pe_id_taxonomy: formData.pe_id_taxonomy
        ? Number(formData.pe_id_taxonomy)
        : undefined,
      pe_taxonomia: formData.pe_taxonomia || undefined,
      pe_flag_inativo: formData.pe_flag_inativo
        ? Number(formData.pe_flag_inativo)
        : undefined,
      pe_qt_registros: formData.pe_qt_registros
        ? Number(formData.pe_qt_registros)
        : undefined,
      pe_pagina_id: formData.pe_pagina_id
        ? Number(formData.pe_pagina_id)
        : undefined,
      pe_coluna_id: formData.pe_coluna_id
        ? Number(formData.pe_coluna_id)
        : undefined,
      pe_ordem_id: formData.pe_ordem_id
        ? Number(formData.pe_ordem_id)
        : undefined,
    };

    console.log("🧪 [TaxonomyTest] Enviando parâmetros:", params);

    // Usa Server Action com useTransition para melhor UX
    startTransition(async () => {
      try {
        let result: {
          success: boolean;
          data?: TaxonomyData[];
          responseInfo?: {
            statusCode: number;
            message: string;
            quantity: number;
            totalPages: number;
          };
          error?: string;
        };

        if (apiMethod === "server-action") {
          // Método recomendado: Server Action
          result = await searchTaxonomiesAction(params);
        } else {
          // Método alternativo: API Route
          const response = await fetch("/api/taxonomy/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
          });
          result = await response.json();
        }

        console.log("📦 [TaxonomyTest] Resultado:", result);

        if (result.success && result.data && result.responseInfo) {
          setTaxonomies(result.data);
          setResponseInfo(result.responseInfo);
        } else {
          setError(result.error || "Erro desconhecido");
        }
      } catch (err) {
        console.error("❌ [TaxonomyTest] Erro:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      }
    });
  };

  const resetForm = () => {
    setFormData({
      pe_id_parent: "-1",
      pe_id_taxonomy: "0",
      pe_taxonomia: "",
      pe_flag_inativo: "0",
      pe_qt_registros: "20",
      pe_pagina_id: "0",
      pe_coluna_id: "2",
      pe_ordem_id: "1",
    });
    setTaxonomies([]);
    setResponseInfo(null);
    setError(null);
  };

  const testService = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await testTaxonomyServiceAction();
        if (result.success) {
          alert(`✅ ${result.message}`);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro no teste");
      }
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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
              onClick={testService}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              Testar API
            </Button>
          </div>
        </div>

        {/* Seletor de Método */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">
                Método de Requisição:
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={
                    apiMethod === "server-action" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setApiMethod("server-action")}
                  disabled={isPending}
                >
                  <Server className="w-4 h-4 mr-2" />
                  Server Action (Recomendado)
                </Button>
                <Button
                  variant={apiMethod === "api-route" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setApiMethod("api-route")}
                  disabled={isPending}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  API Route
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {apiMethod === "server-action"
                ? "✅ Server Actions executam no servidor e são mais seguras"
                : "⚠️ API Routes são úteis para integrações externas"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Parâmetros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Parâmetros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pe_id_parent">ID Parent</Label>
                  <Input
                    id="pe_id_parent"
                    type="number"
                    value={formData.pe_id_parent}
                    onChange={(e) =>
                      handleInputChange("pe_id_parent", e.target.value)
                    }
                    placeholder="-1 (todos níveis)"
                  />
                </div>
                <div>
                  <Label htmlFor="pe_id_taxonomy">ID Taxonomy</Label>
                  <Input
                    id="pe_id_taxonomy"
                    type="number"
                    value={formData.pe_id_taxonomy}
                    onChange={(e) =>
                      handleInputChange("pe_id_taxonomy", e.target.value)
                    }
                    placeholder="0 (sem filtro)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pe_taxonomia">Nome da Taxonomia</Label>
                <Input
                  id="pe_taxonomia"
                  type="text"
                  value={formData.pe_taxonomia}
                  onChange={(e) =>
                    handleInputChange("pe_taxonomia", e.target.value)
                  }
                  placeholder="Filtrar por nome..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pe_flag_inativo">Flag Inativo</Label>
                  <Input
                    id="pe_flag_inativo"
                    type="number"
                    min="0"
                    max="1"
                    value={formData.pe_flag_inativo}
                    onChange={(e) =>
                      handleInputChange("pe_flag_inativo", e.target.value)
                    }
                    placeholder="0 (apenas ativos)"
                  />
                </div>
                <div>
                  <Label htmlFor="pe_qt_registros">Qtd Registros</Label>
                  <Input
                    id="pe_qt_registros"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.pe_qt_registros}
                    onChange={(e) =>
                      handleInputChange("pe_qt_registros", e.target.value)
                    }
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pe_pagina_id">Página ID</Label>
                  <Input
                    id="pe_pagina_id"
                    type="number"
                    min="0"
                    value={formData.pe_pagina_id}
                    onChange={(e) =>
                      handleInputChange("pe_pagina_id", e.target.value)
                    }
                    placeholder="0 (primeira página)"
                  />
                </div>
                <div>
                  <Label htmlFor="pe_coluna_id">Coluna ID</Label>
                  <Input
                    id="pe_coluna_id"
                    type="number"
                    value={formData.pe_coluna_id}
                    onChange={(e) =>
                      handleInputChange("pe_coluna_id", e.target.value)
                    }
                    placeholder="2 (ordenação)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pe_ordem_id">Ordem ID</Label>
                <Input
                  id="pe_ordem_id"
                  type="number"
                  min="0"
                  max="1"
                  value={formData.pe_ordem_id}
                  onChange={(e) =>
                    handleInputChange("pe_ordem_id", e.target.value)
                  }
                  placeholder="1 (crescente)"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Taxonomias
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isPending}
                >
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações da Resposta */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            {responseInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status Code:</span>
                  <Badge
                    variant={
                      responseInfo.statusCode === 100200
                        ? "default"
                        : "destructive"
                    }
                  >
                    {responseInfo.statusCode}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <Badge variant="secondary">
                    {responseInfo.quantity || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Páginas:</span>
                  <Badge variant="outline">
                    {responseInfo.totalPages || 0}
                  </Badge>
                </div>
                {responseInfo.message && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {responseInfo.message}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Execute uma busca para ver informações da resposta
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Área de Erro */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de Resultados */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Resultados da Busca
            {taxonomies.length > 0 && (
              <Badge variant="secondary">{taxonomies.length} item(ns)</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando taxonomias...</span>
            </div>
          ) : taxonomies.length > 0 ? (
            <div className="grid gap-4">
              {taxonomies.map((taxonomy, index) => (
                <Card
                  key={`${taxonomy.ID_TAXONOMY || index}`}
                  className="border-l-4 border-l-primary"
                >
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {taxonomy.TAXONOMIA || "N/A"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {taxonomy.ID_TAXONOMY || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <strong>Slug:</strong> {taxonomy.SLUG || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Parent ID:</strong>{" "}
                          {taxonomy.PARENT_ID || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Level:</strong> {taxonomy.LEVEL || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <strong>Ordem:</strong> {taxonomy.ORDEM || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Registros:</strong>{" "}
                          {taxonomy.QT_RECORDS || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>ID Imagem:</strong>{" "}
                          {taxonomy.ID_IMAGEM || "N/A"}
                        </p>
                      </div>
                    </div>
                    {(taxonomy.META_TITLE ||
                      taxonomy.META_DESCRIPTION ||
                      taxonomy.ANOTACOES) && (
                      <div className="mt-3 pt-3 border-t space-y-1">
                        {taxonomy.META_TITLE && (
                          <p className="text-sm">
                            <strong>Meta Title:</strong> {taxonomy.META_TITLE}
                          </p>
                        )}
                        {taxonomy.META_DESCRIPTION && (
                          <p className="text-sm">
                            <strong>Meta Description:</strong>{" "}
                            {taxonomy.META_DESCRIPTION}
                          </p>
                        )}
                        {taxonomy.ANOTACOES && (
                          <p className="text-sm">
                            <strong>Anotações:</strong> {taxonomy.ANOTACOES}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {responseInfo
                  ? "Nenhuma taxonomia encontrada com os parâmetros informados."
                  : "Execute uma busca para ver os resultados."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxonomyTestPage;
