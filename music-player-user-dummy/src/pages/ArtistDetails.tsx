import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play } from "lucide-react";
import { mockArtists, mockTracks, mockAlbums } from "@/hooks/useFetchHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { usePlayer } from "@/hooks/usePlayer";
import { EmptyState } from "@/components/feedback/EmptyState";

function formatListeners(n?: number) {
  if (!n) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M monthly listeners`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K monthly listeners`;
  return `${n} monthly listeners`;
}

export default function ArtistDetails() {
  const { id } = useParams();
  const { play } = usePlayer();
  const artist = mockArtists.find((a) => a.id === id);

  if (!artist) return <EmptyState title="Artist not found" />;

  const topTracks = mockTracks.filter((t) => t.artist.id === artist.id);
  const albums = mockAlbums.filter((a) => a.artist.id === artist.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-6 left-6 space-y-1">
          <h1 className="text-4xl md:text-6xl font-extrabold">{artist.name}</h1>
          <p className="text-sm text-muted-foreground">{formatListeners(artist.monthlyListeners)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 md:px-6 flex items-center gap-4">
        <button onClick={() => topTracks[0] && play(topTracks[0], topTracks)} className="h-12 w-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
          <Play className="h-6 w-6 text-primary-foreground fill-current" />
        </button>
      </div>

      {/* Top tracks */}
      {topTracks.length > 0 && (
        <section className="px-4 md:px-6">
          <h2 className="text-xl font-bold mb-3">Popular</h2>
          <div className="space-y-1">
            {topTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} trackList={topTracks} />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section className="px-4 md:px-6">
          <h2 className="text-xl font-bold mb-3">Discography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* Bio */}
      {artist.bio && (
        <section className="px-4 md:px-6">
          <h2 className="text-xl font-bold mb-3">About</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">{artist.bio}</p>
        </section>
      )}
    </motion.div>
  );
}
