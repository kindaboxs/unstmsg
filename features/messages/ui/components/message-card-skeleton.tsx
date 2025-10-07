import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  props?: React.ComponentProps<typeof Card>;
}

export const MessageCardSkeleton = ({ className, props }: Props) => {
  return (
    <Card className={cn("gap-4 py-4", className)} {...props}>
      <CardHeader className="px-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="space-y-2 px-4">
        <Skeleton className="h-4 w-[calc(100%-4rem)]" />
        <Skeleton className="h-4 w-[calc(100%-20rem)]" />
      </CardContent>
    </Card>
  );
};
