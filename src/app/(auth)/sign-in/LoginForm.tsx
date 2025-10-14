"use client";

import Form from "next/form";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import GoogleButton from "../components/GoogleButton";

import SubmitButton from "../components/SubmitButton";
import { loginAction } from "./login-action";

// Estado inicial do formulário
const initialState = null;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const [state, formAction] = useActionState(loginAction, initialState);

  // Gerar ID único para cada instância do componente usando useId (SSR-safe)
  const formId = useId();

  // Efeito para mostrar toast com base no estado
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.message && !state?.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        <Form action={formAction} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor={`email-${formId}`}>{t("auth.login.email")}</Label>
            <Input
              id={`email-${formId}`}
              name="email"
              type="email"
              placeholder={t("auth.login.emailPlaceholder")}
              required
              autoComplete="email"
              className={cn(
                state?.errors?.email &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {state?.errors?.email && (
              <p className="text-destructive text-sm">{state.errors.email}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor={`password-${formId}`}>
              {t("auth.login.password")}
            </Label>
            <Input
              id={`password-${formId}`}
              name="password"
              type="password"
              placeholder={t("auth.login.passwordPlaceholder")}
              required
              autoComplete="current-password"
              className={cn(
                state?.errors?.password &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {state?.errors?.password && (
              <p className="text-destructive text-sm">
                {state.errors.password}
              </p>
            )}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
              >
                {t("auth.login.forgotPassword")}
              </a>
            </div>
          </div>

          <SubmitButton />
        </Form>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            {t("auth.login.orContinueWith")}
          </span>
        </div>

        <GoogleButton />
      </div>

      <div className="text-center text-sm">
        {t("auth.login.noAccount")}{" "}
        <a href="/sign-up" className="underline underline-offset-4">
          {t("auth.login.signUp")}
        </a>
      </div>
    </div>
  );
}
