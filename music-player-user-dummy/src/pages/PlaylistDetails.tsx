import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { mockPlaylists, mockTracks } from "@/hooks/useFetchHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import { usePlayer } from "@/hooks/usePlayer";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { play } = usePlayer();
  const playlist = mockPlaylists.find((p) => p.id === id);

  if (!playlist) return <EmptyState title="Playlist not found" />;

  const tracks = playlist.tracks.length > 0 ? playlist.tracks : mockTracks.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-4 md:p-6 bg-gradient-to-b from-secondary/30 to-background">
        <img src={playlist.coverUrl || "/placeholder.svg"} alt={playlist.title} className="h-48 w-48 rounded-xl object-cover shadow-lg" />
        <div className="text-center md:text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-1">{playlist.title}</h1>
          {playlist.description && <p className="text-sm text-muted-foreground mt-2">{playlist.description}</p>}
          <p className="text-sm text-muted-foreground mt-1">{playlist.owner.name} · {tracks.length} songs</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 md:px-6 flex items-center gap-4">
        <button onClick={() => play(tracks[0], tracks)} className="h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
          <Play className="h-6 w-6 text-primary-foreground fill-current" />
        </button>
      </div>

      {/* Track list */}
      <div className="px-4 md:px-6 space-y-1">
        {tracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i} trackList={tracks} />
        ))}
      </div>
    </motion.div>
  );
}
