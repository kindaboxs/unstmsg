import { messagesRouter } from "@/features/messages/server/procedure";
import { spotifyRouter } from "@/features/spotify/server/procedure";
import { createCallerFactory, createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  spotify: spotifyRouter,
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
