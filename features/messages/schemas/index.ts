import * as z from "zod";

export const createMessageSchema = z.object({
  from: z.string().min(1, { error: "From field is required" }),
  to: z.string().min(1, { error: "To field is required" }),
  trackId: z.string().min(1, { error: "Track ID field is required" }),
  content: z
    .string()
    .min(1, { error: "Content field is required" })
    .max(5000, { error: "Content field must be at most 5000 characters long" }),
});

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
