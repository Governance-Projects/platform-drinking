import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createSinkValidator } from "~/utils/validators/sink/create-sink";
import { createFeedbackValidator } from "~/utils/validators/sink/create-feedback";

export const sinkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSinkValidator)
    .mutation(async ({ ctx, input }) => {
      const sink = await ctx.db.sink.create({
        data: { ...input, status: "ACTIVE" },
      });

      return sink;
    }),

  list: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const sinks = await ctx.db.sink.findMany();

      const activies = await ctx.db.sink.count({
        where: {
          status: "ACTIVE",
        },
      });

      const inactivies = await ctx.db.sink.count({
        where: {
          status: "INACTIVE",
        },
      });

      const inMaintance = await ctx.db.sink.count({
        where: {
          status: "MAINTANCE",
        },
      });

      return {
        table: sinks,
        activies,
        inactivies,
        inMaintance,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const sink = await ctx.db.sink.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          location: true,
          description: true,
          status: true,
          createdAt: true,
        },
      });

      if (!sink) {
        throw new Error("Bebedouro não encontrado");
      }

      return sink;
    }),

  createFeedback: publicProcedure
    .input(createFeedbackValidator)
    .mutation(async ({ ctx, input }) => {
      // Verificar se o bebedouro existe
      const sink = await ctx.db.sink.findUnique({
        where: { id: input.sinkId },
      });

      if (!sink) {
        throw new Error("Bebedouro não encontrado");
      }

      // Criar o feedback
      const feedback = await ctx.db.sinkFeedback.create({
        data: {
          sinkId: input.sinkId,
          type: input.type,
          message: input.message,
          rating: input.rating,
          name: input.name ?? null,
          email: input.email ?? null,
        },
      });

      return feedback;
    }),
});
