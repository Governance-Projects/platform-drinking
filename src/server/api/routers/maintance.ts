import { protectedProcedure } from "../trpc";
import { createMaintenanceValidator } from "~/utils/validators/maintenance/create-maintenance";

export const maintanceRouter = {
  create: protectedProcedure
    .input(createMaintenanceValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.sinkMaintance.create({
        data: {
          ...input,
        },
      });
    }),
};
