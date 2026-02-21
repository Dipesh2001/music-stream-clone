import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { Slider } from "@/components/ui/slider";

export function PlayerControls() {
  const { isPlaying, togglePlay, playNext, playPrevious, volume, setVolume } = usePlayer();

  return (
    <div className="flex items-center gap-3">
      <button onClick={playPrevious} className="p-1 hover:text-foreground text-muted-foreground transition-colors">
        <SkipBack className="h-5 w-5" />
      </button>
      <button
        onClick={togglePlay}
        className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>
      <button onClick={playNext} className="p-1 hover:text-foreground text-muted-foreground transition-colors">
        <SkipForward className="h-5 w-5" />
      </button>
      <div className="hidden md:flex items-center gap-2 ml-4">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider value={[volume * 100]} max={100} step={1} onValueChange={([v]) => setVolume(v / 100)} className="w-24" />
      </div>
    </div>
  );
}
