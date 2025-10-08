import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { spotifyGetTrack, spotifySearchTrack } from "@/lib/spotify";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const spotifyRouter = createTRPCRouter({
  getTrack: publicProcedure
    .input(z.object({ trackId: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await spotifyGetTrack(input.trackId);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get track",
        });
      }

      return data;
    }),

  searchTrack: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await spotifySearchTrack(input.query);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search track",
        });
      }

      const tracks = data?.tracks;

      return tracks;
    }),
});
