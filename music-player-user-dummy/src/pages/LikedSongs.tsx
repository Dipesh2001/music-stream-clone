import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { mockTracks } from "@/hooks/useFetchHomeData";
import { TrackRow } from "@/components/cards/TrackRow";

export default function LikedSongs() {
  const liked = mockTracks.filter((t) => t.isLiked);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center flex-shrink-0">
          <Heart className="h-16 w-16 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-extrabold">Liked Songs</h1>
          <p className="text-sm text-muted-foreground mt-1">{liked.length} songs</p>
        </div>
      </div>
      <div className="space-y-1">
        {liked.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} trackList={liked} />
        ))}
      </div>
    </motion.div>
  );
}
