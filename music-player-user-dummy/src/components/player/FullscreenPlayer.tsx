import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Heart, ListMusic } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { QueueList } from "./QueueList";
import { useState } from "react";

export function FullscreenPlayer() {
  const { currentTrack, isFullscreen, toggleFullscreen, progress, duration, seek } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleFullscreen} className="p-2 hover:bg-secondary rounded-full">
              <ChevronDown className="h-6 w-6" />
            </button>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Now Playing</p>
            <button onClick={() => setShowQueue(!showQueue)} className="p-2 hover:bg-secondary rounded-full">
              <ListMusic className="h-5 w-5" />
            </button>
          </div>

          {showQueue ? (
            <div className="flex-1 overflow-y-auto">
              <QueueList />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
              <motion.img
                src={currentTrack.album?.coverImage?.startsWith('http') ? currentTrack.album?.coverImage : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${currentTrack.album?.coverImage || '/placeholder.svg'}`}
                alt={currentTrack.title}
                className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl bg-muted"
                layoutId="player-cover"
              />
              <div className="text-center w-full max-w-md">
                <h2 className="text-2xl font-bold truncate">{currentTrack.title}</h2>
                <p className="text-muted-foreground">{currentTrack.artists?.map(a => a.name).join(", ") || "Unknown Artist"}</p>
              </div>
              <div className="w-full max-w-md">
                <ProgressBar value={progress} max={duration} onChange={seek} />
              </div>
              <PlayerControls />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
