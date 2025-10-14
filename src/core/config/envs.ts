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
    .regex(
      /^\(\d{2}\) \d{4}-\d{4}$/,
      "NEXT_PUBLIC_COMPANY_PHONE must be in format (XX) XXXX-XXXX",
    ),
  NEXT_PUBLIC_COMPANY_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_COMPANY_EMAIL must be a valid email"),
  NEXT_PUBLIC_COMPANY_WHATSAPP: z
    .string()
    .regex(
      /^55\d{11}$/,
      "NEXT_PUBLIC_COMPANY_WHATSAPP must be in format 55XXXXXXXXXXX (country code + area code + number)",
    ),
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

  DB_MYSQL_HOST: z.string().min(1, "DB_MYSQL_HOST is required"),
  DB_MYSQL_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive("DB_MYSQL_PORT must be a positive number")),
  DB_MYSQL_USER: z.string().min(1, "DB_MYSQL_USER is required"),
  DB_MYSQL_PASSWORD: z.string().min(1, "DB_MYSQL_PASSWORD is required"),
  DB_MYSQL_DATABASE: z.string().min(1, "DB_MYSQL_DATABASE is required"),

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

    DB_MYSQL_HOST: "",
    DB_MYSQL_PORT: 0,
    DB_MYSQL_USER: "",
    DB_MYSQL_PASSWORD: "",
    DB_MYSQL_DATABASE: "",
    BETTER_AUTH_URL: "",

    // Resend - não devem ser acessadas no cliente
    RESEND_API_KEY: "",
    EMAIL_SENDER_NAME: "",
    EMAIL_SENDER_ADDRESS: "",

    // Google OAuth - não devem ser acessadas no cliente
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
  };
}

export const envs = {
  APP_PORT: envVars.APP_PORT,

  SYSTEM_CLIENT_ID: envVars.SYSTEM_CLIENT_ID,
  STORE_ID: envVars.STORE_ID,
  APP_ID: envVars.APP_ID,
  TYPE_BUSINESS: envVars.TYPE_BUSINESS,

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

  DB_MYSQL_HOST: envVars.DB_MYSQL_HOST,
  DB_MYSQL_PORT: envVars.DB_MYSQL_PORT,
  DB_MYSQL_USER: envVars.DB_MYSQL_USER,
  DB_MYSQL_PASSWORD: envVars.DB_MYSQL_PASSWORD,
  DB_MYSQL_DATABASE: envVars.DB_MYSQL_DATABASE,
  BETTER_AUTH_URL: envVars.BETTER_AUTH_URL,

  // Resend Email Configuration
  RESEND_API_KEY: envVars.RESEND_API_KEY,
  EMAIL_SENDER_NAME: envVars.EMAIL_SENDER_NAME,
  EMAIL_SENDER_ADDRESS: envVars.EMAIL_SENDER_ADDRESS,

  // Google OAuth
  GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET,
};
