import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy para autenticação usando Better-Auth (Next.js 16+)
 *
 * Este arquivo substitui o antigo middleware.ts
 * Funciona de forma similar, mas usa a nova API de proxy.
 *
 * Funcionalidades:
 * ✅ Verificação otimista de cookie de sessão
 * ✅ Redirecionamento rápido se não há cookie
 * ✅ Compatível com o novo sistema de proxy do Next.js 16
 */

export const config = {
  // Proteger todas as rotas do dashboard e suas subrotas
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
};

export default async function proxy(request: NextRequest) {
  // Verificação otimista do cookie de sessão usando better-auth
  const sessionCookie = getSessionCookie(request);

  // Se não há cookie de sessão, redireciona para login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Cookie existe - permite acesso
  // A validação completa será feita na página/rota de destino
  return NextResponse.next();
}
