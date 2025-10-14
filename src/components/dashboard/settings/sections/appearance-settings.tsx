"use client";

import { Settings } from "lucide-react";
import { LanguageSelector } from "@/components/dashboard/header/language-selector";
import { ThemeSelector } from "@/components/dashboard/header/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AppearanceSettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function AppearanceSettings({
  theme,
  onThemeChange,
}: AppearanceSettingsProps) {
  const themes = [
    { value: "light", label: "Claro", icon: "☀️" },
    { value: "dark", label: "Escuro", icon: "🌙" },
    { value: "system", label: "Sistema", icon: "💻" },
  ];

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log("Salvando configurações de aparência:", theme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Aparência
        </CardTitle>
        <CardDescription>Personalize a aparência da interface</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tema</Label>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <div key={themeOption.value} className="relative">
                <button
                  type="button"
                  onClick={() => onThemeChange(themeOption.value)}
                  className={`hover:border-primary/50 flex w-full flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    theme === themeOption.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  } `}
                >
                  <span className="text-2xl">{themeOption.icon}</span>
                  <span className="text-sm font-medium">
                    {themeOption.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Seletor de Tema (cores do sistema) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Esquema de Cores</Label>
          <div className="max-w-sm">
            <ThemeSelector />
          </div>
        </div>

        {/* Seletor de Idioma */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Idioma</Label>
          <div className="max-w-sm">
            <LanguageSelector
              variant="compact"
              showText={true}
              size="default"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="sm">
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
