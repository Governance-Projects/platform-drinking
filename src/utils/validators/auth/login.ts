import z from "zod";

export const loginValidator = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginValidator = z.infer<typeof loginValidator>;



