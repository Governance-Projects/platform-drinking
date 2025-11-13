import { protectedProcedure } from "../trpc";
import type { MaintenanceCard } from "~/utils/types/maintenance-kanban";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";

export const operationRouter = {
  list: protectedProcedure.query(
    async ({ ctx }): Promise<Record<MaintenanceStatus, MaintenanceCard[]>> => {
      const sinks = await ctx.db.sinkMaintance.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          responsableId: true,
          observations: true,
          responsable: {
            select: {
              name: true,
            },
          },
          sink: {
            select: {
              id: true,
              name: true,
              location: true,
              description: true,
            },
          },
        },
      });

      const mappedSinks: MaintenanceCard[] = sinks.map((item) => ({
        id: item.id,
        sinkId: item.sink.id,
        sinkName: item.sink.name,
        location: item.sink.location,
        responsableId: item.responsableId,
        responsableName: item.responsable.name,
        observations: item.observations ?? "",
        status: item.status as MaintenanceStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      const groupedByStatus = mappedSinks.reduce(
        (acc, card) => {
          if (!acc[card.status]) {
            acc[card.status] = [];
          }
          acc[card.status].push(card);
          return acc;
        },
        {} as Record<MaintenanceStatus, MaintenanceCard[]>,
      );

      const result: Record<MaintenanceStatus, MaintenanceCard[]> = {
        [MaintenanceStatus.PENDING]:
          groupedByStatus[MaintenanceStatus.PENDING] ?? [],
        [MaintenanceStatus.IN_PROGRESS]:
          groupedByStatus[MaintenanceStatus.IN_PROGRESS] ?? [],
        [MaintenanceStatus.COMPLETED]:
          groupedByStatus[MaintenanceStatus.COMPLETED] ?? [],
      };

      return result;
    },
  ),
};
