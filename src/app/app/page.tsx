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
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Calendar,
} from "lucide-react";
import { ChartAreaInteractive } from "~/components/app/dashboard/chart-card";

import { api } from "~/trpc/react";
import type { StatCardProps } from "~/utils/types/stat-card-type";

export default function DashboardPage() {
  const dashboardQuery = api.dashboard.list.useQuery();
  const sinkQuery = api.sink.list.useQuery();

  const statCards: StatCardProps[] = [
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
      case "ACTIVE":
        return "secondary";
      case "MAINTANCE":
        return "outline";
      case "INACTIVE":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "MAINTANCE":
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case "INACTIVE":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Ativo";
      case "MAINTANCE":
        return "Manutenção";
      case "INACTIVE":
        return "Inativo";
      default:
        return status;
    }
  };

  const recentSinks = sinkQuery.data?.table
    ? [...sinkQuery.data.table]
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .slice(0, 5)
    : [];

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
            {sinkQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-muted h-4 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : recentSinks.length > 0 ? (
              recentSinks.map((bebedouro) => (
                <div key={bebedouro.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(bebedouro.status)}
                      <span className="text-sm font-medium">
                        {bebedouro.name}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(bebedouro.status)}>
                      {getStatusLabel(bebedouro.status)}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {bebedouro.location}
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
  );
}
