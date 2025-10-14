import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware para autenticação usando Better-Auth
 *
 * IMPORTANTE: O middleware do Next.js executa no Edge Runtime,
 * que tem limitações. Por isso, usamos apenas validação de cookie
 * para redirecionamento otimista.
 *
 * A validação completa de sessão (assinatura JWT, expiração,
 * consulta no banco) é feita nas páginas/rotas individuais.
 *
 * Funcionalidades implementadas:
 * ✅ Verificação otimista de cookie de sessão
 * ✅ Redirecionamento rápido se não há cookie
 * ✅ Compatível com Edge Runtime
 */
export async function middleware(request: NextRequest) {
  // Verificação otimista do cookie de sessão
  // Isso é rápido e não requer acesso ao banco de dados
  const sessionCookie = getSessionCookie(request);

  // Se não há cookie de sessão, redireciona para login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Cookie existe - permite acesso
  // A validação completa será feita na página/rota de destino
  return NextResponse.next();
}

export const config = {
  // Proteger todas as rotas do dashboard e suas subrotas
  matcher: [
    "/dashboard/:path*", // Todas as páginas do dashboard
    "/api/dashboard/:path*", // APIs protegidas (se houver)
  ],
};
