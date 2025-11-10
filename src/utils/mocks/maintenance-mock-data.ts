import type { MaintenanceCard, KanbanColumns } from "~/utils/types/maintenance-kanban";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";

// Mock de bebedouros
const mockSinks = [
  { id: "sink-1", name: "Bebedouro Bloco A", location: "Bloco A - Térreo" },
  { id: "sink-2", name: "Bebedouro Bloco B", location: "Bloco B - 1º Andar" },
  { id: "sink-3", name: "Bebedouro Bloco C", location: "Bloco C - 2º Andar" },
  { id: "sink-4", name: "Bebedouro Biblioteca", location: "Biblioteca - Térreo" },
  { id: "sink-5", name: "Bebedouro Refeitório", location: "Refeitório - Térreo" },
];

// Mock de responsáveis
const mockResponsables = [
  { id: "user-1", name: "João Silva" },
  { id: "user-2", name: "Maria Santos" },
  { id: "user-3", name: "Pedro Oliveira" },
  { id: "user-4", name: "Ana Costa" },
];

// Função auxiliar para gerar IDs únicos
const generateId = () => `maint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Função auxiliar para gerar datas
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Dados mockados de manutenções
export const mockMaintenanceCards: MaintenanceCard[] = [
  {
    id: generateId(),
    sinkId: mockSinks[0]!.id,
    sinkName: mockSinks[0]!.name,
    location: mockSinks[0]!.location,
    responsableId: mockResponsables[0]!.id,
    responsableName: mockResponsables[0]!.name,
    observations: "Vazamento no filtro de água. Necessário trocar o filtro e verificar conexões.",
    status: MaintenanceStatus.PENDING,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: generateId(),
    sinkId: mockSinks[1]!.id,
    sinkName: mockSinks[1]!.name,
    location: mockSinks[1]!.location,
    responsableId: mockResponsables[1]!.id,
    responsableName: mockResponsables[1]!.name,
    observations: "Pressão da água baixa. Verificar válvula de pressão.",
    status: MaintenanceStatus.PENDING,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: generateId(),
    sinkId: mockSinks[2]!.id,
    sinkName: mockSinks[2]!.name,
    location: mockSinks[2]!.location,
    responsableId: mockResponsables[2]!.id,
    responsableName: mockResponsables[2]!.name,
    observations: "Manutenção preventiva trimestral. Limpeza completa e troca de filtros.",
    status: MaintenanceStatus.IN_PROGRESS,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(0),
  },
  {
    id: generateId(),
    sinkId: mockSinks[3]!.id,
    sinkName: mockSinks[3]!.name,
    location: mockSinks[3]!.location,
    responsableId: mockResponsables[0]!.id,
    responsableName: mockResponsables[0]!.name,
    observations: "Display não está funcionando. Substituir painel de controle.",
    status: MaintenanceStatus.IN_PROGRESS,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: generateId(),
    sinkId: mockSinks[4]!.id,
    sinkName: mockSinks[4]!.name,
    location: mockSinks[4]!.location,
    responsableId: mockResponsables[3]!.id,
    responsableName: mockResponsables[3]!.name,
    observations: "Manutenção preventiva realizada com sucesso. Todos os componentes verificados.",
    status: MaintenanceStatus.COMPLETED,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },
  {
    id: generateId(),
    sinkId: mockSinks[0]!.id,
    sinkName: mockSinks[0]!.name,
    location: mockSinks[0]!.location,
    responsableId: mockResponsables[2]!.id,
    responsableName: mockResponsables[2]!.name,
    observations: "Troca de filtro concluída. Sistema funcionando normalmente.",
    status: MaintenanceStatus.COMPLETED,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
  },
];

// Função para organizar manutenções por status
export const getInitialKanbanColumns = (): KanbanColumns => {
  const columns: KanbanColumns = {
    [MaintenanceStatus.PENDING]: [],
    [MaintenanceStatus.IN_PROGRESS]: [],
    [MaintenanceStatus.COMPLETED]: [],
  };

  mockMaintenanceCards.forEach((card) => {
    columns[card.status].push(card);
  });

  return columns;
};

// Exportar dados auxiliares para uso no formulário
export const mockSinksList = mockSinks;
export const mockResponsablesList = mockResponsables;

