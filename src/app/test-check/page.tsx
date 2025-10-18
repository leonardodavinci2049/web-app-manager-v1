"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckResult {
  success?: boolean;
  exists?: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

const CheckPage = () => {
  // Estados para os valores dos inputs
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");

  // Estados para os resultados das verificações
  const [emailResult, setEmailResult] = useState<CheckResult | null>(null);
  const [cpfResult, setCpfResult] = useState<CheckResult | null>(null);
  const [cnpjResult, setCnpjResult] = useState<CheckResult | null>(null);

  // Estados para loading
  const [emailLoading, setEmailLoading] = useState(false);
  const [cpfLoading, setCpfLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{2})$/, "$1-$2")
      .slice(0, 14);
  };

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{2})$/, "$1-$2")
      .slice(0, 18);
  };

  // Função para verificar email
  const handleCheckEmail = async () => {
    if (!email.trim()) return;

    setEmailLoading(true);
    setEmailResult(null);

    try {
      const response = await fetch("/api/check/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TERM: email }),
      });

      const result = await response.json();
      setEmailResult(result);
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      setEmailResult({
        error: "Erro ao verificar email",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Função para verificar CPF
  const handleCheckCPF = async () => {
    if (!cpf.trim()) return;

    setCpfLoading(true);
    setCpfResult(null);

    try {
      const response = await fetch("/api/check/cpf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TERM: cpf.replace(/\D/g, "") }),
      });

      const result = await response.json();
      setCpfResult(result);
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setCpfResult({
        error: "Erro ao verificar CPF",
      });
    } finally {
      setCpfLoading(false);
    }
  };

  // Função para verificar CNPJ
  const handleCheckCNPJ = async () => {
    if (!cnpj.trim()) return;

    setCnpjLoading(true);
    setCnpjResult(null);

    try {
      const response = await fetch("/api/check/cnpj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TERM: cnpj.replace(/\D/g, "") }),
      });

      const result = await response.json();
      setCnpjResult(result);
    } catch (error) {
      console.error("Erro ao verificar CNPJ:", error);
      setCnpjResult({
        error: "Erro ao verificar CNPJ",
      });
    } finally {
      setCnpjLoading(false);
    }
  };

  // Função para renderizar resultado
  const renderResult = (result: CheckResult | null, type: string) => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="bg-destructive/10 border-destructive/20 mt-3 rounded-md border p-3">
          <p className="text-destructive text-sm">{result.error}</p>
        </div>
      );
    }

    // Usar a propriedade exists para determinar se foi encontrado
    const isFound = result.exists === true;
    const message =
      result.message ||
      (isFound ? `${type} encontrado` : `${type} não encontrado`);

    return (
      <div
        className={`mt-3 rounded-md p-3 ${
          isFound
            ? "border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30"
            : "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
        }`}
      >
        <p
          className={`text-sm ${
            isFound
              ? "text-orange-700 dark:text-orange-300"
              : "text-green-700 dark:text-green-300"
          }`}
        >
          {message}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-3 text-3xl font-bold">
            Verificação de Dados
          </h1>
          <p className="text-muted-foreground text-lg">
            Verifique se Email, CPF ou CNPJ já existem na base de dados
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card Email */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verificar Email</CardTitle>
              <p className="text-muted-foreground text-sm">
                Informe um email para verificar se já está cadastrado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teste@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCheckEmail()}
                />
              </div>
              <Button
                onClick={handleCheckEmail}
                disabled={emailLoading || !email.trim()}
                className="w-full"
              >
                {emailLoading ? "Verificando..." : "Verificar Email"}
              </Button>
              {renderResult(emailResult, "Email")}
            </CardContent>
          </Card>

          {/* Card CPF */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verificar CPF</CardTitle>
              <p className="text-muted-foreground text-sm">
                Informe um CPF para verificar se já está cadastrado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  onKeyPress={(e) => e.key === "Enter" && handleCheckCPF()}
                  maxLength={14}
                />
              </div>
              <Button
                onClick={handleCheckCPF}
                disabled={cpfLoading || !cpf.trim()}
                className="w-full"
              >
                {cpfLoading ? "Verificando..." : "Verificar CPF"}
              </Button>
              {renderResult(cpfResult, "CPF")}
            </CardContent>
          </Card>

          {/* Card CNPJ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verificar CNPJ</CardTitle>
              <p className="text-muted-foreground text-sm">
                Informe um CNPJ para verificar se já está cadastrado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                  onKeyPress={(e) => e.key === "Enter" && handleCheckCNPJ()}
                  maxLength={18}
                />
              </div>
              <Button
                onClick={handleCheckCNPJ}
                disabled={cnpjLoading || !cnpj.trim()}
                className="w-full"
              >
                {cnpjLoading ? "Verificando..." : "Verificar CNPJ"}
              </Button>
              {renderResult(cnpjResult, "CNPJ")}
            </CardContent>
          </Card>
        </div>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como usar:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Digite o Email, CPF ou CNPJ que deseja verificar</li>
              <li>
                • Clique no botão &quot;Verificar&quot; ou pressione Enter
              </li>
              <li>• O resultado será exibido abaixo do botão</li>
              <li>• Verde = não encontrado | Vermelho = já existe na base</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckPage;
