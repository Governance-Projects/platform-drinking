import { sinkRouter } from "~/server/api/routers/sink";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { dashboardRouter } from "./routers/dahsboard";
import { operationRouter } from "./routers/operation";
import { usersRouters } from "./routers/user";
import { maintanceRouter } from "./routers/maintance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sink: sinkRouter,
  dashboard: dashboardRouter,
  operation: operationRouter,
  user: usersRouters,
  maintance: maintanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
