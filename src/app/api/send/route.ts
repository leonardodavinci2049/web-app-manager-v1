import { NextResponse } from "next/server";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/TemplateForgotPasswordEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello world",
      react: ForgotPasswordEmail({
        userName: "Usuário Exemplo",
        userEmail: "example@gmail.com",
        resetUrl: "https://example.com/reset-password",
      }),
    });

    if (error) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
