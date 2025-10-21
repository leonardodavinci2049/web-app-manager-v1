"use client";

/**
 * Componentes de input que usam useFormStatus para estado de loading
 */

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Input que se desabilita automaticamente durante submit
export function FormInput(props: ComponentProps<typeof Input>) {
  const { pending } = useFormStatus();

  return <Input {...props} disabled={pending || props.disabled} />;
}

// Textarea que se desabilita automaticamente durante submit
export function FormTextarea(props: ComponentProps<typeof Textarea>) {
  const { pending } = useFormStatus();

  return <Textarea {...props} disabled={pending || props.disabled} />;
}

// Button que se desabilita automaticamente durante submit
export function FormButton(props: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      disabled={pending || props.disabled}
      aria-disabled={pending}
    />
  );
}
