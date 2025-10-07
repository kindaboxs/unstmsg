import { formatDistance } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MessageType } from "@/features/messages/types";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  props?: React.ComponentProps<typeof Card>;
  message: MessageType;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const MessageCard = ({ className, props, message }: Props) => {
  return (
    <Card {...props} className={cn("gap-2 py-4", className)}>
      <CardHeader className="px-4">
        <CardTitle>
          <Badge variant="secondary" className="font-semibold">
            To: {message.to}
          </Badge>
        </CardTitle>
        <CardDescription>
          from: <span className="font-medium">{message.from}</span> |{" "}
          <time dateTime={message.createdAt.toISOString()}>
            {formatDistance(message.createdAt, new Date(), { addSuffix: true })}
          </time>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4">
        <p className="leading-6 text-pretty">
          {truncateText(message.content, 100)}
        </p>
      </CardContent>
    </Card>
  );
};
