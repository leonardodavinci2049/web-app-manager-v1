"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useId, useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

import {
  type ResetPasswordFormData,
  validateResetPasswordData,
} from "../_common-validations/validation";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gerar ID único para cada instância do componente usando useId (SSR-safe)
  const formId = useId();

  // Função para validar o formulário
  const validateForm = (
    formData: FormData,
  ): { isValid: boolean; data?: ResetPasswordFormData } => {
    const rawData = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = validateResetPasswordData(rawData);

    if (!validation.success) {
      setErrors(validation.errors || {});
      return { isValid: false };
    }

    setErrors({});
    return { isValid: true, data: validation.data || undefined };
  };

  // Função onSubmit do lado do cliente
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const validation = validateForm(formData);

    if (!validation.isValid || !validation.data) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: validation.data.password,
        token,
      });

      if (error) {
        // Tratar diferentes tipos de erro
        if (
          error.message?.includes("Invalid token") ||
          error.message?.includes("Token expired")
        ) {
          toast.error(
            "Link de recuperação inválido ou expirado. Solicite um novo link.",
          );
        } else {
          toast.error(
            error.message || "Erro ao redefinir a senha. Tente novamente.",
          );
        }
      } else {
        toast.success("Senha redefinida com sucesso!");
        // Redirecionar para login após sucesso
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("auth.resetPassword.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor={`newPassword-${formId}`}>
              {t("auth.resetPassword.newPassword")}
            </Label>
            <Input
              id={`newPassword-${formId}`}
              name="password"
              type="password"
              placeholder={t("auth.login.passwordPlaceholder")}
              required
              autoComplete="new-password"
              className={cn(
                errors?.password &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {errors?.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor={`confirmPassword-${formId}`}>
              {t("auth.resetPassword.confirmPassword")}
            </Label>
            <Input
              id={`confirmPassword-${formId}`}
              name="confirmPassword"
              type="password"
              placeholder={t("auth.signup.confirmPasswordPlaceholder")}
              required
              autoComplete="new-password"
              className={cn(
                errors?.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {errors?.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : t("auth.resetPassword.resetButton")}
          </Button>
        </form>
      </div>

      <div className="text-center text-sm">
        <a href="/sign-in" className="underline underline-offset-4">
          {t("auth.forgotPassword.backToLogin")}
        </a>
      </div>

      {/* Token oculto para debugging */}
      <input type="hidden" value={token} />
    </div>
  );
};

export default ResetPasswordForm;
