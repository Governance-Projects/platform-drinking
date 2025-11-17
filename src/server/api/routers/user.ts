import { protectedProcedure } from "../trpc";
import z from "zod";
import { createTRPCRouter } from "../trpc";
import { createUserValidator } from "~/utils/validators/user/create-user";
import { auth } from "~/server/auth/auth";

export const usersRouters = createTRPCRouter({
  listOperationalUsers: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ ctx }) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const users = await ctx.db.user.findMany({
        where: {
          role: "WORKER",
        },
        include: {
          sessions: {
            where: {
              expiresAt: {
                gte: thirtyDaysAgo,
              },
            },
            orderBy: {
              expiresAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const total = users.length;

      // Usuários com sessão recente (últimos 30 dias)
      const active = users.filter((user) => user.sessions.length > 0).length;

      // Usuários sem sessão recente
      const inactive = total - active;

      // Mapear usuários com última sessão
      const table = users.map((user) => ({
        ...user,
        lastSession: user.sessions[0]?.expiresAt ?? null,
      }));

      return {
        table,
        total,
        active,
        inactive,
      };
    }),

  create: protectedProcedure
    .input(createUserValidator)
    .mutation(async ({ ctx, input }) => {
      // Verificar se o email já existe
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("Email já cadastrado");
      }

      // Usar better-auth para criar o usuário (via API interna)
      // O better-auth gerencia o hash da senha automaticamente
      try {
        const signUpResult = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        if (!signUpResult.user) {
          throw new Error("Erro ao criar usuário: usuário não foi criado");
        }

        // Atualizar o role para WORKER
        const user = await ctx.db.user.update({
          where: { id: signUpResult.user.id },
          data: {
            role: "WORKER",
          },
        });

        return user;
      } catch (error) {
        // Se a API do better-auth não funcionar, criar diretamente
        // Isso é um fallback caso a API não esteja disponível
        if (error instanceof Error) {
          throw new Error(
            `Erro ao criar usuário via better-auth: ${error.message}`,
          );
        }
        throw new Error("Erro desconhecido ao criar usuário");
      }
    }),
});
