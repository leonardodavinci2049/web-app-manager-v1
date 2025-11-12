import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { Resend } from "resend";
import { getActiveOrganization } from "@/app/actions/action-organizations";
import TemplateForgotPasswordEmail from "@/components/emails/TemplateForgotPasswordEmail";
import TemplateOrganizationInvitation from "@/components/emails/TemplateOrganizationInvitation";
import TemplateVerifyEmail from "@/components/emails/TemplateVerifyEmail.tsx";
import { envs } from "@/core/config";
import prisma from "@/lib/prisma";
import { ac, admin, member, owner } from "./auth/auth-permissions";

const resend = new Resend(envs.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  socialProviders: {
    google: {
      clientId: envs.GOOGLE_CLIENT_ID,
      clientSecret: envs.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        //    console.log(`🔄 Enviando email de reset de senha para: ${user.email}`);

        await resend.emails.send({
          from: `${envs.EMAIL_SENDER_NAME} <${envs.EMAIL_SENDER_ADDRESS}>`,
          to: user.email,
          subject: "Reset your password",
          react: TemplateForgotPasswordEmail({
            userName: user.name || user.email,
            resetUrl: url,
            userEmail: user.email,
          }),
        });

        // console.log(`✅ Email de reset enviado com sucesso:`, result);
      } catch (error) {
        console.error(`❌ Erro ao enviar email de reset de senha:`, error);
        throw error;
      }
    },
    requireEmailVerification: false, // Ativar verificação de email
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        //  console.log(`🔄 Enviando email de verificação para: ${user.email}`);

        const result = await resend.emails.send({
          from: `${envs.EMAIL_SENDER_NAME} <${envs.EMAIL_SENDER_ADDRESS}>`,
          to: user.email,
          subject: "Verify your email",
          react: TemplateVerifyEmail({
            userName: user.name || user.email,
            verifyUrl: url,
          }),
        });

        console.log(`✅ Email de verificação enviado com sucesso:`, result);
      } catch (error) {
        console.error(`❌ Erro ao enviar email de verificação:`, error);
        throw error;
      }
    },
    sendOnSignUp: false, // Temporariamente desabilitado
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },

  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;

        resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: data.email,
          subject: "You've been invited to join our organization",
          react: TemplateOrganizationInvitation({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
      ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
    nextCookies(),
  ],
});
