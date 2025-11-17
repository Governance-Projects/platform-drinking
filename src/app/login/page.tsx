"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { signIn, signUp } from "~/server/auth/client";
import {
  loginValidator,
  type LoginValidator,
} from "~/utils/validators/auth/login";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValidator>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValidator) => {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(result.error.message ?? "Email ou senha inválidos");
        return;
      }

      if (result?.data) {
        toast.success("Login realizado com sucesso!");
        const redirectUrl = searchParams.get("redirect") ?? "/app";
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-6">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={250}
            height={100}
            className="rounded-lg bg-white/10 p-2 backdrop-blur-sm"
            priority
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Entre com seu email e senha para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          disabled={isLoading}
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
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

                {/* <Button
                  type="button"
                  onClick={async () =>
                    await signUp.email({
                      email: "rianlandim@unifapce.com.br",
                      password: "teste123!",
                      name: "Rian Landim",
                    })
                  }
                >
                  Cadastrar
                </Button> */}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-6">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="rounded-lg bg-white/10 p-2 backdrop-blur-sm"
            priority
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Carregando...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
              <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
              <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  );
}
