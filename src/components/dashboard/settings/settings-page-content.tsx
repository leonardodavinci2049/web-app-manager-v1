"use client";

import { useState } from "react";
import { AppearanceSettings } from "./sections/appearance-settings";
import { LoginEmailSettings } from "./sections/login-email-settings";
import { NotificationSettings } from "./sections/notification-settings";
import { SecuritySettings } from "./sections/security-settings";

interface NotificationsType {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsPageContent() {
  const [settings, setSettings] = useState({
    // Configurações de Aparência
    theme: "system" as string, // "light", "dark", "system"

    // Configurações de Notificações
    notifications: {
      email: true,
      sms: true,
      whatsapp: true,
      push: true,
    } as NotificationsType,

    // Email de Login
    loginEmail: "meuprojeto@email.com",

    // Configurações de Segurança
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="space-y-8">
      {/* Seção de Aparência */}
      <AppearanceSettings
        theme={settings.theme}
        onThemeChange={(theme: string) =>
          setSettings((prev) => ({ ...prev, theme }))
        }
      />

      {/* Seção de Notificações */}
      <NotificationSettings
        notifications={settings.notifications}
        onNotificationsChange={(notifications: NotificationsType) =>
          setSettings((prev) => ({ ...prev, notifications }))
        }
      />

      {/* Seção de Email de Login */}
      <LoginEmailSettings
        email={settings.loginEmail}
        onEmailChange={(loginEmail: string) =>
          setSettings((prev) => ({ ...prev, loginEmail }))
        }
      />

      {/* Seção de Segurança */}
      <SecuritySettings
        currentPassword={settings.currentPassword}
        newPassword={settings.newPassword}
        confirmPassword={settings.confirmPassword}
        onPasswordChange={(passwordData: PasswordData) =>
          setSettings((prev) => ({ ...prev, ...passwordData }))
        }
      />
    </div>
  );
}
