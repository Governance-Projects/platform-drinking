import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createSinkValidator } from "~/utils/validators/sink/create-sink";

export const sinkRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSinkValidator)
    .mutation(async ({ ctx, input }) => {
      const sink = await ctx.db.sink.create({
        data: input,
      });

      return sink;
    }),
});
