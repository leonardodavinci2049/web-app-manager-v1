import { type NextRequest, NextResponse } from "next/server";
import { CheckServiceApi } from "@/services/api/check/check-service-api";

export async function GET() {
  try {
    return NextResponse.json({
      message: "Check API está funcionando",
      status: "online",
      endpoints: {
        email: "/api/check/email",
        cpf: "/api/check/cpf",
        cnpj: "/api/check/cnpj",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro na API de check:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: "Check API está offline ou inacessível",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, term, TERM } = body;

    // Normalizar o termo - aceita tanto 'term' quanto 'TERM'
    const searchTerm = term || TERM;

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Parâmetro 'term' ou 'TERM' é obrigatório" },
        { status: 400 },
      );
    }

    let result: { isAvailable: boolean; recordId: number; message: string };

    switch (type) {
      case "email":
        result = await CheckServiceApi.checkEmail(searchTerm);
        break;
      case "cpf":
        result = await CheckServiceApi.checkCpf(searchTerm);
        break;
      case "cnpj":
        result = await CheckServiceApi.checkCnpj(searchTerm);
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de verificação inválido. Use: email, cpf ou cnpj" },
          { status: 400 },
        );
    }

    // Converter para formato compatível com a interface existente
    return NextResponse.json({
      success: true,
      exists: !result.isAvailable, // inverte a lógica: isAvailable true = exists false
      message: result.message,
      recordId: result.recordId,
      statusCode: 100200,
    });
  } catch (error) {
    console.error("Erro ao processar verificação:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        statusCode: 100400,
      },
      { status: 400 },
    );
  }
}
