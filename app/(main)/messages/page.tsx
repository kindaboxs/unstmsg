import { Suspense } from "react";

import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { messagesLoader } from "@/features/messages/params";
import { MessageViewHeader } from "@/features/messages/ui/components/message-view-header";
import {
  MessagesView,
  MessagesViewError,
  MessagesViewSkeleton,
} from "@/features/messages/ui/views/messages-view";
import { HydrateClient } from "@/lib/query/hydration";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function MessagesPage({ searchParams }: Props) {
  const params = await messagesLoader(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.messages.getAll.infiniteQueryOptions(
      { ...params },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  return (
    <>
      <MessageViewHeader />

      <HydrateClient client={queryClient}>
        <Suspense fallback={<MessagesViewSkeleton />}>
          <ErrorBoundary fallback={<MessagesViewError />}>
            <MessagesView />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  );
}
