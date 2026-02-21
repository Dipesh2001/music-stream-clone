import type { Track } from "@/types/track";

interface NowPlayingProps {
  track: Track;
}

export function NowPlaying({ track }: NowPlayingProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <img src={track.coverUrl} alt={track.title} className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist.name}</p>
      </div>
    </div>
  );
}
