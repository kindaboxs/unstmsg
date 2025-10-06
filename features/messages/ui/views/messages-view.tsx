"use client";

import { useEffect } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { MessageCard } from "@/features/messages/ui/components/message-card";
import { useTRPC } from "@/trpc/client";

export const MessagesView = () => {
  const { ref, inView } = useInView();

  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.messages.getAll.infiniteQueryOptions(
        { limit: 10 },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {data.pages.map((page) =>
          page.messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))
        )}
      </div>
    </>
  );
};
