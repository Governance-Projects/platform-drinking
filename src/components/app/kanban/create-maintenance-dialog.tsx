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
import { useCreateMantaince } from "~/hooks/components/create-mantaince";
import { api } from "~/trpc/react";

interface CreateMaintenanceDialogProps {
  onMaintenanceCreated?: () => void;
}

export function CreateMaintenanceDialog({
  onMaintenanceCreated,
}: CreateMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);

  const { sinksOptions, workersOptions } = useCreateMantaince();
  const utils = api.useUtils();

  const form = useForm<CreateMaintenanceValidator>({
    resolver: zodResolver(createMaintenanceValidator),
    defaultValues: {
      sinkId: "",
      responsableId: "",
      observations: "",
    },
  });

  const createMaintenance = api.maintance.create.useMutation({
    onSuccess: () => {
      toast.success("Manutenção criada com sucesso!");
      form.reset();
      setOpen(false);
      // Invalidar a query para atualizar o kanban
      void utils.operation.list.invalidate();
      onMaintenanceCreated?.();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar manutenção");
    },
  });

  const submit: SubmitHandler<CreateMaintenanceValidator> = (data) => {
    createMaintenance.mutate(data);
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um bebedouro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sinksOptions.map((sink) => (
                        <SelectItem key={sink.value} value={sink.value}>
                          {sink.label}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workersOptions.map((responsable) => (
                        <SelectItem
                          key={responsable.value}
                          value={responsable.value}
                        >
                          {responsable.label}
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
