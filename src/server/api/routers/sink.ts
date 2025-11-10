import z from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createSinkValidator } from "~/utils/validators/sink/create-sink";

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

      return sinks;
    }),
});
