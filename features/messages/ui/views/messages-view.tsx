"use client";

import { useMessages } from "@/features/messages/hooks/use-messages";
import { MessageCard } from "@/features/messages/ui/components/message-card";
import { MessageCardSkeleton } from "@/features/messages/ui/components/message-card-skeleton";
import { MessageEmptyState } from "@/features/messages/ui/components/message-empty-state";
import { MessageErrorState } from "@/features/messages/ui/components/message-error-state";

export const MessagesView = () => {
  const { data, isEmptyMessage, ref, hasNextPage, isFetchingNextPage } =
    useMessages();

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

export const MessagesViewError = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <MessageErrorState />
      </div>
    </div>
  );
};
