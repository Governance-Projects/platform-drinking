"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Droplet, User, Check, Trash2, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

interface ServiceType {
  id: string;
  label: string;
  checked: boolean;
}

interface ServiceCategory {
  id: string;
  title: string;
  services: ServiceType[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "limpeza-geral",
    title: "LIMPEZA GERAL",
    services: [
      { id: "desinfeccao-cuba", label: "Desinfecção cuba", checked: true },
      { id: "limpeza-externa", label: "Limpeza externa", checked: true },
      {
        id: "higienizacao-completa",
        label: "Higienização completa",
        checked: true,
      },
      {
        id: "verificacao-vazamentos",
        label: "Verificação vazamentos",
        checked: false,
      },
    ],
  },
  {
    id: "limpeza-parcial",
    title: "LIMPEZA PARCIAL",
    services: [
      { id: "limpeza-rapida", label: "Limpeza rápida", checked: false },
      {
        id: "higienizacao-dosadores",
        label: "Higienização dosadores",
        checked: false,
      },
      { id: "verificacao-visual", label: "Verificação visual", checked: false },
      {
        id: "teste-funcionamento",
        label: "Teste funcionamento",
        checked: false,
      },
    ],
  },
  {
    id: "troca-filtros",
    title: "TROCA DE FILTROS",
    services: [
      { id: "remocao-filtro", label: "Remoção filtro", checked: false },
      { id: "instalacao-filtro", label: "Instalação filtro", checked: false },
      { id: "registro-lote", label: "Registro lote", checked: false },
      { id: "teste-qualidade", label: "Teste qualidade", checked: false },
    ],
  },
  {
    id: "conserto-reparo",
    title: "CONSERTO/REPARO",
    services: [
      {
        id: "diagnostico-problema",
        label: "Diagnóstico problema",
        checked: false,
      },
      { id: "execucao-reparo", label: "Execução reparo", checked: false },
      { id: "substituicao-pecas", label: "Substituição peças", checked: false },
      { id: "teste-final", label: "Teste final", checked: false },
    ],
  },
];

export function OperationSink() {
  const router = useRouter();
  // TODO: Usar useParams para buscar dados do bebedouro quando a API estiver disponível
  // const params = useParams();
  // const sinkId = params?.sinkId as string;

  const [services, setServices] =
    useState<ServiceCategory[]>(serviceCategories);
  const [observations, setObservations] = useState("");

  // Dados mockados do bebedouro - substituir por dados reais da API
  const sinkData = {
    code: "BEB001",
    name: "Bebedouro Garagem",
    location: "1º Andar",
    type: "Coluna",
    status: "Pendente",
    lastService: {
      type: "Limpeza",
      date: "15/09/25",
      time: "12:03",
    },
  };

  const handleServiceToggle = (
    categoryId: string,
    serviceId: string,
    checked: boolean,
  ) => {
    setServices((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              services: category.services.map((service) =>
                service.id === serviceId ? { ...service, checked } : service,
              ),
            }
          : category,
      ),
    );
  };

  const handleClearForm = () => {
    setServices(
      serviceCategories.map((cat) => ({
        ...cat,
        services: cat.services.map((s) => ({ ...s, checked: false })),
      })),
    );
    setObservations("");
    toast.success("Formulário limpo");
  };

  const handleSaveDraft = () => {
    // TODO: Implementar salvamento de rascunho
    toast.success("Rascunho salvo com sucesso");
  };

  const handleFinalizeService = () => {
    const selectedServices = services
      .flatMap((cat) => cat.services)
      .filter((s) => s.checked);

    if (selectedServices.length === 0) {
      toast.error("Selecione pelo menos um serviço");
      return;
    }

    // TODO: Implementar finalização do serviço
    toast.success("Serviço finalizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Iniciar Serviço
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Localize o bebedouro para iniciar o serviço
              </p>
            </div>
          </div>
        </div>

        {/* Card Bebedouro Selecionado */}
        <Card className="mb-6 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-600" />
              Bebedouro Selecionado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Código
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sinkData.code}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Nome
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sinkData.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Localização
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sinkData.location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tipo
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sinkData.type}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Status atual
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  {sinkData.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Última Serviço
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sinkData.lastService.type}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {sinkData.lastService.date} - {sinkData.lastService.time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Detalhes do Serviço */}
        <Card className="mb-6 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Detalhes do Serviço
            </CardTitle>
            <CardDescription>Tipos de Serviço Realizados</CardDescription>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Selecione todos os serviços que foram realizados
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {services.map((category) => (
                <div key={category.id} className="space-y-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {category.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {category.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Checkbox
                          id={service.id}
                          checked={service.checked}
                          onCheckedChange={(checked) =>
                            handleServiceToggle(
                              category.id,
                              service.id,
                              checked === true,
                            )
                          }
                        />
                        <Label
                          htmlFor={service.id}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações Adicionais */}
        <Card className="mb-6 shadow-xl">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="observations" className="text-base font-semibold">
                Observações Adicionais *
              </Label>
              <Textarea
                id="observations"
                placeholder="Digite suas observações aqui..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleFinalizeService}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            size="lg"
          >
            <Check className="h-4 w-4" />
            Finalizar Serviço
          </Button>
          <Button
            onClick={handleClearForm}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            <Trash2 className="h-4 w-4" />
            Limpar Formulário
          </Button>
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </Button>
        </div>
      </div>
    </div>
  );
}
