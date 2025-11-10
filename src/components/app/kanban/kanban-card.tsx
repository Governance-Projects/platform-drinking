"use client";

import { useRef, useState, useEffect } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { MapPin, User, Calendar } from "lucide-react";
import type { MaintenanceCard } from "~/utils/types/maintenance-kanban";
import { Card } from "~/components/ui/card";

interface KanbanCardProps {
  card: MaintenanceCard;
  index: number;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export function KanbanCard({ card, index }: KanbanCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return draggable({
      element,
      getInitialData: () => ({
        type: "maintenance-card",
        cardId: card.id,
        status: card.status,
        index,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [card.id, card.status, index]);

  return (
    <Card
      ref={ref}
      className={`mb-3 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "shadow-lg ring-2 ring-primary opacity-50" : ""
      }`}
    >
      <div className="p-4 space-y-3">
        {/* Header com nome do bebedouro */}
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-1">
            {card.sinkName}
          </h3>
        </div>

        {/* Localização */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{card.location}</span>
        </div>

        {/* Responsável */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{card.responsableName}</span>
        </div>

        {/* Observações */}
        {card.observations && (
          <div className="text-xs text-muted-foreground">
            <p className="line-clamp-2">{card.observations}</p>
          </div>
        )}

        {/* Datas */}
        <div className="flex flex-col gap-1 pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Criado: {formatDate(card.createdAt)}</span>
          </div>
          {card.updatedAt.getTime() !== card.createdAt.getTime() && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>Atualizado: {formatDate(card.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
