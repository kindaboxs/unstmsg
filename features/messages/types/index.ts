import type { RouterOutputs } from "@/trpc/client";

export type MessageType =
  RouterOutputs["messages"]["getAll"]["messages"][number];
