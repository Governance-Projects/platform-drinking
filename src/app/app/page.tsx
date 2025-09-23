"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import Link from "next/link";
import {
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "destructive";
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = api.bebedouro.stats.useQuery(
    {},
  );
  const { data: bebedouros, isLoading: bebedourosLoading } =
    api.bebedouro.list.useQuery({
      limit: 5,
      offset: 0,
    });

  const statCards: StatCard[] = [
    {
      title: "Total de Bebedouros",
      value: stats?.total ?? 0,
      description: "Bebedouros cadastrados no sistema",
      icon: MapPin,
      variant: "default",
    },
    {
      title: "Bebedouros Ativos",
      value: stats?.ativos ?? 0,
      description: "Funcionando normalmente",
      icon: CheckCircle,
      variant: "success",
    },
    {
      title: "Em Manutenção",
      value: stats?.manutencao ?? 0,
      description: "Precisam de reparo",
      icon: Wrench,
      variant: "warning",
    },
    {
      title: "Inativos",
      value: stats?.inativos ?? 0,
      description: "Fora de funcionamento",
      icon: XCircle,
      variant: "destructive",
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema de bebedouros
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/app/bebedouros/novo">
                <Plus className="mr-2 h-4 w-4" />
                Novo Bebedouro
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/bebedouros">Ver Todos</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
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
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : stat.value}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Bebedouros adicionados nos últimos 30 dias:{" "}
              <span className="text-foreground font-semibold">
                {statsLoading ? "..." : (stats?.criadosUltimos30Dias ?? 0)}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

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
              {statsLoading ? (
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
                    <Badge variant="secondary">{stats?.ativos ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Em Manutenção</span>
                    </div>
                    <Badge variant="outline">{stats?.manutencao ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Inativos</span>
                    </div>
                    <Badge variant="destructive">{stats?.inativos ?? 0}</Badge>
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
              {bebedourosLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-muted h-4 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ) : bebedouros?.bebedouros.length ? (
                bebedouros.bebedouros.slice(0, 5).map((bebedouro) => (
                  <div key={bebedouro.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bebedouro.status)}
                        <span className="text-sm font-medium">
                          {bebedouro.nome}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(bebedouro.status)}>
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

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
              >
                <Link href="/app/bebedouros/novo">
                  <Plus className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Adicionar Bebedouro</div>
                    <div className="text-muted-foreground text-xs">
                      Cadastrar novo bebedouro
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
              >
                <Link href="/app/bebedouros">
                  <MapPin className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Ver Bebedouros</div>
                    <div className="text-muted-foreground text-xs">
                      Lista completa
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
              >
                <Link href="/api-docs">
                  <Activity className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Documentação API</div>
                    <div className="text-muted-foreground text-xs">
                      Guia da API
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
