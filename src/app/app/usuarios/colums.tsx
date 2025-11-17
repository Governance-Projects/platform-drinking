import { createColumnHelper } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Mail, MoreVertical, UserCircle, Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

type User = RouterOutputs["user"]["listOperationalUsers"]["table"][number];

const columnHelper = createColumnHelper<User>();

type ColumnsProps = undefined;

const formatDate = (date: Date | string | null) => {
  if (!date) return "Nunca";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const createColumns = (props: ColumnsProps) => [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <UserCircle className="text-muted-foreground h-4 w-4" />
        <span className="font-medium">{info.getValue()}</span>
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Mail className="text-muted-foreground h-4 w-4" />
        <span className="text-sm">{info.getValue()}</span>
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("emailVerified", {
    header: "Email Verificado",
    cell: (info) => {
      const verified = info.getValue();
      return (
        <Badge
          variant={verified ? "secondary" : "outline"}
          className={cn(
            "font-medium",
            verified
              ? "text-green-600 dark:text-green-400"
              : "text-yellow-600 dark:text-yellow-400",
          )}
        >
          {verified ? "Verificado" : "Não Verificado"}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, _columnId, filterValue: boolean | undefined) => {
      if (filterValue === undefined) return true;
      return row.original.emailVerified === filterValue;
    },
  }),
  columnHelper.accessor("lastSession", {
    header: "Última Sessão",
    cell: (info) => {
      const lastSession = info.getValue();
      return (
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            {formatDate(lastSession)}
          </span>
        </div>
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
  columnHelper.display({
    id: "actions",
    header: "Ações",
    cell: (info) => {
      const user = info.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <UserCircle className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
