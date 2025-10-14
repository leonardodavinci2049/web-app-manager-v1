import { type NextRequest, NextResponse } from "next/server";
import genericService from "@/services/db-mysql2/generic/generic.service";
import type { GenericProcedureResponse } from "@/services/db-mysql2/generic/types/generic.types";

/**
 * API route para testar procedures genéricas
 * POST /api/test-procedure
 *
 * Body: {
 *   "procedure": "CALL sp_test(1, 2, 'param')",
 *   "type": "generic" | "data" | "modify" (opcional, padrão: generic)
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { procedure, type = "generic" } = body;

    // Validação básica
    if (!procedure || typeof procedure !== "string") {
      return NextResponse.json(
        {
          error: "Parâmetro 'procedure' é obrigatório e deve ser uma string",
          example: {
            procedure:
              "CALL sp_check_if_cpf_exists_V2(1, 1, 1, 29014, UNIX_TIMESTAMP())",
            type: "generic",
          },
        },
        { status: 400 },
      );
    }

    // Validação de segurança básica
    const procedureUpper = procedure.toUpperCase().trim();
    if (!procedureUpper.startsWith("CALL ")) {
      return NextResponse.json(
        {
          error:
            "Apenas chamadas de procedures são permitidas (deve começar com 'CALL ')",
          received: procedure,
        },
        { status: 400 },
      );
    }

    // Executar procedure baseado no tipo
    let response: GenericProcedureResponse<unknown>;

    switch (type) {
      case "data":
        response = await genericService.executeDataProcedure(procedure);
        break;
      case "modify":
        response = await genericService.executeModifyProcedure(procedure);
        break;
      default:
        response = await genericService.executeGenericProcedure(procedure);
        break;
    }

    // Retornar resposta formatada
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      procedure: procedure.trim(),
      type,
      result: response,
      // Incluir versão legível para debug
      formattedResult: genericService.formatResponseForDisplay(response),
    });
  } catch (error) {
    console.error("Erro na API test-procedure:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// GET para documentação da API
export async function GET() {
  return NextResponse.json({
    title: "API de Teste de Procedures Genéricas",
    description: "Permite testar qualquer procedure MariaDB/MySQL via HTTP",
    usage: {
      method: "POST",
      endpoint: "/api/test-procedure",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        procedure: "string (obrigatório) - Ex: 'CALL sp_test(1, 2)'",
        type: "string (opcional) - 'generic' | 'data' | 'modify' (padrão: generic)",
      },
    },
    examples: [
      {
        title: "Procedure com feedback estruturado",
        request: {
          procedure:
            "CALL sp_check_if_cpf_exists_V2(1, 1, 1, 29014, UNIX_TIMESTAMP())",
          type: "generic",
        },
      },
      {
        title: "Procedure simples (apenas dados)",
        request: {
          procedure: "CALL sp_get_all_users()",
          type: "data",
        },
      },
      {
        title: "Procedure de modificação",
        request: {
          procedure: "CALL sp_update_user_status(123, 'active')",
          type: "modify",
        },
      },
    ],
    types: {
      generic:
        "Para procedures que retornam múltiplos resultsets (dados + feedback)",
      data: "Para procedures que retornam apenas dados (melhor performance)",
      modify: "Para procedures de INSERT/UPDATE/DELETE",
    },
    security: {
      note: "Esta API aceita apenas comandos CALL para procedures por segurança",
      blocked: [
        "SELECT",
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "CREATE",
        "ALTER",
      ],
    },
  });
}
