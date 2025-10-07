import { useEffect } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useMessageFilters } from "@/features/messages/hooks/use-message-filters";
import { useTRPC } from "@/trpc/client";

export const useMessages = () => {
  const { ref, inView } = useInView({ fallbackInView: false });
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

  const isEmptyMessage =
    data.pages.flatMap((page) => page.messages).length === 0;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isEmptyMessage,
    ref,
  };
};
