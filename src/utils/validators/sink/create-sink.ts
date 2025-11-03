import z from "zod";

export const createSinkValidator = z.object({
  name: z.string().min(1, "Nome é obrigatorio"),
  location: z.string().min(1, "Localização é obrigatorio"),
  description: z.string().min(1, "Descrição é obrigatorio").max(255),
});

export type CreateSinkValidator = z.infer<typeof createSinkValidator>;
