import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { envs } from "@/core/config";

const resend = new Resend(envs.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 },
      );
    }

    console.log(`🔄 Testando envio de email para: ${email}`);
    console.log(
      `📧 Remetente configurado: ${envs.EMAIL_SENDER_NAME} <${envs.EMAIL_SENDER_ADDRESS}>`,
    );

    const result = await resend.emails.send({
      from: `${envs.EMAIL_SENDER_NAME} <${envs.EMAIL_SENDER_ADDRESS}>`,
      to: email,
      subject: "Teste de configuração do Resend",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🎉 Configuração do Resend funcionando!</h2>
          <p>Se você recebeu este email, significa que:</p>
          <ul>
            <li>✅ A chave da API do Resend está correta</li>
            <li>✅ O email remetente está configurado</li>
            <li>✅ O sistema está enviando emails corretamente</li>
          </ul>
          <p>Agora o reset de senha deve funcionar!</p>
          <hr>
          <small>Este é um email de teste enviado em ${new Date().toLocaleString("pt-BR")}</small>
        </div>
      `,
    });

    console.log(`✅ Email de teste enviado com sucesso:`, result);

    return NextResponse.json({
      success: true,
      message: "Email de teste enviado com sucesso!",
      data: result,
    });
  } catch (error) {
    console.error(`❌ Erro ao enviar email de teste:`, error);

    return NextResponse.json(
      {
        error: "Erro ao enviar email de teste",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

// Endpoint GET para verificar as configurações sem enviar email
export async function GET() {
  try {
    const config = {
      hasApiKey: !!envs.RESEND_API_KEY,
      apiKeyLength: envs.RESEND_API_KEY?.length || 0,
      senderName: envs.EMAIL_SENDER_NAME,
      senderAddress: envs.EMAIL_SENDER_ADDRESS,
      isConfigurationComplete: !!(
        envs.RESEND_API_KEY &&
        envs.EMAIL_SENDER_NAME &&
        envs.EMAIL_SENDER_ADDRESS
      ),
    };

    return NextResponse.json({
      message: "Configuração do Resend",
      config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao verificar configurações",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
