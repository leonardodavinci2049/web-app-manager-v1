import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Força a página a ser dinâmica por usar headers()
export const dynamic = "force-dynamic";

export default async function RootPage() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Se usuário está logado E tem sessão válida
    if (session?.user) {
      redirect("/dashboard");
    }

    // Se não está logado OU sessão inválida
    redirect("/sign-in");
  } catch (error) {
    // Se for um redirect, deixa passar (comportamento normal do Next.js)
    if (isRedirectError(error)) {
      throw error;
    }

    // Em caso de erro real na validação, redireciona para login
    console.error("Session validation error:", error);
    redirect("/sign-in");
  }
}
