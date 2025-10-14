"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResendConfig {
  hasApiKey: boolean;
  apiKeyLength: number;
  senderName: string;
  senderAddress: string;
  isConfigurationComplete: boolean;
}

export default function TestResendPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ResendConfig | null>(null);

  const checkConfiguration = async () => {
    try {
      const response = await fetch("/api/test-resend");
      const data = await response.json();
      setConfig(data.config);

      if (data.config.isConfigurationComplete) {
        toast.success("✅ Configuração do Resend está completa!");
      } else {
        toast.error("❌ Configuração do Resend está incompleta");
      }
    } catch (error) {
      toast.error("Erro ao verificar configurações");
      console.error(error);
    }
  };

  const sendTestEmail = async () => {
    if (!email) {
      toast.error("Por favor, informe um email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/test-resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Email de teste enviado com sucesso!");
        console.log("Resultado do envio:", data);
      } else {
        toast.error(`❌ Erro: ${data.error}`);
        console.error("Erro do servidor:", data);
      }
    } catch (error) {
      toast.error("Erro ao enviar email de teste");
      console.error("Erro na requisição:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Teste do Resend</CardTitle>
            <CardDescription>
              Verifique se o Resend está configurado corretamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={checkConfiguration}
              variant="outline"
              className="w-full"
            >
              🔍 Verificar Configurações
            </Button>

            {config && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <h4 className="mb-2 font-medium">Status da Configuração:</h4>
                <ul className="space-y-1">
                  <li>
                    API Key:{" "}
                    {config.hasApiKey ? "✅ Configurada" : "❌ Ausente"}
                  </li>
                  <li>
                    Remetente: {config.senderName || "❌ Não configurado"}
                  </li>
                  <li>Email: {config.senderAddress || "❌ Não configurado"}</li>
                  <li>
                    Completa:{" "}
                    {config.isConfigurationComplete ? "✅ Sim" : "❌ Não"}
                  </li>
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="test-email">Email para teste:</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={sendTestEmail}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? "📤 Enviando..." : "📧 Enviar Email de Teste"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>
                Configure as variáveis de ambiente no arquivo <code>.env</code>
              </li>
              <li>
                Clique em &quot;Verificar Configurações&quot; para ver o status
              </li>
              <li>
                Informe seu email e clique em &quot;Enviar Email de Teste&quot;
              </li>
              <li>
                Verifique sua caixa de entrada (e spam) para o email de teste
              </li>
              <li>Se funcionar, o reset de senha também funcionará!</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Variáveis Necessárias</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
              {`RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_SENDER_NAME=Sua Empresa
EMAIL_SENDER_ADDRESS=noreply@seudominio.com`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
