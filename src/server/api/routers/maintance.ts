import { protectedProcedure } from "../trpc";
import { createMaintenanceValidator } from "~/utils/validators/maintenance/create-maintenance";
import { z } from "zod";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";

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

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(MaintenanceStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Converter MaintenanceStatus para SinkMaintanceStatus do Prisma
      const prismaStatus =
        input.status === MaintenanceStatus.COMPLETED
          ? "CONCLUDED"
          : input.status === MaintenanceStatus.IN_PROGRESS
            ? "IN_PROGRESS"
            : "PENDING";

      await ctx.db.sinkMaintance.update({
        where: { id: input.id },
        data: {
          status: prismaStatus,
          updatedAt: new Date(),
        },
      });
    }),

  services: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.sinkMaintanceService.findMany();

    return services;
  }),
};
