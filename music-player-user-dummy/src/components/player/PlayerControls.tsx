import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

export function PlayerControls() {
  const { isPlaying, togglePlay, playNext, playPrevious, volume, setVolume, shuffleEnabled, toggleShuffle, repeatMode, toggleRepeat, isLoadingAudio } = usePlayer();

  return (
    <div className="flex items-center gap-4 md:gap-6 justify-center w-full max-w-sm">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={toggleShuffle}
        className={`p-2 transition-colors ${shuffleEnabled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={playPrevious}
        className="p-2 hover:text-foreground text-muted-foreground transition-colors"
      >
        <SkipBack className="h-5 w-5 md:h-6 md:w-6 fill-current" />
      </motion.button>
      <motion.button
        whileTap={!isLoadingAudio ? { scale: 0.9 } : {}}
        onClick={() => { if (!isLoadingAudio) togglePlay(); }}
        className={`h-14 w-14 md:h-16 md:w-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg shrink-0 transition-all ${isLoadingAudio ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
      >
        {isLoadingAudio ? (
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full border-[3px] border-background border-t-transparent animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6 md:h-8 md:w-8 fill-current" />
        ) : (
          <Play className="h-6 w-6 md:h-8 md:w-8 fill-current flex-shrink-0 ml-1" />
        )}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={playNext}
        className="p-2 hover:text-foreground text-muted-foreground transition-colors"
      >
        <SkipForward className="h-5 w-5 md:h-6 md:w-6 fill-current" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={toggleRepeat}
        className={`p-2 transition-colors relative ${repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Repeat className="h-4 w-4 md:h-5 md:w-5" />
        {repeatMode === 'one' && (
          <span className="absolute top-1 right-1 text-[8px] font-bold">1</span>
        )}
      </motion.button>
      <div className="hidden md:flex items-center gap-2 ml-4 absolute right-8">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider value={[volume * 100]} max={100} step={1} onValueChange={([v]) => setVolume(v / 100)} className="w-24" />
      </div>
    </div>
  );
}
