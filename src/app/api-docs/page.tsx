"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { ExternalLink, FileText, Loader2 } from "lucide-react";

// Importação dinâmica do SwaggerUI para evitar problemas de SSR
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Carregando documentação...</span>
    </div>
  ),
}) as any;

// CSS do Swagger UI será importado dinamicamente
let swaggerUiCssLoaded = false;

export default function ApiDocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const swaggerConfig = {
    url: "/api/openapi.json",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando documentação...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl">
          <Alert className="mt-8">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              {error}. Tente recarregar a página.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl p-4">
        {/* Header */}
        <div className="mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    📖 Documentação da API
                  </CardTitle>
                  <CardDescription className="mt-2 text-lg">
                    Drinking API - Sistema de Gerenciamento de Bebedouros
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a
                      href="/api/openapi.json"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      JSON Schema
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="/usuario"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ir para App
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    🚀 Versão
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">v1.0.0</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    🛠️ Tecnologias
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    tRPC + OpenAPI + Zod
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    🔐 Autenticação
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    NextAuth.js (JWT)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações importantes */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Endpoints Públicos:</strong> Listagem e visualização de
              bebedouros não requerem autenticação.
            </AlertDescription>
          </Alert>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Endpoints Protegidos:</strong> Criação, edição e exclusão
              requerem autenticação JWT.
            </AlertDescription>
          </Alert>
        </div>

        {/* Swagger UI */}
        <Card className="shadow-xl">
          <CardContent className="p-0">
            <div
              id="swagger-ui"
              className="swagger-ui-container"
              style={
                {
                  // Estilos personalizados para integrar com o tema
                  "--swagger-ui-border-radius": "8px",
                  "--swagger-ui-font-family": "var(--font-sans)",
                } as React.CSSProperties
              }
            >
              <SwaggerUI {...swaggerConfig} />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Documentação gerada automaticamente via tRPC + OpenAPI
          </p>
        </div>
      </div>

      {/* Estilos customizados para o Swagger UI */}
      <style jsx global>{`
        .swagger-ui-container {
          font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .info {
          margin: 20px 0;
        }

        .swagger-ui .scheme-container {
          background: transparent;
          box-shadow: none;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .swagger-ui .opblock.opblock-get {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .swagger-ui .opblock.opblock-post {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        @media (prefers-color-scheme: dark) {
          .swagger-ui {
            filter: invert(1) hue-rotate(180deg);
          }

          .swagger-ui .opblock.opblock-get,
          .swagger-ui .opblock.opblock-post,
          .swagger-ui .opblock.opblock-put,
          .swagger-ui .opblock.opblock-delete {
            filter: invert(1) hue-rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
