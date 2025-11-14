import { protectedProcedure } from "../trpc";

export const usersRouters = {
  listOperationalUsers: protectedProcedure.query(async ({ ctx, input }) => {
    const users = await ctx.db.user.findMany({
      where: {
        role: "WORKER",
      },
    });

    return users;
  }),
};
