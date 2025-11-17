"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, UserPlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserValidator,
  type CreateUserValidator,
} from "~/utils/validators/user/create-user";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export default function NovoUsuarioPage() {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const form = useForm<CreateUserValidator>({
    resolver: zodResolver(createUserValidator),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createUserMutation = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      void apiUtils.user.listOperationalUsers.invalidate();
      router.push("/app/usuarios");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message ?? "Erro ao criar usuário");
    },
  });

  const submit: SubmitHandler<CreateUserValidator> = (data) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link href="/app/usuarios">
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
                Novo Usuário
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Cadastre um novo worker no sistema
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios para cadastrar o worker
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="space-y-6"
              noValidate
            >
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          data-test="email-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          data-test="password-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          data-test="confirm-password-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  data-test="submit-button"
                  type="submit"
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
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
                <li>Use um email válido e único</li>
                <li>
                  A senha deve ter no mínimo 8 caracteres, incluindo letras
                  maiúsculas, minúsculas e números
                </li>
                <li>O usuário será criado com o role de WORKER</li>
                <li>Você pode editar essas informações posteriormente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
