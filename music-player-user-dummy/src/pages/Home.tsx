import { motion } from "framer-motion";
import { useFetchHomeData } from "@/hooks/useFetchHomeData";
import { CardCarousel } from "@/components/cards/CardCarousel";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { PlaylistCard } from "@/components/cards/PlaylistCard";
import { TrackRow } from "@/components/cards/TrackRow";

export default function Home() {
  const { tracks, albums, artists, playlists } = useFetchHomeData();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-1">Good evening</h1>
        <p className="text-muted-foreground text-sm mb-6">Pick up where you left off</p>
        {/* Quick-play grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {playlists.slice(0, 6).map((pl) => (
            <motion.div
              key={pl.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/80 transition-colors cursor-pointer"
              onClick={() => window.location.href = `/playlist/${pl.id}`}
            >
              <img src={pl.coverUrl || "/placeholder.svg"} className="h-14 w-14 object-cover" alt={pl.title} />
              <span className="text-sm font-semibold truncate pr-3">{pl.title}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <CardCarousel title="Popular Albums">
        {albums.map((album) => (
          <div key={album.id} className="min-w-[160px] max-w-[180px] snap-start flex-shrink-0">
            <AlbumCard album={album} />
          </div>
        ))}
      </CardCarousel>

      <CardCarousel title="Featured Artists">
        {artists.map((artist) => (
          <div key={artist.id} className="min-w-[140px] max-w-[160px] snap-start flex-shrink-0">
            <ArtistCard artist={artist} />
          </div>
        ))}
      </CardCarousel>

      <section>
        <h2 className="text-xl font-bold mb-3">Trending Tracks</h2>
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} trackList={tracks} />
          ))}
        </div>
      </section>

      <CardCarousel title="Your Playlists">
        {playlists.map((pl) => (
          <div key={pl.id} className="min-w-[160px] max-w-[180px] snap-start flex-shrink-0">
            <PlaylistCard playlist={pl} />
          </div>
        ))}
      </CardCarousel>
    </motion.div>
  );
}
