import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  value: number;
  max: number;
  bufferProgress?: number;
  onChange: (v: number) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ProgressBar({ value, max, bufferProgress = 0, onChange }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] text-muted-foreground w-8 text-right">{formatTime(value)}</span>
      <div className="relative flex-1 flex items-center h-4">
        <div className="absolute inset-x-0 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary/20 transition-all duration-300" style={{ width: `${bufferProgress}%` }} />
        </div>
        <Slider
          value={[value]}
          max={max || 100}
          step={1}
          onValueChange={([v]) => onChange(v)}
          className="absolute inset-x-0 z-10"
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-8">{formatTime(max)}</span>
    </div>
  );
}
