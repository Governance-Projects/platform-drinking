"use client";

import Link from "next/link";
import { CircleCheck, MapPin, Plus, Wrench, XCircle } from "lucide-react";

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
import { SinkDataTable } from "./data-table";
import { api } from "~/trpc/react";
import type { StatCardProps } from "~/utils/types/stat-card-type";
import { StatCard } from "~/components/app/stat-card";

export default function BebedourosPage() {
  const sinkQuery = api.sink.list.useQuery();

  const sinksLength = sinkQuery.data?.table.length ?? 0;

  const statsCards: StatCardProps[] = [
    {
      title: "Total",
      value: sinkQuery.data?.table.length ?? 0,
      description: "Bebedouros cadastrados no sistema",
      icon: MapPin,
      variant: "default",
    },
    {
      title: "Em Manutenção",
      value: sinkQuery.data?.inMaintance ?? 0,
      description: "Precisam de reparo",
      icon: Wrench,
      variant: "warning",
    },
    {
      title: "Ativos",
      value: sinkQuery.data?.activies ?? 0,
      description: "Em funcionamento",
      icon: CircleCheck,
      variant: "success",
    },
    {
      title: "Inativos",
      value: sinkQuery.data?.inactivies ?? 0,
      description: "Fora de operacão",
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
                Gerenciamento de Bebedouros
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Gerencie todos os bebedouros da sua instituição
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
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
              <CardTitle>Bebedouros Cadastrados</CardTitle>
              <CardDescription>
                {sinksLength} bebedouros encontrados
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/app/bebedouros/novo">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Bebedouro
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sinkQuery.isLoading ? (
              <DataTableSkeleton columnCount={6} rowCount={5} />
            ) : sinksLength === 0 ? (
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  Nenhum bebedouro encontrado.
                </AlertDescription>
              </Alert>
            ) : (
              <SinkDataTable data={sinkQuery.data?.table ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
