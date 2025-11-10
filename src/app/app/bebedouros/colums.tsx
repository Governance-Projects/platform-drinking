import { createColumnHelper } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { MapPin, FileText } from "lucide-react";
import { cn } from "~/lib/utils";

type Sink = RouterOutputs["sink"]["list"][number];

const columnHelper = createColumnHelper<Sink>();

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Ativo";
    case "INACTIVE":
      return "Inativo";
    case "MAINTANCE":
      return "Manutenção";
    default:
      return status;
  }
};

const getStatusVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "INACTIVE":
      return "destructive";
    case "MAINTANCE":
      return "outline";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "text-green-600 dark:text-green-400";
    case "INACTIVE":
      return "text-red-600 dark:text-red-400";
    case "MAINTANCE":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "";
  }
};

export const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    enableSorting: true,
  }),
  columnHelper.accessor("location", {
    header: "Localização",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <MapPin className="text-muted-foreground h-4 w-4" />
        <span className="text-sm">{info.getValue()}</span>
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    cell: (info) => {
      const description = info.getValue();
      const truncated =
        description.length > 60
          ? `${description.substring(0, 60)}...`
          : description;

      return (
        <div className="flex max-w-md items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-muted-foreground text-sm" title={description}>
            {truncated}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <Badge
          variant={getStatusVariant(status)}
          className={cn("font-medium", getStatusColor(status))}
        >
          {getStatusLabel(status)}
        </Badge>
      );
    },
    enableSorting: true,
  }),
  columnHelper.accessor("createdAt", {
    header: "Criado em",
    cell: (info) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(info.getValue())}
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Atualizado em",
    cell: (info) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(info.getValue())}
      </div>
    ),
    enableSorting: true,
  }),
];
