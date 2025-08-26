// Função para gerar documento OpenAPI manualmente
// Isso contorna problemas de compatibilidade com trpc-openapi v1.2.0 e tRPC v11
export function generateManualOpenApiDocument() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Drinking API",
      description:
        "API para gerenciamento de bebedouros - Sistema de controle e monitoramento de bebedouros",
      version: "1.0.0",
      contact: {
        name: "Equipe de Desenvolvimento",
        email: "dev@drinking-app.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://drinking-app.vercel.app/api"
            : "http://localhost:3001/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Produção"
            : "Desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Bebedouros",
        description: "Operações relacionadas ao gerenciamento de bebedouros",
      },
      {
        name: "Posts",
        description: "Operações relacionadas aos posts (exemplo do T3 Stack)",
      },
    ],
    paths: {
      "/bebedouros": {
        get: {
          tags: ["Bebedouros"],
          summary: "Listar bebedouros",
          description:
            "Retorna uma lista paginada de bebedouros com filtros opcionais",
          parameters: [
            {
              name: "status",
              in: "query",
              description: "Filtrar por status",
              required: false,
              schema: {
                type: "string",
                enum: ["ATIVO", "INATIVO", "MANUTENCAO"],
              },
            },
            {
              name: "search",
              in: "query",
              description: "Busca textual (nome, localização, descrição)",
              required: false,
              schema: {
                type: "string",
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Limite de resultados (1-100)",
              required: false,
              schema: {
                type: "number",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
            },
            {
              name: "offset",
              in: "query",
              description: "Deslocamento para paginação",
              required: false,
              schema: {
                type: "number",
                minimum: 0,
                default: 0,
              },
            },
          ],
          responses: {
            "200": {
              description: "Lista de bebedouros",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ListBebedourosResponse",
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Bebedouros"],
          summary: "Criar novo bebedouro",
          description: "Cria um novo bebedouro no sistema",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateBebedouroRequest",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Bebedouro criado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Bebedouro",
                  },
                },
              },
            },
            "400": {
              description: "Erro de validação",
            },
            "401": {
              description: "Não autorizado",
            },
          },
        },
      },
      "/bebedouros/{id}": {
        get: {
          tags: ["Bebedouros"],
          summary: "Buscar bebedouro por ID",
          description: "Retorna os detalhes de um bebedouro específico",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Detalhes do bebedouro",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Bebedouro",
                  },
                },
              },
            },
            "404": {
              description: "Bebedouro não encontrado",
            },
          },
        },
        put: {
          tags: ["Bebedouros"],
          summary: "Atualizar bebedouro",
          description: "Atualiza os dados de um bebedouro existente",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateBebedouroRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Bebedouro atualizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Bebedouro",
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado",
            },
            "403": {
              description: "Sem permissão",
            },
            "404": {
              description: "Bebedouro não encontrado",
            },
          },
        },
        delete: {
          tags: ["Bebedouros"],
          summary: "Deletar bebedouro",
          description: "Remove um bebedouro do sistema",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Bebedouro deletado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Não autorizado",
            },
            "403": {
              description: "Sem permissão",
            },
            "404": {
              description: "Bebedouro não encontrado",
            },
          },
        },
      },
      "/bebedouros/stats": {
        get: {
          tags: ["Bebedouros"],
          summary: "Estatísticas dos bebedouros",
          description: "Retorna estatísticas gerais dos bebedouros",
          responses: {
            "200": {
              description: "Estatísticas dos bebedouros",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/BebedourosStats",
                  },
                },
              },
            },
          },
        },
      },
      "/posts/hello": {
        get: {
          tags: ["Posts"],
          summary: "Saudação personalizada",
          description:
            "Retorna uma saudação personalizada com o texto fornecido",
          parameters: [
            {
              name: "text",
              in: "query",
              required: true,
              schema: {
                type: "string",
                minLength: 1,
                maxLength: 100,
              },
            },
          ],
          responses: {
            "200": {
              description: "Saudação personalizada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      greeting: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Token de autenticação JWT obtido através do NextAuth.js",
        },
      },
      schemas: {
        Bebedouro: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            localizacao: { type: "string" },
            descricao: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "MANUTENCAO"],
            },
            latitude: { type: "number", nullable: true },
            longitude: { type: "number", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            createdBy: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string", nullable: true },
                email: { type: "string", nullable: true },
              },
            },
          },
        },
        CreateBebedouroRequest: {
          type: "object",
          required: ["nome", "localizacao"],
          properties: {
            nome: { type: "string", minLength: 1, maxLength: 255 },
            localizacao: { type: "string", minLength: 1, maxLength: 255 },
            descricao: { type: "string" },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "MANUTENCAO"],
              default: "ATIVO",
            },
            latitude: { type: "number", minimum: -90, maximum: 90 },
            longitude: { type: "number", minimum: -180, maximum: 180 },
          },
        },
        UpdateBebedouroRequest: {
          type: "object",
          properties: {
            nome: { type: "string", minLength: 1, maxLength: 255 },
            localizacao: { type: "string", minLength: 1, maxLength: 255 },
            descricao: { type: "string" },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "MANUTENCAO"],
            },
            latitude: { type: "number", minimum: -90, maximum: 90 },
            longitude: { type: "number", minimum: -180, maximum: 180 },
          },
        },
        ListBebedourosResponse: {
          type: "object",
          properties: {
            bebedouros: {
              type: "array",
              items: { $ref: "#/components/schemas/Bebedouro" },
            },
            total: { type: "number" },
            hasMore: { type: "boolean" },
          },
        },
        BebedourosStats: {
          type: "object",
          properties: {
            total: { type: "number" },
            ativos: { type: "number" },
            inativos: { type: "number" },
            manutencao: { type: "number" },
            criadosUltimos30Dias: { type: "number" },
          },
        },
      },
    },
  };
}

// Função para gerar documento OpenAPI customizado
export function generateCustomOpenApiDocument() {
  return generateManualOpenApiDocument();
}
