import { useRouter } from "next/navigation";

import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const MessageErrorState = () => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircleIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Oops! Failed to load messages</EmptyTitle>
        <EmptyDescription>Please try again later.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => router.refresh()}>
            <RefreshCcwIcon /> Retry
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
