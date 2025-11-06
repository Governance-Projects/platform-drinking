"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import Link from "next/link";
import {
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Calendar,
} from "lucide-react";
import { ChartAreaInteractive } from "~/components/app/dashboard/chart-card";

import { api } from "~/trpc/react";

interface StatCard {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "destructive";
}

export default function DashboardPage() {
  const dashboardQuery = api.dashboard.list.useQuery();

  const statCards: StatCard[] = [
    {
      title: "Total",
      value: dashboardQuery.data?.totalSinks ?? 0,
      description: "Bebedouros cadastrados no sistema",
      icon: MapPin,
      variant: "default",
    },
    {
      title: "Em Manutenção",
      value: dashboardQuery.data?.inMaintanceSinks ?? 0,
      description: "Precisam de reparo",
      icon: Wrench,
      variant: "warning",
    },
    {
      title: "Ativos",
      value: dashboardQuery.data?.activeSinks ?? 0,
      description: "Em funcionamento",
      icon: XCircle,
      variant: "success",
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ATIVO":
        return "secondary";
      case "MANUTENCAO":
        return "outline";
      case "INATIVO":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ATIVO":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "MANUTENCAO":
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case "INATIVO":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="bg-background w-full">
      <div className="w-full space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardQuery.isLoading
            ? statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="mb-2 h-8 w-20" />
                      <Skeleton className="h-4 w-48" />
                    </CardContent>
                  </Card>
                );
              })
            : statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-muted-foreground text-xs">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        <ChartAreaInteractive />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Distribuição por Status
              </CardTitle>
              <CardDescription>
                Status atual dos bebedouros no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {false ? (
                <div className="space-y-3">
                  <div className="bg-muted h-4 animate-pulse rounded" />
                  <div className="bg-muted h-4 animate-pulse rounded" />
                  <div className="bg-muted h-4 animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Ativos</span>
                    </div>
                    <Badge variant="secondary">{0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Em Manutenção</span>
                    </div>
                    <Badge variant="outline">{0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Inativos</span>
                    </div>
                    <Badge variant="destructive">{0}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Bebedouros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bebedouros Recentes
              </CardTitle>
              <CardDescription>Últimos bebedouros adicionados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {false ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-muted h-4 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ) : false ? (
                [
                  {
                    id: "1",
                    status: "CLOSED",
                    nome: "Teste",
                    localizacao: "Teste",
                    createdAt: new Date(),
                  },
                ]
                  .slice(0, 5)
                  .map((bebedouro) => (
                    <div key={bebedouro.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(bebedouro.status)}
                          <span className="text-sm font-medium">
                            {bebedouro.nome}
                          </span>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(bebedouro.status)}
                        >
                          {bebedouro.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {bebedouro.localizacao}
                        </span>
                        <span>{formatDate(bebedouro.createdAt)}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-6 text-center">
                  <AlertTriangle className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    Nenhum bebedouro encontrado
                  </p>
                  <Button asChild className="mt-2" size="sm">
                    <Link href="/app/bebedouros/novo">
                      Adicionar Primeiro Bebedouro
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
