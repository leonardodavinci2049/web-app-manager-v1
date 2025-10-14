"use client";

import { AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginEmailSettingsProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export function LoginEmailSettings({
  email,
  onEmailChange,
}: LoginEmailSettingsProps) {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (newEmail: string) => {
    onEmailChange(newEmail);
    setIsValidEmail(validateEmail(newEmail) || newEmail === "");
  };

  const handleSave = () => {
    if (validateEmail(email)) {
      // TODO: Implementar lógica de salvamento
      console.log("Alterando email de login para:", email);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email de Login
        </CardTitle>
        <CardDescription>Altere seu email de acesso à conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email de Login
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="seuemail@exemplo.com"
            className={`${!isValidEmail ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {!isValidEmail && (
            <div className="text-destructive flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Por favor, entre em contato com o suporte.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            size="sm"
            disabled={!isValidEmail || !email}
          >
            Alterar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
