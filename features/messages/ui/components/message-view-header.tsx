"use client";

import { XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMessageFilters } from "@/features/messages/hooks/use-message-filters";
import { MessageSearchFilter } from "@/features/messages/ui/components/message-search-filter";

export const MessageViewHeader = () => {
  const [filters, setFilters] = useMessageFilters();

  const isAnyFiltersModified = filters.search;

  const onClearFilters = async () => {
    await setFilters({ search: "" });
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Read what they never said
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          wander through the messages — maybe one of them was meant for you.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <MessageSearchFilter />
        <Button
          variant="outline"
          onClick={onClearFilters}
          disabled={!isAnyFiltersModified}
        >
          <XCircleIcon /> Clear
        </Button>
      </div>
    </div>
  );
};
