// Next.js automaticamente carrega variáveis do .env
// Não precisamos mais do dotenv/config

import { z } from "zod";

const envsSchema = z.object({
  APP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("APP_PORT must be a positive number")),

  SYSTEM_CLIENT_ID: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("SYSTEM_CLIENT_ID must be a positive number")),
  STORE_ID: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("STORE_ID must be a positive number")),
  APP_ID: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("USER_ID must be a positive number")),
  TYPE_BUSINESS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("TYPE_BUSINESS must be a positive number")),

  // Organization, Member and User IDs
  // ⚠️ DEVELOPMENT ONLY: Em produção, estes valores devem vir da sessão do usuário
  // Não devem ser fixos no .env, pois cada usuário tem seus próprios IDs
  // Os valores na documentação da API são apenas exemplos de demonstração
  // TODO: Migrar para obtenção via getUserSession() em produção
  ORGANIZATION_ID: z.string().min(1, "ORGANIZATION_ID is required"),
  MEMBER_ID: z.string().min(1, "MEMBER_ID is required"),
  USER_ID: z.string().min(1, "USER_ID is required"),
  PERSON_ID: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("PERSON_ID must be a positive number")),
  // INFO DEVELOPER - Variáveis públicas (disponíveis no cliente)
  // Usadas para exibir informações do desenvolvedor no footer/sobre
  NEXT_PUBLIC_DEVELOPER_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_DEVELOPER_NAME is required"),
  NEXT_PUBLIC_DEVELOPER_URL: z
    .string()
    .url("NEXT_PUBLIC_DEVELOPER_URL must be a valid URL"),

  // INFO COMPANY - Variáveis públicas da empresa (disponíveis no cliente)
  // Usadas para exibir informações de contato da empresa
  NEXT_PUBLIC_COMPANY_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_COMPANY_NAME is required"),
  NEXT_PUBLIC_COMPANY_PHONE: z
    .string()
    .min(10, "NEXT_PUBLIC_COMPANY_PHONE must have at least 10 characters")
    .max(20, "NEXT_PUBLIC_COMPANY_PHONE must have at most 20 characters"),
  NEXT_PUBLIC_COMPANY_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_COMPANY_EMAIL must be a valid email"),
  NEXT_PUBLIC_COMPANY_WHATSAPP: z
    .string()
    .min(10, "NEXT_PUBLIC_COMPANY_WHATSAPP must have at least 10 characters")
    .max(20, "NEXT_PUBLIC_COMPANY_WHATSAPP must have at most 20 characters"),
  // Internacionalização (i18n)
  DEFAULT_LOCALE: z
    .string()
    .regex(/^(pt|en)$/, "DEFAULT_LOCALE must be 'pt' or 'en'")
    .default("pt"),
  SUPPORTED_LOCALES: z
    .string()
    .regex(
      /^(pt|en)(,(pt|en))*$/,
      "SUPPORTED_LOCALES must be comma-separated list of 'pt' and/or 'en'",
    )
    .default("pt,en"),

  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),

  // Resend Email Configuration
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_SENDER_NAME: z.string().min(1, "EMAIL_SENDER_NAME is required"),
  EMAIL_SENDER_ADDRESS: z
    .string()
    .email("EMAIL_SENDER_ADDRESS must be a valid email"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // API Configuration
  API_KEY: z.string().min(1, "API_KEY is required"),

  // External API (NestJS Backend)
  EXTERNAL_API_BASE_URL: z
    .string()
    .url("EXTERNAL_API_BASE_URL must be a valid URL")
    .default("http://localhost:5572/api"),

  // External Assets API (srv-assets-v1)
  EXTERNAL_API_ASSETS_URL: z
    .string()
    .url("EXTERNAL_API_ASSETS_URL must be a valid URL")
    .default("http://localhost:5558/api"), // Next.js Application Base URL (for BetterAuth and internal references)
  NEXT_APP_BASE_URL: z
    .string()
    .url("NEXT_APP_BASE_URL must be a valid URL")
    .default("http://localhost:5558"),
});

// Inferir o tipo automaticamente a partir do schema
type EnvVars = z.infer<typeof envsSchema>;

// ✅ Só executar validação no servidor, nunca no cliente
let envVars: EnvVars;

