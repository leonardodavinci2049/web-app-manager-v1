"use client";

import { Bell, Mail, MessageCircle, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  onNotificationsChange: (notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  }) => void;
}

export function NotificationSettings({
  notifications,
  onNotificationsChange,
}: NotificationSettingsProps) {
  const notificationOptions = [
    {
      key: "email" as const,
      label: "Notificações por E-mail",
      description: "Receba atualizações sobre pedidos e promoções",
      icon: Mail,
    },
    {
      key: "sms" as const,
      label: "Notificações por SMS",
      description: "Receba alertas importantes por mensagem de texto",
      icon: MessageCircle,
    },
    {
      key: "whatsapp" as const,
      label: "Notificações por WhatsApp",
      description: "Receba atualizações através do WhatsApp",
      icon: Smartphone,
    },
    {
      key: "push" as const,
      label: "Notificações Push",
      description: "Receba notificações diretamente no navegador",
      icon: Zap,
    },
  ];

  const handleToggle = (key: keyof typeof notifications) => {
    onNotificationsChange({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log("Salvando configurações de notificações:", notifications);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
        </CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-muted-foreground h-5 w-5" />
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium">
                      {option.label}
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications[option.key]}
                  onCheckedChange={() => handleToggle(option.key)}
                />
              </div>
            );
          })}
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
