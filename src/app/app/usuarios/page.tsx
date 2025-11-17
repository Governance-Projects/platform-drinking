"use client";

import Link from "next/link";
import { CheckCircle, Users, XCircle, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { DataTableSkeleton } from "~/components/ui/data-table-skeleton";
import { UserDataTable } from "./data-table";
import { api } from "~/trpc/react";
import type { StatCardProps } from "~/utils/types/stat-card-type";
import { StatCard } from "~/components/app/stat-card";

export default function UsuariosPage() {
  const userQuery = api.user.listOperationalUsers.useQuery();

  const usersLength = userQuery.data?.table.length ?? 0;

  const statsCards: StatCardProps[] = [
    {
      title: "Total",
      value: userQuery.data?.total ?? 0,
      description: "Workers cadastrados no sistema",
      icon: Users,
      variant: "default",
    },
    {
      title: "Ativos",
      value: userQuery.data?.active ?? 0,
      description: "Com sessão nos últimos 30 dias",
      icon: CheckCircle,
      variant: "success",
    },
    {
      title: "Inativos",
      value: userQuery.data?.inactive ?? 0,
      description: "Sem sessão recente",
      icon: XCircle,
      variant: "destructive",
    },
  ];

  return (
    <div className="bg-background w-full">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Gerenciamento de Usuários
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Gerencie todos os workers da sua instituição
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {statsCards.map((stat) => (
            <StatCard
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Usuários Workers Cadastrados</CardTitle>
              <CardDescription>
                {usersLength} usuário(s) encontrado(s)
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/app/usuarios/novo">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userQuery.isLoading ? (
              <DataTableSkeleton columnCount={6} rowCount={5} />
            ) : usersLength === 0 ? (
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  Nenhum usuário encontrado.
                </AlertDescription>
              </Alert>
            ) : (
              <UserDataTable data={userQuery.data?.table ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



