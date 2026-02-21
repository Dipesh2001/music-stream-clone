import { motion } from "framer-motion";
import { Heart, Play, Pause, MoreHorizontal } from "lucide-react";
import type { Track } from "@/types/track";
import { usePlayer } from "@/hooks/usePlayer";
import { useState } from "react";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index?: number;
  trackList?: Track[];
}

export function TrackRow({ track, index, trackList }: TrackRowProps) {
  const { play, pause, currentTrack, isPlaying } = usePlayer();
  const isCurrentTrack = currentTrack?.id === track.id;
  const [liked, setLiked] = useState(track.isLiked);

  const handlePlay = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(track, trackList);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.04 }}
      className={`group flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer ${isCurrentTrack ? "bg-secondary/80" : ""}`}
      onClick={handlePlay}
    >
      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isCurrentTrack && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentTrack ? "text-primary" : ""}`}>{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist.name}</p>
      </div>

      <motion.button
        whileTap={{ scale: 1.4 }}
        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </motion.button>

      <span className="text-xs text-muted-foreground w-10 text-right">{formatDuration(track.duration)}</span>
    </motion.div>
  );
}
