import { TrackRow } from "@/components/cards/TrackRow";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { ArtistCard } from "@/components/cards/ArtistCard";
import type { Track } from "@/types/track";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";
import { EmptyState } from "@/components/feedback/EmptyState";

interface SearchResultListProps {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  query: string;
}

export function SearchResultList({ tracks, albums, artists, query }: SearchResultListProps) {
  const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;

  if (!query) return null;
  if (!hasResults) return <EmptyState title="No results found" description={`We couldn't find anything for "${query}"`} />;

  return (
    <div className="space-y-8">
      {tracks.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Songs</h3>
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} trackList={tracks} />
            ))}
          </div>
        </section>
      )}
      {albums.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Albums</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
      {artists.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Artists</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
