"use client";

import { useEffect, useState } from "react";

import { skipToken, useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

interface Props {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

export const SpotifySearchDialog = ({ onChange, value, disabled }: Props) => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pickedTrackId, setPickedTrackId] = useState<string>("");

  // Sync pickedTrackId with incoming value prop
  useEffect(() => {
    if (pickedTrackId !== value) {
      setPickedTrackId(value || "");
    }
  }, [value, pickedTrackId]);

  const trpc = useTRPC();
  const searchTracksData = useQuery(
    trpc.spotify.searchTrack.queryOptions(
      searchQuery ? { query: searchQuery } : skipToken
    )
  );
  const { data: trackData } = useQuery(
    trpc.spotify.getTrack.queryOptions(
      pickedTrackId ? { trackId: pickedTrackId } : skipToken
    )
  );

  const isLoadingSearch = searchTracksData.isLoading;

  return (
    <Popover open={openSearch} onOpenChange={setOpenSearch}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value ? "text-muted-foreground" : "h-16"
          )}
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-x-2">
              <Avatar className="size-12 rounded-md">
                <AvatarImage
                  src={trackData?.album.images[0].url}
                  alt={trackData?.name}
                />
                <AvatarFallback className="size-12 rounded-md uppercase">
                  {trackData?.artists[0].name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex shrink-0 flex-col items-start space-y-1">
                <h3 className="max-w-44 flex-1 truncate text-sm leading-none font-medium sm:max-w-64 md:max-w-80 lg:max-w-full">
                  {trackData?.name}
                </h3>
                <p className="text-muted-foreground max-w-44 flex-1 truncate text-xs sm:max-w-64 md:max-w-80 lg:max-w-full">
                  {trackData?.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>
          ) : (
            "Search Track"
          )}

          <ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="h-[14rem] w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search Track..."
            value={searchQuery}
            onValueChange={(search) => setSearchQuery(search)}
          />

          <CommandList>
            {isLoadingSearch ? (
              <CommandGroup>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CommandItem key={index}>
                    <div className="flex w-full items-center gap-x-2">
                      <div className="shrink-0">
                        <Skeleton className="size-12 rounded-md" />
                      </div>

                      <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <Skeleton className="h-3 w-1/3 rounded" />
                      </div>
                    </div>

                    <Loader2Icon className="ml-auto size-4 animate-spin opacity-50" />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : searchTracksData.data ? (
              <CommandGroup>
                {searchTracksData.data.items.map((track) => (
                  <CommandItem
                    key={track.id}
                    value={`${track.id}-${track.name}-${track.artists[0].name}`}
                    onSelect={() => {
                      onChange(track.id);
                      setPickedTrackId(track.id);
                      setOpenSearch(false);
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      <div className="shrink-0">
                        <Avatar className="size-12 rounded-md">
                          <AvatarImage
                            src={track.album.images[0].url}
                            alt={track.name}
                          />

                          <AvatarFallback className="size-12 rounded-md uppercase">
                            {track.artists[0].name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="space-y-1">
                        <h3 className="line-clamp-1 text-base leading-none font-medium">
                          {track.name}
                        </h3>
                        <p className="text-muted-foreground line-clamp-1 text-sm">
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                      </div>
                    </div>

                    <CheckIcon
                      className={cn(
                        "ml-auto",
                        value === track.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
