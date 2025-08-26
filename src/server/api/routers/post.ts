import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/hello",
        tags: ["Posts"],
        summary: "Saudação personalizada",
        description: "Retorna uma saudação personalizada com o texto fornecido",
      },
    })
    .input(
      z.object({
        text: z
          .string()
          .min(1, "Texto é obrigatório")
          .max(100, "Texto muito longo"),
      }),
    )
    .output(
      z.object({
        greeting: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/posts",
        tags: ["Posts"],
        summary: "Criar novo post",
        description: "Cria um novo post no sistema",
        protect: true,
      },
    })
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Nome é obrigatório")
          .max(255, "Nome muito longo"),
      }),
    )
    .output(
      z.object({
        id: z.number(),
        name: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        createdById: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/latest",
        tags: ["Posts"],
        summary: "Buscar último post",
        description: "Retorna o post mais recente do usuário autenticado",
        protect: true,
      },
    })
    .input(z.object({}))
    .output(
      z
        .object({
          id: z.number(),
          name: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          createdById: z.string(),
        })
        .nullable(),
    )
    .query(async ({ ctx }) => {
      const post = await ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: ctx.session.user.id } },
      });

      return post ?? null;
    }),

  getSecretMessage: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/posts/secret",
        tags: ["Posts"],
        summary: "Mensagem secreta",
        description:
          "Retorna uma mensagem secreta apenas para usuários autenticados",
        protect: true,
      },
    })
    .input(z.object({}))
    .output(
      z.object({
        message: z.string(),
      }),
    )
    .query(() => {
      return {
        message: "you can now see this secret message!",
      };
    }),
});
