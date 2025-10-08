import { useCallback, useEffect } from "react";

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
  const messageQueryKey = useCallback(() => {
    return trpc.messages.getAll.infiniteQueryKey();
  }, [trpc.messages.getAll]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const pusherChannel = pusherClient.subscribe(PUSHER_CHANNEL);

    const handleNewMessage = (newMessage: MessageType) => {
      void queryClient.invalidateQueries({
        queryKey: messageQueryKey(),
      });

      const isAnonymous = newMessage.from.toLowerCase() === "anonymous";
      const message = isAnonymous
        ? `A new anonymous has created a message`
        : `${newMessage.from} has created a message`;
      toast.info(message, {
        id: newMessage.id,
      });
    };

    pusherChannel.bind(PUSHER_EVENT.NEW_MESSAGE, handleNewMessage);

    return () => {
      pusherChannel.unbind(PUSHER_EVENT.NEW_MESSAGE, handleNewMessage);
      pusherChannel.unsubscribe();
    };
  }, [messageQueryKey, queryClient]);

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isEmptyMessage,
    ref,
  };
};
