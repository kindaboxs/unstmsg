import { Suspense } from "react";

import { MessagesView } from "@/features/messages/ui/views/messages-view";
import { HydrateClient } from "@/lib/query/hydration";
import { getQueryClient, trpc } from "@/trpc/server";

export default function MessagesPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.messages.getAll.infiniteQueryOptions({ limit: 10 })
  );

  return (
    <HydrateClient client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagesView />
      </Suspense>
    </HydrateClient>
  );
}
