import z from "zod";

export const createFeedbackValidator = z.object({
  sinkId: z.string().min(1, "ID do bebedouro é obrigatório"),
  type: z.enum(["PROBLEM", "SUGGESTION", "COMPLIMENT", "OTHER"], {
    errorMap: () => ({ message: "Tipo de feedback inválido" }),
  }),
  message: z.string().min(1, "Mensagem é obrigatória").max(1000, "Mensagem muito longa"),
  rating: z.number().min(1).max(5).optional(),
  name: z.string().max(100).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type CreateFeedbackValidator = z.infer<typeof createFeedbackValidator>;

