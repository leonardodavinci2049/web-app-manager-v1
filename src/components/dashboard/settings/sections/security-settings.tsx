"use client";

import { Eye, EyeOff, Shield } from "lucide-react";
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

interface SecuritySettingsProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onPasswordChange: (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export function SecuritySettings({
  currentPassword,
  newPassword,
  confirmPassword,
  onPasswordChange,
}: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    onPasswordChange({
      currentPassword: field === "currentPassword" ? value : currentPassword,
      newPassword: field === "newPassword" ? value : newPassword,
      confirmPassword: field === "confirmPassword" ? value : confirmPassword,
    });
  };

  const passwordRequirements = [
    { text: "1 letra minúscula", met: /[a-z]/.test(newPassword) },
    { text: "1 letra maiúscula", met: /[A-Z]/.test(newPassword) },
    { text: "1 letra minúscula", met: /[a-z]/.test(newPassword) },
    { text: "1 caractere maiúscula", met: /[A-Z]/.test(newPassword) },
    { text: "1 número", met: /\d/.test(newPassword) },
  ];

  const isPasswordValid =
    newPassword.length >= 8 && passwordRequirements.every((req) => req.met);
  const doPasswordsMatch =
    newPassword === confirmPassword && newPassword !== "";
  const canSave =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    isPasswordValid &&
    doPasswordsMatch;

  const handleSave = () => {
    if (canSave) {
      // TODO: Implementar lógica de alteração de senha
      console.log("Alterando senha...");
      // Reset dos campos após salvar
      onPasswordChange({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Segurança
        </CardTitle>
        <CardDescription>
          Altere sua senha e configure opções de segurança
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Senha Atual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Senha Atual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  handleFieldChange("currentPassword", e.target.value)
                }
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  handleFieldChange("newPassword", e.target.value)
                }
                placeholder="Digite sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Requisitos da senha */}
            {newPassword && (
              <div className="text-muted-foreground space-y-1 text-xs">
                <p>A senha deve conter pelo menos 8 caracteres e:</p>
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={`req-${req.text}-${index}`}
                      className={`flex items-center gap-1 ${req.met ? "text-green-600" : ""}`}
                    >
                      <span>{req.met ? "✓" : "×"}</span>
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  handleFieldChange("confirmPassword", e.target.value)
                }
                placeholder="Digite novamente sua nova senha"
                className={
                  confirmPassword && !doPasswordsMatch
                    ? "border-destructive"
                    : ""
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {confirmPassword && !doPasswordsMatch && (
              <p className="text-destructive text-xs">
                As senhas não coincidem
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="sm" disabled={!canSave}>
            Alterar Senha
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
