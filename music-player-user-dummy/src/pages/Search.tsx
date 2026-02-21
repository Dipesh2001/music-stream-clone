import { motion } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultList } from "@/components/search/SearchResultList";
import { mockTracks, mockAlbums, mockArtists } from "@/hooks/useFetchHomeData";

export default function Search() {
  const { query, setQuery, debouncedQuery } = useSearch();

  // Mock filter—replace with API call
  const filteredTracks = mockTracks.filter((t) => t.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || t.artist.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
  const filteredAlbums = mockAlbums.filter((a) => a.title.toLowerCase().includes(debouncedQuery.toLowerCase()));
  const filteredArtists = mockArtists.filter((a) => a.name.toLowerCase().includes(debouncedQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <SearchBar value={query} onChange={setQuery} />
      {debouncedQuery ? (
        <SearchResultList tracks={filteredTracks} albums={filteredAlbums} artists={filteredArtists} query={debouncedQuery} />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {["Pop", "Rock", "Electronic", "Hip-Hop", "Jazz", "Classical", "R&B", "Indie"].map((genre) => (
              <motion.div
                key={genre}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-[16/10] rounded-lg overflow-hidden cursor-pointer"
                style={{
                  background: `hsl(${Math.random() * 360}, 60%, 30%)`,
                }}
              >
                <span className="absolute bottom-3 left-3 text-lg font-bold text-foreground">{genre}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
