"use client";

import { useState, useCallback, useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";
import type {
  MaintenanceCard,
  KanbanColumns,
} from "~/utils/types/maintenance-kanban";
import { KanbanColumn } from "./kanban-column";
import { CreateMaintenanceDialog } from "./create-maintenance-dialog";
import { api } from "~/trpc/react";

const columnColors = {
  [MaintenanceStatus.PENDING]: "#f59e0b", // amber-500
  [MaintenanceStatus.IN_PROGRESS]: "#3b82f6", // blue-500
  [MaintenanceStatus.COMPLETED]: "#10b981", // emerald-500
};

const columnTitles = {
  [MaintenanceStatus.PENDING]: "Pendente",
  [MaintenanceStatus.IN_PROGRESS]: "Em Andamento",
  [MaintenanceStatus.COMPLETED]: "Concluído",
};

const getInitialKanbanColumns = (): KanbanColumns => ({
  [MaintenanceStatus.PENDING]: [],
  [MaintenanceStatus.IN_PROGRESS]: [],
  [MaintenanceStatus.COMPLETED]: [],
});

export function MaintenanceKanban() {
  const sinksMaintanceQuery = api.operation.list.useQuery();

  const [columns, setColumns] = useState<KanbanColumns>(
    getInitialKanbanColumns,
  );

  useEffect(() => {
    if (sinksMaintanceQuery.data) {
      setColumns(sinksMaintanceQuery.data);
    }
  }, [sinksMaintanceQuery.data]);

  useEffect(() => {
    return monitorForElements({
      onDragStart: () => {
        // Opcional: pode adicionar lógica quando o drag começa
      },
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceData = source.data;
        const destinationData = destination.data;

        // Verificar se é um card de manutenção sendo arrastado para uma coluna
        if (
          sourceData.type === "maintenance-card" &&
          destinationData.type === "column"
        ) {
          const cardId = sourceData.cardId as string;
          const sourceStatus = sourceData.status as MaintenanceStatus;
          const destinationStatus = destinationData.status as MaintenanceStatus;

          setColumns((prev) => {
            const sourceColumn = prev[sourceStatus];
            const destinationColumn = prev[destinationStatus];

            // Encontrar o card
            const card = sourceColumn.find((c) => c.id === cardId);
            if (!card) return prev;

            // Se moveu para a mesma coluna, apenas reordena (por enquanto adiciona no final)
            if (sourceStatus === destinationStatus) {
              // Remove da posição atual
              const newCards = sourceColumn.filter((c) => c.id !== cardId);
              // Adiciona no final (pode ser melhorado para calcular posição exata)
              return {
                ...prev,
                [sourceStatus]: [...newCards, card],
              };
            }

            // Se moveu para outra coluna, atualiza o status
            // Remover da coluna origem
            const newSourceCards = sourceColumn.filter((c) => c.id !== cardId);

            // Adicionar à coluna destino
            const updatedCard: MaintenanceCard = {
              ...card,
              status: destinationStatus,
              updatedAt: new Date(),
            };
            const newDestinationCards = [...destinationColumn, updatedCard];

            return {
              ...prev,
              [sourceStatus]: newSourceCards,
              [destinationStatus]: newDestinationCards,
            };
          });
        }
      },
    });
  }, []);

  const handleMaintenanceCreated = useCallback(
    (maintenance: MaintenanceCard) => {
      setColumns((prev) => ({
        ...prev,
        [maintenance.status]: [...prev[maintenance.status], maintenance],
      }));
    },
    [],
  );

  return (
    <div className="h-full w-full">
      {/* Header com botão de criar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Operação de Manutenções
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie as manutenções dos bebedouros arrastando os cards entre as
            colunas
          </p>
        </div>
        <CreateMaintenanceDialog
          onMaintenanceCreated={handleMaintenanceCreated}
        />
      </div>

      {/* Kanban Board */}
      <div className="flex min-h-[600px] justify-evenly gap-4 overflow-x-auto pb-4">
        {Object.values(MaintenanceStatus).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            title={columnTitles[status]}
            cards={columns[status]}
            color={columnColors[status]}
          />
        ))}
      </div>
    </div>
  );
}
