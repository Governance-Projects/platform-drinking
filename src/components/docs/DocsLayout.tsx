"use client";

import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  BookOpen,
  Search,
  ExternalLink,
  Menu,
  FileText,
  Zap,
  Shield,
  Database,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    {
      title: "Introdução",
      items: [
        { name: "Visão Geral", href: "#overview", icon: BookOpen },
        { name: "Começando", href: "#getting-started", icon: Zap },
        { name: "Autenticação", href: "#authentication", icon: Shield },
      ],
    },
    {
      title: "Bebedouros",
      items: [
        { name: "Listar Bebedouros", href: "#list-bebedouros", icon: FileText },
        { name: "Criar Bebedouro", href: "#create-bebedouro", icon: FileText },
        { name: "Buscar por ID", href: "#get-bebedouro", icon: FileText },
        { name: "Atualizar", href: "#update-bebedouro", icon: FileText },
        { name: "Deletar", href: "#delete-bebedouro", icon: FileText },
        { name: "Estatísticas", href: "#bebedouros-stats", icon: Database },
      ],
    },
    {
      title: "Exemplos",
      items: [{ name: "Posts (Demo)", href: "#posts-hello", icon: FileText }],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <a className="mr-6 flex items-center space-x-2" href="#overview">
              <BookOpen className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Drinking API
              </span>
            </a>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Buscar documentação..."
                  className="pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <nav className="flex items-center">
              <Button variant="ghost" size="sm" asChild>
                <a href="/api/openapi.json" target="_blank">
                  <FileText className="h-4 w-4" />
                  OpenAPI
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  App
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block",
            sidebarOpen && "block",
          )}
        >
          {sidebarOpen && (
            <div
              className="bg-background/80 fixed inset-0 z-20 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="bg-background relative z-30 h-full py-6 pr-6 md:py-8">
            <div className="w-full">
              {navigation.map((section) => (
                <div key={section.title} className="pb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                    {section.title}
                  </h4>
                  <div className="grid grid-flow-row auto-rows-max text-sm">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                            "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {/* Hero Section */}
            <div className="mb-8 space-y-4">
              <div className="space-y-2">
                <Badge className="mb-2">v1.0.0</Badge>
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                  Drinking API
                </h1>
                <p className="text-muted-foreground text-xl">
                  Sistema de Gerenciamento de Bebedouros - Documentação da API
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground text-sm">Online</span>
                </div>
                <Badge variant="outline">REST API</Badge>
                <Badge variant="outline">tRPC</Badge>
                <Badge variant="outline">OpenAPI 3.0</Badge>
              </div>
            </div>

            {children}
          </div>

          {/* Right sidebar - Table of contents */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="space-y-2">
                <p className="font-medium">Nesta página</p>
                <ul className="m-0 list-none">
                  <li className="mt-0 pt-2">
                    <a
                      className="hover:text-foreground text-muted-foreground inline-block no-underline transition-colors"
                      href="#overview"
                    >
                      Visão Geral
                    </a>
                  </li>
                  <li className="mt-0 pt-2">
                    <a
                      className="hover:text-foreground text-muted-foreground inline-block no-underline transition-colors"
                      href="#authentication"
                    >
                      Autenticação
                    </a>
                  </li>
                  <li className="mt-0 pt-2">
                    <a
                      className="hover:text-foreground text-muted-foreground inline-block no-underline transition-colors"
                      href="#endpoints"
                    >
                      Endpoints
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
