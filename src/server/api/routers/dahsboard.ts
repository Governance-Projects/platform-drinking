import { publicProcedure } from "../trpc";

export const dashboardRouter = {
  list: publicProcedure.query(async ({ ctx }) => {
    const totalSinks = await ctx.db.sink.count();

    const inMaintanceSinks = await ctx.db.sink.count({
      where: {
        status: "MAINTANCE",
      },
    });

    const activeSinks = await ctx.db.sink.count({
      where: {
        status: "ACTIVE",
      },
    });

    return {
      totalSinks,
      inMaintanceSinks,
      activeSinks,
    };
  }),
};
