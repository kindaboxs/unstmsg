"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MessageType } from "@/features/messages/types";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

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
  const trpc = useTRPC();
  const { data: track, isLoading } = useQuery(
    trpc.spotify.getTrack?.queryOptions({ trackId: message.trackId })
  );

  return (
    <Card
      {...props}
      className={cn(
        "gap-4 py-4 transition-all duration-500 ease-in-out hover:scale-[1.025]",
        className
      )}
    >
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

      <Link href={`/messages/${message.id}`}>
        <CardContent className="h-[5rem] px-4">
          <p className="font-excalifont text-lg leading-6 text-pretty break-words">
            {truncateText(message.content, 100)}
          </p>
        </CardContent>
      </Link>

      {isLoading ? (
        <CardFooter className="w-full px-4">
          <div className="flex w-full items-center gap-x-4">
            <Skeleton className="size-12 shrink-0 rounded-md" />

            <div className="flex w-[calc(100%-4rem)] flex-col items-start space-y-2">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>

            <Skeleton className="ml-auto size-8 shrink-0 rounded-full" />
          </div>
        </CardFooter>
      ) : (
        <CardFooter className="w-full px-4">
          <div className="flex w-full items-center gap-x-4">
            <Avatar className="size-12 rounded-md">
              <AvatarImage src={track?.album.images[0].url} alt={track?.name} />
              <AvatarFallback className="size-12 rounded-md uppercase">
                {track?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-[calc(100%-8rem)] flex-col items-start space-y-1">
              <h3 className="w-full truncate text-base leading-none font-medium">
                {track?.name}
              </h3>
              <p className="text-muted-foreground w-full truncate text-sm">
                {track?.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>

            <div className="ml-auto size-6 shrink-0">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <title>Spotify</title>
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
