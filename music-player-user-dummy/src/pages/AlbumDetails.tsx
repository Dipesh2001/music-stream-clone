import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play, AlertCircle } from "lucide-react";
import { useAlbumDetails } from "@/hooks/useHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import { usePlayer } from "@/hooks/usePlayer";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlbumDetails() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const { data: album, isLoading, error } = useAlbumDetails(id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <Skeleton className="h-48 w-48 rounded-xl" />
          <div className="space-y-2 flex-1 w-full">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? "Failed to load album." : "Album not found."}
          </AlertDescription>
        </Alert>
        <EmptyState title="Album not found" />
      </div>
    );
  }

  const tracks = Array.isArray(album.tracks) ? album.tracks : [];
  const imageUrl = album.coverImage?.startsWith('http')
    ? album.coverImage
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${album.coverImage}`;

  const artistName = album.artists?.map(a => a.name).join(", ") || "Unknown Artist";
  const releaseYear = album.releaseDate ? new Date(album.releaseDate).getFullYear() : "N/A";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-4 md:p-6 bg-gradient-to-b from-secondary/30 to-background">
        <img src={imageUrl} alt={album.title} className="h-48 w-48 rounded-xl object-cover shadow-lg bg-muted" />
        <div className="text-center md:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Album</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-1">{album.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">{artistName} · {releaseYear} · {tracks.length} songs</p>
        </div>
      </div>

      <div className="px-4 md:px-6 flex items-center gap-4">
        {tracks.length > 0 && (
          <button
            onClick={() => playTrack(tracks[0], tracks)}
            className="h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </button>
        )}
      </div>

      <div className="px-4 md:px-6 space-y-1">
        {tracks.map((track, i) => (
          <TrackRow key={track._id} track={track} index={i} trackList={tracks} />
        ))}
      </div>
    </motion.div>
  );
}
