import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-lg shimmer" />
      <Skeleton className="h-4 w-3/4 shimmer" />
      <Skeleton className="h-3 w-1/2 shimmer" />
    </div>
  );
}
