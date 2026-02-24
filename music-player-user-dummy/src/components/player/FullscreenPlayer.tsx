import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Heart, ListMusic } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { QueueList } from "./QueueList";
import { useState, useEffect } from "react";
import { useLibrary } from "@/context/LibraryContext";

export function FullscreenPlayer() {
  const { currentTrack, isFullscreen, toggleFullscreen, progress, duration, seek, bufferProgress } = usePlayer();
  const { isTrackLiked, toggleLike } = useLibrary();
  const [showQueue, setShowQueue] = useState(false);


  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col pt-safe"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (info.offset.y > 150 || info.velocity.y > 500) {
              toggleFullscreen();
            }
          }}
        >
          {/* Drag Handle for Mobile */}
          <div className="w-full h-8 flex justify-center items-center opacity-50 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity">
            <div className="w-12 h-1.5 bg-muted-foreground rounded-full" />
          </div>

          <div className="flex items-center justify-between px-4 pb-4">
            <button onClick={toggleFullscreen} className="p-2 hover:bg-secondary rounded-full">
              <ChevronDown className="h-6 w-6" />
            </button>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Now Playing</p>
            <button onClick={() => setShowQueue(!showQueue)} className="p-2 hover:bg-secondary rounded-full">
              <ListMusic className="h-5 w-5" />
            </button>
          </div>

          {showQueue ? (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="flex-1 overflow-y-auto px-4 pb-8"
            >
              <QueueList />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-6 md:gap-8 pb-4"
            >
              <motion.img
                src={currentTrack.album?.coverImage?.startsWith('http') ? currentTrack.album?.coverImage : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${currentTrack.album?.coverImage || '/placeholder.svg'}`}
                alt={currentTrack.title}
                className="w-full max-w-[16rem] sm:max-w-xs md:max-w-[24rem] lg:max-w-[28rem] aspect-square max-h-[40vh] md:max-h-[50vh] rounded-2xl object-cover shadow-2xl bg-muted shrink-0"
                layoutId="player-cover"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              />
              <div className="flex items-center justify-between w-full max-w-md shrink-0">
                <div className="text-left w-full overflow-hidden">
                  <h2 className="text-xl md:text-2xl font-bold truncate">{currentTrack.title}</h2>
                  <p className="text-base md:text-lg text-muted-foreground truncate">{currentTrack.artists?.map(a => a.name).join(", ") || "Unknown Artist"}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(currentTrack._id)}
                  className="p-3 shrink-0 ml-4 hover:bg-secondary/50 rounded-full transition-colors"
                >
                  <Heart className={`h-6 w-6 md:h-7 md:w-7 ${isTrackLiked(currentTrack._id) ? "fill-primary text-primary" : "text-muted-foreground hover:text-foreground"}`} />
                </motion.button>
              </div>
              <div className="w-full max-w-md mt-2 md:mt-4 shrink-0">
                <ProgressBar value={progress} max={duration} bufferProgress={bufferProgress} onChange={seek} />
              </div>
              <div className="mt-2 md:mt-4 w-full relative h-[60px] md:h-[80px] flex items-center justify-center shrink-0">
                <PlayerControls />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
