import Link from "next/link";

import { MessageCircleMoreIcon, MessageCirclePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const MessageEmptyState = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleMoreIcon />
        </EmptyMedia>
        <EmptyTitle>No Messages Yet</EmptyTitle>
        <EmptyDescription>
          Get started by creating your first message.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/messages/write">
              <MessageCirclePlusIcon />
              Create Message
            </Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
