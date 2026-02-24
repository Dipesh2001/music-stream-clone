import { motion } from "framer-motion";
import { Heart, Play, Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/useHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import { usePlayer } from "@/hooks/usePlayer";
import { Skeleton } from "@/components/ui/skeleton";

export default function LikedSongs() {
  const { data: favorites, isLoading } = useFavorites();
  const { playTrack } = usePlayer();

  const likedTracks = favorites?.tracks || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6 pb-20">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
        <div className="h-32 w-32 md:h-48 md:w-48 rounded-xl bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
          <Heart className="h-16 w-16 md:h-24 md:w-24 text-primary-foreground fill-current" />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Liked Songs</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{likedTracks.length} songs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {likedTracks.length > 0 && (
          <button
            onClick={() => playTrack(likedTracks[0], likedTracks)}
            className="h-14 w-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            <Play className="h-7 w-7 text-primary-foreground fill-current" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))
        ) : likedTracks.length > 0 ? (
          likedTracks.map((track, i) => (
            <TrackRow key={track._id} track={track} index={i} trackList={likedTracks} />
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl border-border">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="italic">Songs you like will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
