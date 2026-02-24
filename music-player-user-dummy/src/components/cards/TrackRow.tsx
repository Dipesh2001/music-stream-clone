import { motion } from "framer-motion";
import { Heart, Play, Pause } from "lucide-react";
import type { Track } from "@/types/track";
import { usePlayer } from "@/hooks/usePlayer";
import { useLibrary } from "@/context/LibraryContext";
import { TrackRowActions } from "./TrackRowActions";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index?: number;
  trackList?: Track[];
  playlistId?: string;
}

export function TrackRow({ track, index, trackList, playlistId }: TrackRowProps) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();
  const { isTrackLiked, toggleLike } = useLibrary();
  const isCurrentTrack = currentTrack?._id === track._id;
  const isLiked = isTrackLiked(track._id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };


  const imageUrl = track.album?.coverImage?.startsWith('http')
    ? track.album.coverImage
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${track.album?.coverImage}`;

  const artistName = track.artists?.map(a => a.name).join(", ") || "Unknown Artist";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.04 }}
      className={`group flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer ${isCurrentTrack ? "bg-secondary/80" : ""}`}
      onClick={handlePlay}
    >
      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
        <img src={imageUrl} alt={track.title} className="w-full h-full object-cover bg-muted" loading="lazy" />
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isCurrentTrack && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentTrack ? "text-primary" : ""}`}>{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{artistName}</p>
      </div>

      <motion.button
        whileTap={{ scale: 1.4 }}
        onClick={(e) => { e.stopPropagation(); toggleLike(track._id); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </motion.button>

      <span className="text-xs text-muted-foreground w-10 text-right">{formatDuration(track.duration)}</span>

      <div className="flex-shrink-0 w-8 flex items-center justify-center -mr-1">
        <TrackRowActions track={track} playlistId={playlistId} />
      </div>
    </motion.div>
  );
}
