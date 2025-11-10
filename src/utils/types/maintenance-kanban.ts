export enum MaintenanceStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface MaintenanceCard {
  id: string;
  sinkId: string;
  sinkName: string;
  location: string;
  responsableId: string;
  responsableName: string;
  observations: string;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: MaintenanceStatus;
  title: string;
  cards: MaintenanceCard[];
}

export type KanbanColumns = Record<MaintenanceStatus, MaintenanceCard[]>;

