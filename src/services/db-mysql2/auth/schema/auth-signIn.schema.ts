import z from "zod";

export interface AuthSignInSchema {
  USER_ID?: number;
  EMAIL: string;
  PASSWORD_MD5: string;
}

export const validateAuthSignInSchema = z.object({
  USER_ID: z.number().int().positive().optional(),
  EMAIL: z
    .string()
    .trim()
    .email({ message: "EMAIL deve ser um endereço de email válido" }),
  PASSWORD_MD5: z
    .string()
    .trim()
    .min(8, { message: "SENHA deve ter no mínimo 8 caracteres" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "SENHA deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial",
      },
    ),
});
