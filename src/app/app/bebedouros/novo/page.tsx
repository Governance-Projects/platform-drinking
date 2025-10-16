"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Save } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { api } from "~/trpc/react";

type FormData = {
  nome: string;
  localizacao: string;
  descricao: string;
  status: "ATIVO" | "INATIVO" | "MANUTENCAO";
  latitude: string;
  longitude: string;
};

export default function NovoBebedouroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    localizacao: "",
    descricao: "",
    status: "ATIVO",
    latitude: "",
    longitude: "",
  });

  const createSinkMutation = api.bebedouro.create.useMutation();

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular salvamento (aqui você faria a chamada para sua API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Dados do bebedouro:", formData);

      // Redirecionar para a lista após o salvamento
      router.push("/app/bebedouros");
    } catch (error) {
      console.error("Erro ao salvar bebedouro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          alert(
            "Não foi possível obter sua localização. Verifique as permissões do navegador.",
          );
        },
      );
    } else {
      alert("Geolocalização não é suportada por este navegador.");
    }
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link href="/app/bebedouros">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Novo Bebedouro
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Cadastre um novo bebedouro no sistema
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informações do Bebedouro
            </CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para cadastrar o bebedouro
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome do Bebedouro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Ex: Bebedouro Principal - Entrada"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="localizacao">
                  Localização <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="localizacao"
                  type="text"
                  placeholder="Ex: Prédio A - Térreo"
                  value={formData.localizacao}
                  onChange={(e) =>
                    handleInputChange("localizacao", e.target.value)
                  }
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva informações adicionais sobre o bebedouro..."
                  value={formData.descricao}
                  onChange={(e) =>
                    handleInputChange("descricao", e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex flex-1 items-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Salvando..." : "Salvar Bebedouro"}
                </Button>

                <Link href="/app/bebedouros">
                  <Button variant="outline" className="flex items-center gap-2">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>
                <strong>Dicas:</strong>
              </p>
              <ul className="ml-2 list-inside list-disc space-y-1">
                <li>Use nomes descritivos que facilitem a identificação</li>
                <li>
                  Seja específico na localização (prédio, andar, referências)
                </li>
                <li>As coordenadas GPS ajudam na localização precisa</li>
                <li>Você pode editar essas informações posteriormente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
