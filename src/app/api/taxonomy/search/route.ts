import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import type { FindTaxonomyRequest } from "@/services/api/taxonomy/types/taxonomy-types";

/**
 * API Route para buscar taxonomias
 * Alternativa às Server Actions para chamadas via fetch
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🌐 [API Route] Recebendo requisição de busca:", body);

    // Validação básica dos parâmetros
    const params: Partial<FindTaxonomyRequest> = {
      pe_id_parent: body.pe_id_parent ? Number(body.pe_id_parent) : undefined,
      pe_id_taxonomy: body.pe_id_taxonomy
        ? Number(body.pe_id_taxonomy)
        : undefined,
      pe_taxonomia: body.pe_taxonomia || undefined,
      pe_flag_inativo: body.pe_flag_inativo
        ? Number(body.pe_flag_inativo)
        : undefined,
      pe_qt_registros: body.pe_qt_registros
        ? Number(body.pe_qt_registros)
        : undefined,
      pe_pagina_id: body.pe_pagina_id ? Number(body.pe_pagina_id) : undefined,
      pe_coluna_id: body.pe_coluna_id ? Number(body.pe_coluna_id) : undefined,
      pe_ordem_id: body.pe_ordem_id ? Number(body.pe_ordem_id) : undefined,
    };

    // Chama o serviço
    const response = await TaxonomyServiceApi.findTaxonomies(params);
    const taxonomyList = TaxonomyServiceApi.extractTaxonomyList(response);

    // Calcula informações adicionais
    const qtdRegistros = params.pe_qt_registros || 20;
    const totalPages = Math.ceil((response.quantity || 0) / qtdRegistros);

    console.log("✅ [API Route] Resposta processada:", {
      statusCode: response.statusCode,
      quantity: response.quantity,
      taxonomiesCount: taxonomyList.length,
    });

    return NextResponse.json({
      success: true,
      data: taxonomyList,
      responseInfo: {
        statusCode: response.statusCode,
        message: response.message,
        quantity: response.quantity || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error("❌ [API Route] Erro na busca de taxonomias:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido no servidor",
      },
      { status: 500 },
    );
  }
}

/**
 * GET - Teste de conectividade
 */
export async function GET() {
  try {
    const response = await TaxonomyServiceApi.findTaxonomies({
      pe_qt_registros: 1,
      pe_pagina_id: 0,
    });

    return NextResponse.json({
      success: true,
      message: `API de taxonomias funcionando. Status: ${response.statusCode}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Erro na API: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
