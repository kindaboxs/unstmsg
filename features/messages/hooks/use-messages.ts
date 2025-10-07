import { useEffect, useRef } from "react";

import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { useMessageFilters } from "@/features/messages/hooks/use-message-filters";
import type { MessageType } from "@/features/messages/types";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/lib/pusher";
import { pusherClient } from "@/lib/pusher/client";
import { useTRPC } from "@/trpc/client";

export const useMessages = () => {
  const { ref, inView } = useInView({ fallbackInView: false });
  const [filters] = useMessageFilters();
  const filtersRef = useRef(filters);

  const queryClient = useQueryClient();

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

  // Update filtersRef when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const pusherChannel = pusherClient.subscribe(PUSHER_CHANNEL);

    pusherChannel.bind(
      PUSHER_EVENT.NEW_MESSAGE,
      async (newMessage: MessageType) => {
        await queryClient.invalidateQueries({
          queryKey: trpc.messages.getAll.infiniteQueryKey({
            ...filtersRef.current,
          }),
        });

        const isAnonymous = newMessage.from.toLowerCase() === "anonymous";
        const message = isAnonymous
          ? `A new anonymous has created a message`
          : `${newMessage.from} has created a message`;
        toast.info(message, {
          id: newMessage.id,
        });
      }
    );

    return () => {
      pusherChannel.unbind_all();
      pusherChannel.unsubscribe();
    };
  }, [queryClient, trpc.messages.getAll]);

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isEmptyMessage,
    ref,
  };
};
