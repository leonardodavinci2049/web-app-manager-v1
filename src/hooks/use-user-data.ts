"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

interface UserData {
  name: string;
  email: string;
  avatar: string;
  id?: string;
  role?: string;
}

export function useUserData(): {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
} {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || "Usuário",
        email: session.user.email || "",
        avatar:
          session.user.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=0f172a&color=fff`,
        id: session.user.id,
      });
      setError(null);
    } else if (!isPending && !session) {
      // Dados mockados quando não há sessão (para desenvolvimento/demonstração)
      setUser({
        name: "Admin Dashboard",
        email: "admin@dashboard.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
        id: "demo-user",
      });
      setError(null);
    }
  }, [session, isPending]);

  return {
    user,
    isLoading: isPending,
    error,
  };
}
