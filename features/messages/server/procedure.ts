import * as z from "zod";

import { createMessageSchema } from "@/features/messages/schemas";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const getAllMessagesSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().nullish(),
});

export const messagesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getAllMessagesSchema)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const messages = await ctx.db.unsentMessage.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage!.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  create: publicProcedure
    .input(createMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.db.unsentMessage.create({
        data: {
          ...input,
        },
      });

      return newMessage;
    }),
});
