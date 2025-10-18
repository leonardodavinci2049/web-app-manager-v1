import { type NextRequest, NextResponse } from "next/server";
import { CheckServiceApi } from "@/services/api/check/check-service-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica - aceita tanto TERM quanto term
    const searchTerm = body.TERM || body.term;

    if (!searchTerm) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios faltando",
          required: ["TERM"],
        },
        { status: 400 },
      );
    }

    // Usar o novo serviço da API REST
    const result = await CheckServiceApi.checkCnpj(searchTerm);

    // Converter para formato compatível com a interface existente
    const exists = !result.isAvailable; // inverte a lógica

    return NextResponse.json({
      success: true,
      exists: exists,
      message: exists
        ? "CNPJ encontrado na base de dados"
        : "CNPJ não encontrado na base de dados",
      recordId: result.recordId,
      statusCode: 100200,
    });
  } catch (error) {
    console.error("Erro ao verificar CNPJ:", error);

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
