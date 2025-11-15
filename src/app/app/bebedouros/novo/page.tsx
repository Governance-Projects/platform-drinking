"use client";

import Link from "next/link";

import { ArrowLeft, MapPin } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

import { Textarea } from "~/components/ui/textarea";

import { api } from "~/trpc/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSinkValidator,
  type CreateSinkValidator,
} from "~/utils/validators/sink/create-sink";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export default function NovoBebedouroPage() {
  const form = useForm<CreateSinkValidator>({
    resolver: zodResolver(createSinkValidator),
    defaultValues: {
      description: "",
      location: "",
      name: "",
    },
  });

  const createSinkMutation = api.sink.create.useMutation();

  const submit: SubmitHandler<CreateSinkValidator> = (data) => {
    toast.promise(() => createSinkMutation.mutateAsync(data), {
      loading: "Carregando...",
      success: `Salvo com sucesso`,
      error: "Ocorreu um erro ao registrar",
      id: "promise-toast",
    });
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
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
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input data-test="name-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input data-test="location-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea data-test="description-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button data-test="submit-button">Salvar</Button>
              </Form>
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
