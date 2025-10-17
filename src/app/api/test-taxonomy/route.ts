import { NextResponse } from "next/server";
import { envs } from "@/core/config";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";

export async function GET() {
  try {
    console.log("🔍 [Test API] Testando configuração...");
    console.log("📦 [Test API] Variáveis:", {
      APP_ID: envs.APP_ID,
      SYSTEM_CLIENT_ID: envs.SYSTEM_CLIENT_ID,
      STORE_ID: envs.STORE_ID,
      ORGANIZATION_ID: envs.ORGANIZATION_ID,
      MEMBER_ID: envs.MEMBER_ID,
      hasApiKey: !!envs.API_KEY,
      apiKeyLength: envs.API_KEY?.length || 0,
    });

    const response = await TaxonomyServiceApi.findTaxonomies({
      pe_qt_registros: 5,
      pe_pagina_id: 0, // MySQL começa em 0
    });

    return NextResponse.json({
      success: true,
      envs: {
        APP_ID: envs.APP_ID,
        SYSTEM_CLIENT_ID: envs.SYSTEM_CLIENT_ID,
        STORE_ID: envs.STORE_ID,
        ORGANIZATION_ID: envs.ORGANIZATION_ID,
        MEMBER_ID: envs.MEMBER_ID,
        hasApiKey: !!envs.API_KEY,
      },
      response: {
        statusCode: response.statusCode,
        quantity: response.quantity,
        dataLength: response.data?.[0]?.length || 0,
        message: response.message,
      },
    });
  } catch (error) {
    console.error("❌ [Test API] Erro:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
