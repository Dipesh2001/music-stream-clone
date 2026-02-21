import { CardSkeleton } from "./CardSkeleton";
import { TrackRowSkeleton } from "./TrackRowSkeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrackRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
