import { motion } from "framer-motion";
import { useTrendingTracks, useLatestAlbums, useFeaturedArtists, useMyPlaylists } from "@/hooks/useHomeData";
import { CardCarousel } from "@/components/cards/CardCarousel";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { TrackRow } from "@/components/cards/TrackRow";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const { data: tracks, isLoading: tracksLoading, error: tracksError } = useTrendingTracks();
  const { data: albums, isLoading: albumsLoading, error: albumsError } = useLatestAlbums();
  const { data: artists, isLoading: artistsLoading, error: artistsError } = useFeaturedArtists();
  const { data: playlists, isLoading: playlistsLoading } = useMyPlaylists();

  const isLoading = tracksLoading || albumsLoading || artistsLoading;
  const error = tracksError || albumsError || artistsError;

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load home data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-1">Good evening</h1>
        <p className="text-muted-foreground text-sm mb-6">Pick up where you left off</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {playlistsLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))
          ) : (
            (Array.isArray(playlists) ? playlists : [])?.slice(0, 6).map((pl) => (
              <motion.div

                key={pl._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/80 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/playlist/${pl._id}`}
              >
                <img
                  src={pl.coverImage?.startsWith('http') ? pl.coverImage : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${pl.coverImage || '/placeholder.svg'}`}
                  className="h-14 w-14 object-cover bg-muted"
                  alt={pl.name}
                />
                <span className="text-sm font-semibold truncate pr-3">{pl.name}</span>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Popular Albums</h2>
        </div>
        {albumsLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="min-w-[160px] h-[220px] rounded-lg" />
            ))}
          </div>
        ) : (
          <CardCarousel title="">
            {albums?.map((album) => (
              <div key={album._id} className="min-w-[160px] max-w-[180px] snap-start flex-shrink-0">
                <AlbumCard album={album} />
              </div>
            ))}
          </CardCarousel>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured Artists</h2>
        </div>
        {artistsLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="min-w-[140px] h-[180px] rounded-lg" />
            ))}
          </div>
        ) : (
          <CardCarousel title="">
            {artists?.map((artist) => (
              <div key={artist._id} className="min-w-[140px] max-w-[160px] snap-start flex-shrink-0">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </CardCarousel>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Trending Tracks</h2>
        <div className="space-y-1">
          {tracksLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))
          ) : (
            tracks?.map((track, i) => (
              <TrackRow key={track._id} track={track} index={i} trackList={tracks} />
            ))
          )}
        </div>
      </section>
    </motion.div>
  );
}
