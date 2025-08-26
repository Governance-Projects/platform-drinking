"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "~/components/ui/alert";

// Tipo para o bebedouro
type Bebedouro = {
  id: string;
  nome: string;
  localizacao: string;
  descricao?: string;
  status: "ATIVO" | "INATIVO" | "MANUTENCAO";
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    name?: string;
    email?: string;
  };
};

// Dados mock para demonstração
const bebedourosMock: Bebedouro[] = [
  {
    id: "1",
    nome: "Bebedouro Principal - Entrada",
    localizacao: "Prédio A - Térreo",
    descricao: "Bebedouro localizado na entrada principal do prédio A",
    status: "ATIVO",
    latitude: -23.5505,
    longitude: -46.6333,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: {
      name: "João Silva",
      email: "joao@exemplo.com",
    },
  },
  {
    id: "2",
    nome: "Bebedouro Cafeteria",
    localizacao: "Prédio B - 2º Andar",
    descricao: "Próximo à cafeteria principal",
    status: "ATIVO",
    latitude: -23.5515,
    longitude: -46.6343,
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    createdBy: {
      name: "Maria Santos",
      email: "maria@exemplo.com",
    },
  },
  {
    id: "3",
    nome: "Bebedouro Biblioteca",
    localizacao: "Prédio C - 1º Andar",
    descricao: "Em frente à entrada da biblioteca",
    status: "MANUTENCAO",
    latitude: -23.5525,
    longitude: -46.6353,
    createdAt: "2024-01-10T16:45:00Z",
    updatedAt: "2024-01-17T11:30:00Z",
    createdBy: {
      name: "Pedro Costa",
      email: "pedro@exemplo.com",
    },
  },
  {
    id: "4",
    nome: "Bebedouro Pátio Externo",
    localizacao: "Área Externa - Pátio",
    descricao: "Bebedouro ao ar livre para área de recreação",
    status: "INATIVO",
    latitude: -23.5535,
    longitude: -46.6363,
    createdAt: "2024-01-08T08:15:00Z",
    updatedAt: "2024-01-16T15:45:00Z",
    createdBy: {
      name: "Ana Oliveira",
      email: "ana@exemplo.com",
    },
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "ATIVO":
      return "bg-green-500";
    case "INATIVO":
      return "bg-red-500";
    case "MANUTENCAO":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ATIVO":
      return "Ativo";
    case "INATIVO":
      return "Inativo";
    case "MANUTENCAO":
      return "Manutenção";
    default:
      return status;
  }
};

export default function BebedourosPage() {
  const [bebedouros] = useState<Bebedouro[]>(bebedourosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBebedouros, setFilteredBebedouros] =
    useState<Bebedouro[]>(bebedourosMock);

  // Filtrar bebedouros baseado no termo de busca
  useEffect(() => {
    const filtered = bebedouros.filter(
      (bebedouro) =>
        bebedouro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bebedouro.localizacao
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        bebedouro.descricao?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredBebedouros(filtered);
  }, [searchTerm, bebedouros]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl">
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
            <div className="flex items-center gap-3">
              <Link href="/api-docs" target="_blank">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  API Docs
                </Button>
              </Link>
              <Link href="/bebedouros/novo">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Bebedouro
                </Button>
              </Link>
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
                  <p className="text-2xl font-bold">{bebedouros.length}</p>
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
                  <p className="text-2xl font-bold">
                    {bebedouros.filter((b) => b.status === "ATIVO").length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {bebedouros.filter((b) => b.status === "MANUTENCAO").length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {bebedouros.filter((b) => b.status === "INATIVO").length}
                  </p>
                  <p className="text-muted-foreground text-sm">Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar bebedouros específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, localização ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Bebedouros */}
        <Card>
          <CardHeader>
            <CardTitle>Bebedouros Cadastrados</CardTitle>
            <CardDescription>
              {filteredBebedouros.length} bebedouros encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBebedouros.length === 0 ? (
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  Nenhum bebedouro encontrado.{" "}
                  {searchTerm
                    ? "Tente ajustar sua busca."
                    : "Comece adicionando um novo bebedouro."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado por</TableHead>
                      <TableHead>Última atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBebedouros.map((bebedouro) => (
                      <TableRow key={bebedouro.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{bebedouro.nome}</p>
                            {bebedouro.descricao && (
                              <p className="text-muted-foreground text-sm">
                                {bebedouro.descricao}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="text-muted-foreground h-4 w-4" />
                            {bebedouro.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(bebedouro.status)} text-white`}
                          >
                            {getStatusText(bebedouro.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {bebedouro.createdBy.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {bebedouro.createdBy.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDate(bebedouro.updatedAt)}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
