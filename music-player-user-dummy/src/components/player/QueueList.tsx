import { TrackRow } from "@/components/cards/TrackRow";
import { usePlayer } from "@/hooks/usePlayer";

export function QueueList() {
  const { queue } = usePlayer();

  if (queue.length === 0) return <p className="text-sm text-muted-foreground p-4">Queue is empty</p>;

  return (
    <div className="space-y-1 p-4">
      <h3 className="text-lg font-semibold mb-3">Queue</h3>
      {queue.map((track, i) => (
        <TrackRow key={track._id} track={track} index={i} trackList={queue} />
      ))}
    </div>
  );
}
