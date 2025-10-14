import { type NextRequest, NextResponse } from "next/server";
import checkService from "@/services/db-mysql2/check/check.service";

export async function GET() {
  try {
    return NextResponse.json({
      message: "Check API está funcionando",
      endpoints: {
        email: "/api/check/email",
        cpf: "/api/check/cpf",
        cnpj: "/api/check/cnpj",
      },
    });
  } catch (error) {
    console.error("Erro na API de check:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case "email":
        result = await checkService.tskCheckIfEmailExist(data);
        break;
      case "cpf":
        result = await checkService.tskCheckIfCpfExist(data);
        break;
      case "cnpj":
        result = await checkService.tskCheckIfCnpjExist(data);
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de verificação inválido. Use: email, cpf ou cnpj" },
          { status: 400 },
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao processar verificação:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
