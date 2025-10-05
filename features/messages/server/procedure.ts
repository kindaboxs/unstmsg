import { createMessageSchema } from "@/features/messages/schemas";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const messagesRouter = createTRPCRouter({
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
