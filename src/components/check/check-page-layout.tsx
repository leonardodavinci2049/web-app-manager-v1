/**
 * Server Components for Check page static content
 * Handles page header and instructions with i18n support
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Server Component for page header
 * Displays page title and description
 */
export function CheckPageHeader() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-foreground mb-3 text-3xl font-bold">
        Verificação de Dados
      </h1>
      <p className="text-muted-foreground text-lg">
        Verifique se Email, CPF ou CNPJ já existem na base de dados
      </p>
    </div>
  );
}

/**
 * Server Component for usage instructions
 * Displays how to use the check functionality
 */
export function CheckInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Como usar:</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>• Digite o Email, CPF ou CNPJ que deseja verificar</li>
          <li>• Clique no botão &quot;Verificar&quot; ou pressione Enter</li>
          <li>• O resultado será exibido abaixo do botão</li>
          <li>• Verde = não encontrado | Laranja = já existe na base</li>
          <li>• Vermelho = erro na verificação</li>
        </ul>
      </CardContent>
    </Card>
  );
}

/**
 * Server Component for page container
 * Provides consistent layout and spacing
 */
export function CheckPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
}

/**
 * Server Component for form grid layout
 * Responsive grid for check form cards
 */
export function CheckFormsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {children}
    </div>
  );
}
