import * as z from "zod";

import {
  DEFAULT_LIMIT_MESSAGES,
  DEFAULT_MAX_LIMIT_MESSAGES,
  DEFAULT_MIN_LIMIT_MESSAGES,
} from "@/constants";
import { createMessageSchema } from "@/features/messages/schemas";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const getAllMessagesSchema = z.object({
  search: z.string().nullish(),
  limit: z.coerce
    .number()
    .min(DEFAULT_MIN_LIMIT_MESSAGES)
    .max(DEFAULT_MAX_LIMIT_MESSAGES)
    .default(DEFAULT_LIMIT_MESSAGES),
  cursor: z.string().nullish(),
});

export const messagesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getAllMessagesSchema)
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;

      const messages = await ctx.db.unsentMessage.findMany({
        ...(search
          ? {
              where: {
                OR: [
                  {
                    from: search
                      ? { contains: search, mode: "insensitive" }
                      : undefined,
                  },
                  {
                    to: search
                      ? { contains: search, mode: "insensitive" }
                      : undefined,
                  },
                ],
              },
            }
          : undefined),
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
