import { type NextRequest, NextResponse } from "next/server";
import checkService from "@/services/db-mysql2/check/check.service";

interface CheckResultData {
  ID_CHECK: number;
  ID_RECORD: number;
}

interface FeedbackData {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica - apenas TERM é necessário do cliente
    if (!body.TERM) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios faltando",
          required: ["TERM"],
        },
        { status: 400 },
      );
    }

    // Carregar valores das variáveis de ambiente
    const requestData = {
      USER_ID: 1,
      TERM: body.TERM,
    };

    const result = await checkService.tskCheckIfEmailExist(requestData);

    // Processar o resultado do serviço
    try {
      const data = result.data as [CheckResultData[], FeedbackData[], unknown];
      const idCheck = data[0][0]?.ID_CHECK;
      const feedback = data[1][0]?.sp_message;

      // ID_CHECK = 1 significa que o term existe
      const exists = idCheck === 1;

      return NextResponse.json({
        success: true,
        exists: exists,
        message:
          feedback ||
          (exists
            ? "Email encontrado na base de dados"
            : "Email não encontrado na base de dados"),
        statusCode: result.statusCode,
      });
    } catch (processingError) {
      console.error("Erro ao processar resultado:", processingError);
      return NextResponse.json({
        success: false,
        message: "Erro ao processar resultado da verificação",
        rawResult: result,
      });
    }
  } catch (error) {
    console.error("Erro ao verificar email:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
