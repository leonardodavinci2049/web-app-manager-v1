import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegistrationSuccessContent from "./RegistrationSuccessContent";

/**
 * Página de sucesso após registro bem-sucedido
 *
 * Validações:
 * 1. Se usuário está logado, redireciona para dashboard
 * 2. Se não veio do registro (sem flag de sucesso), redireciona para login
 * 3. Exibe mensagem de sucesso e aguarda aprovação
 */
export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Verificar se usuário está autenticado através dos cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  // Se usuário está logado, redirecionar para dashboard
  if (sessionCookie?.value) {
    redirect("/dashboard");
  }

  // Verificar se veio do registro (parâmetro success=true)
  const isFromRegistration = searchParams.success === "true";

  // Se não veio do registro, redirecionar para login
  if (!isFromRegistration) {
    redirect("/sign-in");
  }

  return <RegistrationSuccessContent />;
}
