import { NextResponse } from "next/server";
import { CheckServiceApi } from "@/services/api/check/check-service-api";

export async function GET() {
  try {
    // Verificar configuração da API
    console.log("🔧 Configuração da API:");
    console.log("- EXTERNAL_API_BASE_URL:", process.env.EXTERNAL_API_BASE_URL);
    console.log("- API_KEY:", process.env.API_KEY ? "[SET]" : "[NOT SET]");

    // Primeiro, testar se a API está online
    console.log("🔍 Testando status da API externa...");

    try {
      const status = await CheckServiceApi.getApiStatus();
      console.log("✅ API Status:", status);
    } catch (statusError) {
      console.error("❌ Erro no status da API:", statusError);
      console.error("Stack trace:", statusError);
      return NextResponse.json(
        {
          success: false,
          error: "API externa não está respondendo",
          details:
            statusError instanceof Error
              ? statusError.message
              : "Erro desconhecido",
          config: {
            baseUrl: process.env.EXTERNAL_API_BASE_URL,
            hasApiKey: !!process.env.API_KEY,
          },
        },
        { status: 503 },
      );
    }

    // Testar verificação de email
    console.log("🔍 Testando verificação de email...");
    const emailResult = await CheckServiceApi.checkEmail("teste@email.com");
    console.log("✅ Email Result:", emailResult);

    return NextResponse.json({
      success: true,
      message: "API externa funcionando corretamente",
      config: {
        baseUrl: process.env.EXTERNAL_API_BASE_URL,
        hasApiKey: !!process.env.API_KEY,
      },
      tests: {
        status: "✅ OK",
        email: emailResult,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao testar API externa:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao conectar com a API externa",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
