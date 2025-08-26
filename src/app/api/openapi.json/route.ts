import { NextResponse } from "next/server";
import { generateCustomOpenApiDocument } from "~/server/api/openapi";

export async function GET() {
  try {
    const openApiDocument = generateCustomOpenApiDocument();

    return NextResponse.json(openApiDocument, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar documento OpenAPI:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor ao gerar documentação" },
      { status: 500 },
    );
  }
}
