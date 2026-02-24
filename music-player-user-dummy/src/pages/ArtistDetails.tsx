import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play, AlertCircle } from "lucide-react";
import { useArtistDetails } from "@/hooks/useHomeData";
import { TrackRow } from "@/components/cards/TrackRow";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { CardCarousel } from "@/components/cards/CardCarousel";
import { usePlayer } from "@/hooks/usePlayer";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ArtistDetails() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const { data: artist, isLoading, error } = useArtistDetails(id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-64 relative rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? "Failed to load artist." : "Artist not found."}
          </AlertDescription>
        </Alert>
        <EmptyState title="Artist not found" />
      </div>
    );
  }

  const tracks = artist.tracks || [];
  const albums = artist.albums || [];

  const imageUrl = artist.image?.startsWith('http')
    ? artist.image
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${artist.image}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      {/* Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={imageUrl} alt={artist.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-6 md:bottom-8 md:right-8 lg:left-12 lg:right-auto">
          <h1 className="text-4xl md:text-6xl font-black">{artist.name}</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg hidden md:block">{artist.bio}</p>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-12 space-y-8">
        {/* Actions */}
        <div className="flex items-center gap-4">
          {tracks.length > 0 && (
            <button
              onClick={() => playTrack(tracks[0], tracks)}
              className="h-14 w-14 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              <Play className="h-7 w-7 text-primary-foreground fill-current" />
            </button>
          )}
          <button className="px-6 py-2 rounded-full border border-border font-semibold hover:bg-secondary transition-colors">
            Follow
          </button>
        </div>

        {/* Popular Tracks */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackRow key={track._id} track={track} index={i} trackList={tracks} />
            ))}
          </div>
        </section>

        {/* Discography */}
        {albums.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Discography</h2>
            <CardCarousel title="">
              {albums.map((album) => (
                <div key={album._id} className="min-w-[160px] max-w-[180px] snap-start flex-shrink-0">
                  <AlbumCard album={album} />
                </div>
              ))}
            </CardCarousel>
          </section>
        )}
      </div>
    </motion.div>
  );
}
