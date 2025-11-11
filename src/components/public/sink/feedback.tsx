"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Droplet, Star, MessageSquare, Send, AlertCircle } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  createFeedbackValidator,
  type CreateFeedbackValidator,
} from "~/utils/validators/sink/create-feedback";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const feedbackTypes = [
  { value: "PROBLEM", label: "Problema" },
  { value: "SUGGESTION", label: "Sugestão" },
  { value: "COMPLIMENT", label: "Elogio" },
  { value: "OTHER", label: "Outro" },
] as const;

function StarRating({
  rating,
  onRatingChange,
}: {
  rating: number | undefined;
  onRatingChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${
              rating && star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function FeedbackSink() {
  const router = useRouter();
  const params = useParams();
  const sinkId = params?.sinkId as string;

  const [rating, setRating] = useState<number | undefined>(undefined);

  const form = useForm<CreateFeedbackValidator>({
    resolver: zodResolver(createFeedbackValidator),
    defaultValues: {
      sinkId: sinkId ?? "",
      type: "PROBLEM",
      message: "",
      rating: undefined,
      name: "",
      email: "",
    },
  });

  const sinkQuery = api.sink.getById.useQuery(
    { id: sinkId ?? "" },
    { enabled: !!sinkId },
  );

  const createFeedbackMutation = api.sink.createFeedback.useMutation({
    onSuccess: () => {
      toast.success(
        "Feedback enviado com sucesso! Obrigado pela sua contribuição.",
      );
      form.reset();
      setRating(undefined);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao enviar feedback. Tente novamente.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CreateFeedbackValidator) => {
    createFeedbackMutation.mutate({
      ...data,
      rating: rating ?? undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      ACTIVE: { label: "Ativo", variant: "default" },
      INACTIVE: { label: "Inativo", variant: "destructive" },
      MAINTANCE: { label: "Manutenção", variant: "outline" },
    };

    const statusInfo = statusMap[status] ?? {
      label: status,
      variant: "default" as const,
    };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (sinkQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-2xl">
          <div className="text-center text-slate-600 dark:text-slate-400">
            Carregando informações do bebedouro...
          </div>
        </div>
      </div>
    );
  }

  if (sinkQuery.isError || !sinkQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Bebedouro não encontrado
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    O bebedouro que você está procurando não existe ou foi
                    removido.
                  </p>
                </div>
                <Button onClick={() => router.back()} variant="outline">
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sink = sinkQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Enviar Feedback
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Sua opinião é importante para melhorarmos nossos serviços
              </p>
            </div>
          </div>
        </div>

        {/* Card Bebedouro */}
        <Card className="mb-6 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-600" />
              Bebedouro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Nome
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sink.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Localização
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {sink.location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Status
                </p>
                <div className="mt-1">{getStatusBadge(sink.status)}</div>
              </div>
              {sink.description && (
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Descrição
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {sink.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Formulário de Feedback */}
        <Card className="mb-6 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Seu Feedback
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para enviar seu feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Feedback *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de feedback" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {feedbackTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Avaliação (Opcional)</Label>
                  <StarRating
                    rating={rating}
                    onRatingChange={(newRating) => {
                      setRating(newRating);
                      form.setValue("rating", newRating);
                    }}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clique nas estrelas para avaliar o bebedouro
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva seu feedback aqui..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
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
                        <FormLabel>Email (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    size="lg"
                    isLoading={createFeedbackMutation.isPending}
                    loadingMessage="Enviando..."
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Feedback
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      form.reset();
                      setRating(undefined);
                    }}
                    disabled={createFeedbackMutation.isPending}
                  >
                    Limpar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
