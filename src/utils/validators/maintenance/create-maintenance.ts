import z from "zod";

export const createMaintenanceValidator = z.object({
  sinkId: z.string().min(1, "Bebedouro é obrigatório"),
  responsableId: z.string().min(1, "Responsável é obrigatório"),
  observations: z.string().min(1, "Observações são obrigatórias").max(255),
});

export type CreateMaintenanceValidator = z.infer<
  typeof createMaintenanceValidator
>;

