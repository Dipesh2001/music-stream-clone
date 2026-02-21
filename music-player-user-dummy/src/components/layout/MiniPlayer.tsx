import { usePlayer } from "@/hooks/usePlayer";
import { Play, Pause, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, toggleFullscreen, progress, duration, isFullscreen } = usePlayer();

  if (isFullscreen) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const imageUrl = currentTrack?.album?.coverImage?.startsWith('http')
    ? currentTrack.album.coverImage
    : currentTrack?.album?.coverImage
      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${currentTrack.album.coverImage}`
      : "/placeholder.svg";

  const artistName = currentTrack?.artists?.map(a => a.name).join(", ") || "Unknown Artist";

  const displayTrack = {
    title: currentTrack?.title || "No track playing",
    artist: { name: artistName },
    coverUrl: imageUrl,
  };

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 glass border-t border-border/50"
        >
          {/* Progress bar line at top */}
          <div className="h-0.5 bg-secondary w-full">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto cursor-pointer" onClick={toggleFullscreen}>
            <img src={displayTrack.coverUrl} alt={displayTrack.title} className="h-10 w-10 rounded-md object-cover flex-shrink-0 bg-muted" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{displayTrack.artist.name}</p>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { if (currentTrack) { togglePlay(); } }}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button onClick={() => { if (currentTrack) playNext(); }} className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:block">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
