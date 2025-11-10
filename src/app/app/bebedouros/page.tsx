"use client";

import Link from "next/link";
import { MapPin, Plus } from "lucide-react";

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

export default function BebedourosPage() {
  const sinkQuery = api.sink.list.useQuery();

  const sinksLength = sinkQuery.data?.length ?? 0;

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{sinksLength}</p>
                  <p className="text-muted-foreground text-sm">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <div className="h-6 w-6 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{0}</p>
                  <p className="text-muted-foreground text-sm">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                  <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{0}</p>
                  <p className="text-muted-foreground text-sm">Manutenção</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-red-100 p-3 dark:bg-red-900">
                  <div className="h-6 w-6 rounded-full bg-red-500"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{0}</p>
                  <p className="text-muted-foreground text-sm">Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <SinkDataTable data={sinkQuery.data ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
