import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActiveThemeProvider } from "@/components/dashboard/active-theme";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// Força o layout a ser dinâmico por usar headers() e auth
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Validação completa de sessão no Server Component
  // Isso garante segurança real mesmo se o middleware for contornado
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Strict validation - no session means no access
    if (!session?.user) {
      redirect("/sign-in");
    }

    // Continua com o layout se sessão é válida
  } catch (error) {
    // Se for um redirect, deixa passar (comportamento normal do Next.js)
    if (isRedirectError(error)) {
      throw error;
    }

    // Log error for debugging but don't expose details to user
    console.error("Dashboard session validation error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    redirect("/sign-in");
  }

  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <div
      className={cn(
        "bg-background overscroll-none font-sans antialiased",
        activeThemeValue ? `theme-${activeThemeValue}` : "",
        isScaled ? "theme-scaled" : "",
      )}
    >
      <ActiveThemeProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </ActiveThemeProvider>
    </div>
  );
}
