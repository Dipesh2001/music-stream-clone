import { usePlayer } from "@/hooks/usePlayer";
import { Play, Pause, SkipForward, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLibrary } from "@/context/LibraryContext";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, toggleFullscreen, progress, duration, isFullscreen, isLoadingAudio, bufferProgress } = usePlayer();
  const { isTrackLiked, toggleLike } = useLibrary();

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
          <div className="h-[2px] bg-secondary w-full relative">
            <div className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-300" style={{ width: `${bufferProgress}%` }} />
            <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto cursor-pointer" onClick={toggleFullscreen}>
            <img src={displayTrack.coverUrl} alt={displayTrack.title} className="h-10 w-10 rounded-md object-cover flex-shrink-0 bg-muted" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{displayTrack.artist.name}</p>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { if (currentTrack) toggleLike(currentTrack._id); }}
                className="p-2 hover:bg-secondary rounded-full transition-colors mr-1 sm:mr-2"
              >
                <Heart className={`h-5 w-5 ${isTrackLiked(currentTrack?._id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
              <button
                onClick={() => { if (currentTrack && !isLoadingAudio) { togglePlay(); } }}
                className={`p-2 rounded-full transition-colors ${isLoadingAudio ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}`}
                disabled={isLoadingAudio}
              >
                {isLoadingAudio ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
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
