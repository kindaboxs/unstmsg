"use client";

import { useEffect } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useMessageFilters } from "@/features/messages/hooks/use-message-filters";
import { MessageCard } from "@/features/messages/ui/components/message-card";
import { MessageCardSkeleton } from "@/features/messages/ui/components/message-card-skeleton";
import { MessageEmptyState } from "@/features/messages/ui/components/message-empty-state";
import { useTRPC } from "@/trpc/client";

export const MessagesView = () => {
  const { ref, inView } = useInView();
  const [filters] = useMessageFilters();

  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.messages.getAll.infiniteQueryOptions(
        { ...filters },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    );

  const isEmptyMessage = data.pages[0].messages.length === 0;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      {isEmptyMessage ? (
        <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
          <MessageEmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {data.pages.map((page) =>
            page.messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))
          )}

          {isFetchingNextPage &&
            Array.from({ length: 10 }).map((_, index) => (
              <MessageCardSkeleton key={index} />
            ))}
        </div>
      )}

      {hasNextPage && <div ref={ref} className="col-span-full h-px" />}
    </div>
  );
};

export const MessagesViewSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <MessageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
