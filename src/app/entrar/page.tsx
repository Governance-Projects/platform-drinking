"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function LoginPage() {
  const router = useRouter();
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
        router.push("/app");
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.";
      toast.error(errorMessage);
      console.error("Login error -> ", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const createDevAccountAndLogin = async () => {
    setIsLoading(true);

    const password = "Teste123!";

    try {
      const response = await signUp.email({
        name: "Admin",
        email: "admin@unifapce.edu.br",
        password: "Teste123!",
      });

      if (response.data?.user) {
        const user = response.data.user;

        const result = await signIn.email({
          email: user.email,
          password,
        });

        if (result?.data) {
          toast.success("Login realizado com sucesso!");
          router.push("/app");
          router.refresh();
        }
      }
    } catch (error) {
      console.log(
        "sign up and login error -> ",
        JSON.stringify(error, null, 2),
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingMessage="Entrando..."
              >
                Entrar
              </Button>

              {process.env.NODE_ENV === "development" && (
                <Button
                  type="button"
                  className="w-full"
                  variant="destructive"
                  isLoading={isLoading}
                  loadingMessage="Entrando..."
                  onClick={createDevAccountAndLogin}
                >
                  *DEV*
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
