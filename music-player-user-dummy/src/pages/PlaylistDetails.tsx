import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play, Clock, AlertCircle } from "lucide-react";
import { usePlaylistDetails } from "@/hooks/useHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import type { Track } from "@/types/track";

import { usePlayer } from "@/hooks/usePlayer";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const { data: playlist, isLoading, error } = usePlaylistDetails(id);

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

  if (error || !playlist) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? "Failed to load playlist." : "Playlist not found."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <EmptyState title="Playlist not found" description="The playlist you're looking for doesn't exist or you don't have access." />
        </div>
      </div>
    );
  }

  const tracks = (playlist.tracks as any[])?.filter(t => typeof t !== 'string') as Track[] || [];


  const imageUrl = playlist.coverImage?.startsWith('http')
    ? playlist.coverImage
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${playlist.coverImage || '/placeholder.svg'}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-4 md:p-6 bg-gradient-to-b from-secondary/30 to-background">
        <img src={imageUrl} alt={playlist.name} className="h-48 w-48 rounded-xl object-cover shadow-lg bg-muted" />
        <div className="text-center md:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-1">{playlist.name}</h1>
          {playlist.description && <p className="text-sm text-muted-foreground mt-2">{playlist.description}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            {playlist.owner?.name || "Unknown Owner"} · {tracks.length} songs
          </p>
        </div>
      </div>

      {/* Actions */}
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

      {/* Track list */}
      <div className="px-4 md:px-6 space-y-1">
        {tracks.length > 0 ? (
          tracks.map((track, i) => (
            <TrackRow key={track._id} track={track} index={i} trackList={tracks} playlistId={playlist._id} />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground italic">
            This playlist is empty.
          </div>
        )}
      </div>
    </motion.div>
  );
}
