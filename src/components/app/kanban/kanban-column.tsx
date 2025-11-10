"use client";

import { useRef, useState, useEffect } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { KanbanCard } from "./kanban-card";
import type { MaintenanceCard } from "~/utils/types/maintenance-kanban";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";

interface KanbanColumnProps {
  status: MaintenanceStatus;
  title: string;
  cards: MaintenanceCard[];
  color: string;
}

const getStatusLabel = (status: MaintenanceStatus): string => {
  switch (status) {
    case MaintenanceStatus.PENDING:
      return "Pendente";
    case MaintenanceStatus.IN_PROGRESS:
      return "Em Andamento";
    case MaintenanceStatus.COMPLETED:
      return "Concluído";
    default:
      return status;
  }
};

export function KanbanColumn({
  status,
  title,
  cards,
  color,
}: KanbanColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: () => ({
        type: "column",
        status: status,
      }),
      canDrop: ({ source }) => {
        return source.data.type === "maintenance-card";
      },
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [status]);

  return (
    <div className="flex h-full max-w-[350px] min-w-[300px] flex-col">
      {/* Header da coluna */}
      <div
        className="sticky top-0 z-10 mb-4 rounded-t-lg px-4 py-3"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {title || getStatusLabel(status)}
          </h2>
          <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Área droppable */}
      <div
        ref={ref}
        className={`min-h-[500px] flex-1 rounded-b-lg px-2 pb-4 transition-colors ${
          isDraggedOver
            ? "bg-primary/5 border-primary border-2 border-dashed"
            : "bg-muted/30"
        }`}
      >
        <div className="space-y-2">
          {cards.map((card, index) => (
            <KanbanCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
