import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Schema Zod para StatusBebedouro
const StatusBebedouroSchema = z.enum(["ATIVO", "INATIVO", "MANUTENCAO"]);

// Schema para criar bebedouro
const CreateBebedouroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  localizacao: z
    .string()
    .min(1, "Localização é obrigatória")
    .max(255, "Localização muito longa"),
  descricao: z.string().optional(),
  status: StatusBebedouroSchema.default("ATIVO"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Schema para atualizar bebedouro
const UpdateBebedouroSchema = CreateBebedouroSchema.partial().extend({
  id: z.string().cuid(),
});

// Schema para buscar bebedouro por ID
const GetBebedouroByIdSchema = z.object({
  id: z.string().cuid(),
});

// Schema para listar bebedouros com filtros
const ListBebedourosSchema = z.object({
  status: StatusBebedouroSchema.optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

// Schema de resposta do bebedouro
const BebedouroResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  localizacao: z.string(),
  descricao: z.string().nullable(),
  status: StatusBebedouroSchema,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema de resposta da lista
const ListBebedourosResponseSchema = z.object({
  bebedouros: z.array(BebedouroResponseSchema),
  total: z.number(),
  hasMore: z.boolean(),
});

export const bebedouroRouter = createTRPCRouter({
  // Listar todos os bebedouros (público)
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/bebedouros",
        tags: ["Bebedouros"],
        summary: "Listar bebedouros",
        description:
          "Retorna uma lista paginada de bebedouros com filtros opcionais",
      },
    })
    .input(ListBebedourosSchema)
    .output(ListBebedourosResponseSchema)
    .query(async ({ ctx, input }) => {
      const { status, search, limit, offset } = input;

      const where = {
        ...(status && { status }),
        ...(search && {
          OR: [
            { nome: { contains: search, mode: "insensitive" as const } },
            { localizacao: { contains: search, mode: "insensitive" as const } },
            { descricao: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [bebedouros, total] = await Promise.all([
        ctx.db.bebedouro.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        ctx.db.bebedouro.count({ where }),
      ]);

      return {
        bebedouros,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Buscar bebedouro por ID (público)
  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/bebedouros/{id}",
        tags: ["Bebedouros"],
        summary: "Buscar bebedouro por ID",
        description: "Retorna os detalhes de um bebedouro específico",
      },
    })
    .input(GetBebedouroByIdSchema)
    .output(BebedouroResponseSchema.nullable())
    .query(async ({ ctx, input }) => {
      const bebedouro = await ctx.db.bebedouro.findUnique({
        where: { id: input.id },
});

      return bebedouro;
    }),

  // Criar bebedouro (protegido)
  create: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/bebedouros",
        tags: ["Bebedouros"],
        summary: "Criar novo bebedouro",
        description: "Cria um novo bebedouro no sistema",
        protect: true,
      },
    })
    .input(CreateBebedouroSchema)
    .output(BebedouroResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const bebedouro = await ctx.db.bebedouro.create({
        data: input,
      });

      return bebedouro;
    }),

  // Atualizar bebedouro (protegido)
  update: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/bebedouros/{id}",
        tags: ["Bebedouros"],
        summary: "Atualizar bebedouro",
        description: "Atualiza os dados de um bebedouro existente",
        protect: true,
      },
    })
    .input(UpdateBebedouroSchema)
    .output(BebedouroResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verificar se o bebedouro existe e se o usuário tem permissão
      const existingBebedouro = await ctx.db.bebedouro.findUnique({
        where: { id },
      });

      if (!existingBebedouro) {
        throw new Error("Bebedouro não encontrado");
      }

      const bebedouro = await ctx.db.bebedouro.update({
        where: { id },
        data,
      });

      return bebedouro;
    }),

  // Deletar bebedouro (protegido)
  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/bebedouros/{id}",
        tags: ["Bebedouros"],
        summary: "Deletar bebedouro",
        description: "Remove um bebedouro do sistema",
        protect: true,
      },
    })
    .input(GetBebedouroByIdSchema)
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verificar se o bebedouro existe e se o usuário tem permissão
      const existingBebedouro = await ctx.db.bebedouro.findUnique({
        where: { id: input.id },
      });

      if (!existingBebedouro) {
        throw new Error("Bebedouro não encontrado");
      }

      await ctx.db.bebedouro.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Bebedouro deletado com sucesso",
      };
    }),

  // Estatísticas dos bebedouros (público)
  stats: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/bebedouros/stats",
        tags: ["Bebedouros"],
        summary: "Estatísticas dos bebedouros",
        description: "Retorna estatísticas gerais dos bebedouros",
      },
    })
    .input(z.object({}))
    .output(
      z.object({
        total: z.number(),
        ativos: z.number(),
        inativos: z.number(),
        manutencao: z.number(),
        criadosUltimos30Dias: z.number(),
      }),
    )
    .query(async ({ ctx }) => {
      const [total, ativos, inativos, manutencao, criadosUltimos30Dias] =
        await Promise.all([
          ctx.db.bebedouro.count(),
          ctx.db.bebedouro.count({ where: { status: "ATIVO" } }),
          ctx.db.bebedouro.count({ where: { status: "INATIVO" } }),
          ctx.db.bebedouro.count({ where: { status: "MANUTENCAO" } }),
          ctx.db.bebedouro.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          }),
        ]);

      return {
        total,
        ativos,
        inativos,
        manutencao,
        criadosUltimos30Dias,
      };
    }),
});
