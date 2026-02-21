import { usePlayer } from "@/hooks/usePlayer";
import { Play, Pause, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, next, toggleFullscreen, progress, duration, isFullscreen } = usePlayer();

  if (!currentTrack || isFullscreen) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        className="fixed bottom-0 md:bottom-0 left-0 right-0 z-40 glass border-t border-border/50"
      >
        {/* Progress bar line at top */}
        <div className="h-0.5 bg-secondary w-full">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto" onClick={toggleFullscreen}>
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="h-10 w-10 rounded-md object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist.name}</p>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={isPlaying ? pause : resume}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={next} className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:block">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
