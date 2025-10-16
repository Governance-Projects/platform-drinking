import z from "zod";

export const createSinkValidator = z.object({
  name: z.string(),
  location: z.string(),
  description: z.string().min(1).max(255),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateSinkValidator = z.infer<typeof createSinkValidator>;
