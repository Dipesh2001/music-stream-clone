import { motion } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultList } from "@/components/search/SearchResultList";
import { useMusicSearch } from "@/hooks/useHomeData";
import { Loader2 } from "lucide-react";

export default function Search() {
  const { query, setQuery, debouncedQuery } = useSearch();
  const { data: results, isLoading } = useMusicSearch(debouncedQuery);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <SearchBar value={query} onChange={setQuery} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Searching for "{debouncedQuery}"...</p>
        </div>
      ) : debouncedQuery ? (
        <SearchResultList
          tracks={results?.tracks || []}
          albums={results?.albums || []}
          artists={results?.artists || []}
          query={debouncedQuery}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Dummy data commented out as requested
            {[
              { genre: "Pop", color: "bg-pink-600" },
              { genre: "Rock", color: "bg-red-700" },
              { genre: "Electronic", color: "bg-purple-600" },
              { genre: "Hip-Hop", color: "bg-orange-600" },
              { genre: "Jazz", color: "bg-blue-600" },
              { genre: "Classical", color: "bg-amber-600" },
              { genre: "R&B", color: "bg-indigo-600" },
              { genre: "Indie", color: "bg-emerald-600" },
            ].map(({ genre, color }) => (
              <motion.div
                key={genre}
                whileHover={{ scale: 1.03 }}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden cursor-pointer ${color} p-4`}
              >
                <span className="text-xl font-bold text-white">{genre}</span>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-2xl" />
              </motion.div>
            ))}
            */}
          </div>
        </div>
      )}
    </motion.div>
  );
}
