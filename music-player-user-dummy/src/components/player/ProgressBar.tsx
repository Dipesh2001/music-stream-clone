import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ProgressBar({ value, max, onChange }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] text-muted-foreground w-8 text-right">{formatTime(value)}</span>
      <Slider
        value={[value]}
        max={max || 100}
        step={1}
        onValueChange={([v]) => onChange(v)}
        className="flex-1"
      />
      <span className="text-[10px] text-muted-foreground w-8">{formatTime(max)}</span>
    </div>
  );
}
