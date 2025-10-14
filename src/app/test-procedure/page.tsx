"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProcedureResult {
  success: boolean;
  timestamp: string;
  procedure: string;
  type: string;
  result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: unknown;
    feedback: unknown;
    operationResult: unknown;
    recordCount: number;
  };
  formattedResult: string;
}

const PROCEDURE_EXAMPLES = [
  {
    name: "Check CPF Exists",
    procedure: `CALL sp_check_if_cpf_exists_V2 (
  1, -- PE_SYSTEM_CLIENT_ID INT,
  1, -- PE_STORE_ID INT,	
  1, -- PE_APP_ID INT,	
  29014, --  PE_USER_ID INT                           
  UNIX_TIMESTAMP() -- PE_TERM VARCHAR(500)  
)`,
    type: "generic",
  },
  {
    name: "Update Password",
    procedure: `CALL sp_auth_update_password_v2(
  1, -- PE_SYSTEM_CLIENT_ID INT,
  1, -- PE_STORE_ID INT,
  2, -- PE_APP_ID INT,
  47513, -- PE_USER_ID INT,     
  MD5('CstH@2052') -- bcf05ec7cc74846c875217b4bf6418b6
)`,
    type: "generic",
  },
  {
    name: "Simple Data Query",
    procedure: "CALL sp_get_all_users()",
    type: "data",
  },
];

export default function TestProcedurePage() {
  const [procedure, setProcedure] = useState("");
  const [type, setType] = useState("generic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcedureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const executeProcedure = async () => {
    if (!procedure.trim()) {
      setError("Por favor, insira uma procedure para testar");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-procedure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          procedure: procedure.trim(),
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro na requisição");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example: (typeof PROCEDURE_EXAMPLES)[0]) => {
    setProcedure(example.procedure);
    setType(example.type);
    setResult(null);
    setError(null);
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result.result, null, 2),
      );
      setCopied(true);
      toast.success("JSON copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar para a área de transferência");
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">
          Teste de Procedures Genéricas
        </h1>
        <p className="text-muted-foreground">
          Interface para testar qualquer procedure MariaDB/MySQL de forma
          interativa
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Painel de Entrada */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Procedure</CardTitle>
              <CardDescription>
                Insira a chamada da procedure e selecione o tipo de execução
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de Execução */}
              <div>
                <label
                  htmlFor="execution-type"
                  className="mb-2 block text-sm font-medium"
                >
                  Tipo de Execução
                </label>
                <select
                  id="execution-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-md border p-2 focus:border-transparent focus:ring-2"
                >
                  <option value="generic">Generic (Padrão)</option>
                  <option value="data">Data Only</option>
                  <option value="modify">Modify (INSERT/UPDATE/DELETE)</option>
                </select>
                <p className="text-muted-foreground mt-1 text-xs">
                  {type === "generic" &&
                    "Para procedures com múltiplos resultsets"}
                  {type === "data" &&
                    "Para procedures que retornam apenas dados"}
                  {type === "modify" && "Para procedures de modificação"}
                </p>
              </div>

              {/* Procedure Input */}
              <div>
                <label
                  htmlFor="procedure-call"
                  className="mb-2 block text-sm font-medium"
                >
                  Procedure Call
                </label>
                <textarea
                  id="procedure-call"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="CALL sp_example(1, 'parameter', UNIX_TIMESTAMP())"
                  className="border-input bg-background focus:ring-ring h-32 w-full rounded-md border p-3 font-mono text-sm focus:border-transparent focus:ring-2"
                />
              </div>

              {/* Botão de Execução */}
              <Button
                onClick={executeProcedure}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Executando..." : "Executar Procedure"}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exemplos */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplos</CardTitle>
              <CardDescription>
                Clique em um exemplo para carregar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PROCEDURE_EXAMPLES.map((example) => (
                  <Button
                    key={example.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example)}
                    className="w-full justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">{example.name}</div>
                      <div className="text-muted-foreground text-xs">
                        Tipo: {example.type}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Resultado */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>
                {result
                  ? `Executado em ${new Date(result.timestamp).toLocaleString()}`
                  : "Resultado aparecerá aqui após execução"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        result.result.success
                          ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-destructive/10 text-destructive dark:bg-destructive/20"
                      }`}
                    >
                      {result.result.success ? "SUCESSO" : "ERRO"}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      Código: {result.result.statusCode}
                    </span>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="mb-1 font-medium">Mensagem</h4>
                    <p className="bg-muted rounded p-2 text-sm">
                      {result.result.message}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Registros:</span>{" "}
                      {result.result.recordCount}
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {result.type}
                    </div>
                  </div>

                  {/* Formatted Result */}
                  <div>
                    <h4 className="mb-2 font-medium">Resultado Formatado</h4>
                    <pre className="max-h-96 overflow-auto rounded bg-slate-950 p-3 text-xs whitespace-pre-wrap text-green-400 dark:bg-slate-900 dark:text-green-300">
                      {result.formattedResult}
                    </pre>
                  </div>

                  {/* Raw JSON */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-medium">JSON Completo</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-8 gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copiar JSON
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted text-foreground max-h-64 overflow-auto rounded p-3 font-mono text-xs">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <p>Nenhum resultado ainda</p>
                  <p className="text-sm">
                    Execute uma procedure para ver o resultado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
