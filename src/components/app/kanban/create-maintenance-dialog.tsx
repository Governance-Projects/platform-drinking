"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "~/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  createMaintenanceValidator,
  type CreateMaintenanceValidator,
} from "~/utils/validators/maintenance/create-maintenance";
import {
  mockSinksList,
  mockResponsablesList,
} from "~/utils/mocks/maintenance-mock-data";
import type { MaintenanceCard } from "~/utils/types/maintenance-kanban";
import { MaintenanceStatus } from "~/utils/types/maintenance-kanban";

interface CreateMaintenanceDialogProps {
  onMaintenanceCreated: (maintenance: MaintenanceCard) => void;
}

export function CreateMaintenanceDialog({
  onMaintenanceCreated,
}: CreateMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateMaintenanceValidator>({
    resolver: zodResolver(createMaintenanceValidator),
    defaultValues: {
      sinkId: "",
      responsableId: "",
      observations: "",
    },
  });

  const submit: SubmitHandler<CreateMaintenanceValidator> = (data) => {
    // Buscar dados do bebedouro e responsável selecionados
    const sink = mockSinksList.find((s) => s.id === data.sinkId);
    const responsable = mockResponsablesList.find(
      (r) => r.id === data.responsableId,
    );

    if (!sink || !responsable) {
      toast.error("Erro ao criar manutenção. Dados inválidos.");
      return;
    }

    // Criar nova manutenção
    const newMaintenance: MaintenanceCard = {
      id: `maint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sinkId: data.sinkId,
      sinkName: sink.name,
      location: sink.location,
      responsableId: data.responsableId,
      responsableName: responsable.name,
      observations: data.observations,
      status: MaintenanceStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onMaintenanceCreated(newMaintenance);
    form.reset();
    setOpen(false);
    toast.success("Manutenção criada com sucesso!");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Manutenção
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-2 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Nova Manutenção</SheetTitle>
          <SheetDescription>
            Preencha os dados para criar uma nova manutenção de bebedouro
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="sinkId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bebedouro</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um bebedouro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSinksList.map((sink) => (
                        <SelectItem key={sink.id} value={sink.id}>
                          {sink.name} - {sink.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockResponsablesList.map((responsable) => (
                        <SelectItem key={responsable.id} value={responsable.id}>
                          {responsable.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o problema ou tipo de manutenção necessária..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" className="w-full">
                Criar Manutenção
              </Button>
            </SheetFooter>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