if (typeof window === "undefined") {
  // Estamos no servidor - fazer validação completa
  const validationResult = envsSchema.safeParse(process.env);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`❌ Invalid environment variables:\n${errorMessages}`);
  }

  envVars = validationResult.data;
} else {
  // Estamos no cliente - usar valores vazios ou default para variáveis privadas
  // e valores reais para variáveis públicas (NEXT_PUBLIC_*)
  envVars = {
    APP_PORT: 0,

    SYSTEM_CLIENT_ID: 0,
    STORE_ID: 0,
    APP_ID: 0,
    TYPE_BUSINESS: 0,

    // Organization and Member IDs - não devem ser acessadas no cliente
    ORGANIZATION_ID: "",
    MEMBER_ID: "",
    USER_ID: "",
    PERSON_ID: 0,
    // Estas variáveis públicas PODEM ser acessadas no cliente
    NEXT_PUBLIC_DEVELOPER_NAME: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "",
    NEXT_PUBLIC_DEVELOPER_URL: process.env.NEXT_PUBLIC_DEVELOPER_URL || "",

    // Informações da empresa - também disponíveis no cliente
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || "",
    NEXT_PUBLIC_COMPANY_PHONE: process.env.NEXT_PUBLIC_COMPANY_PHONE || "",
    NEXT_PUBLIC_COMPANY_EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "",
    NEXT_PUBLIC_COMPANY_WHATSAPP:
      process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "",

    // i18n - estas podem ser acessadas no cliente
    DEFAULT_LOCALE: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "pt") as
      | "pt"
      | "en",
    SUPPORTED_LOCALES: process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "pt,en",

    BETTER_AUTH_URL: "",

    // Resend - não devem ser acessadas no cliente
    RESEND_API_KEY: "",
    EMAIL_SENDER_NAME: "",
    EMAIL_SENDER_ADDRESS: "",

    // Google OAuth - não devem ser acessadas no cliente
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",

    // API Configuration - não deve ser acessada no cliente
    API_KEY: "",

    // External API - não deve ser acessada no cliente (apenas server-side)
    EXTERNAL_API_BASE_URL: "http://localhost:5572/api",

    // External Assets API - não deve ser acessada no cliente (apenas server-side)
    EXTERNAL_API_ASSETS_URL: "http://localhost:5573/api",

    // Next.js App URL - pode ser acessada no cliente se necessário
    NEXT_APP_BASE_URL: "http://localhost:5558",
  };
}

export const envs = {
  APP_PORT: envVars.APP_PORT,

  SYSTEM_CLIENT_ID: envVars.SYSTEM_CLIENT_ID,
  STORE_ID: envVars.STORE_ID,
  APP_ID: envVars.APP_ID,
  TYPE_BUSINESS: envVars.TYPE_BUSINESS,

  // Organization, Member and User IDs (valores flexíveis baseados no .env)
  ORGANIZATION_ID: envVars.ORGANIZATION_ID,
  MEMBER_ID: envVars.MEMBER_ID,
  USER_ID: envVars.USER_ID,
  PERSON_ID: envVars.PERSON_ID,

  // INFO DEVELOPER
  NEXT_PUBLIC_DEVELOPER_NAME: envVars.NEXT_PUBLIC_DEVELOPER_NAME,
  NEXT_PUBLIC_DEVELOPER_URL: envVars.NEXT_PUBLIC_DEVELOPER_URL,

  // INFO COMPANY
  NEXT_PUBLIC_COMPANY_NAME: envVars.NEXT_PUBLIC_COMPANY_NAME,
  NEXT_PUBLIC_COMPANY_PHONE: envVars.NEXT_PUBLIC_COMPANY_PHONE,
  NEXT_PUBLIC_COMPANY_EMAIL: envVars.NEXT_PUBLIC_COMPANY_EMAIL,
  NEXT_PUBLIC_COMPANY_WHATSAPP: envVars.NEXT_PUBLIC_COMPANY_WHATSAPP,

  // i18n - Disponível tanto no servidor quanto no cliente
  DEFAULT_LOCALE: envVars.DEFAULT_LOCALE,
  SUPPORTED_LOCALES: envVars.SUPPORTED_LOCALES,

  BETTER_AUTH_URL: envVars.BETTER_AUTH_URL,

  // Resend Email Configuration
  RESEND_API_KEY: envVars.RESEND_API_KEY,
  EMAIL_SENDER_NAME: envVars.EMAIL_SENDER_NAME,
  EMAIL_SENDER_ADDRESS: envVars.EMAIL_SENDER_ADDRESS,

  // Google OAuth
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,

  // API Configuration
  API_KEY: envVars.API_KEY,

  // External API (NestJS Backend) - apenas server-side
  EXTERNAL_API_BASE_URL: envVars.EXTERNAL_API_BASE_URL,

  // External Assets API (srv-assets-v1) - apenas server-side
  EXTERNAL_API_ASSETS_URL: envVars.EXTERNAL_API_ASSETS_URL,
  EXTERNAL_API_ASSETS_KEY: envVars.API_KEY, // Reutiliza a API_KEY existente

  // Next.js Application Base URL
  NEXT_APP_BASE_URL: envVars.NEXT_APP_BASE_URL,
};
