import { Skeleton } from "@/components/ui/skeleton";

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md">
      <Skeleton className="h-10 w-10 rounded shimmer" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-2/3 shimmer" />
        <Skeleton className="h-3 w-1/3 shimmer" />
      </div>
      <Skeleton className="h-3 w-8 shimmer" />
    </div>
  );
}
