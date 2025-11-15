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

  services: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.sinkMaintanceService.findMany();

    return services;
  }),
};
