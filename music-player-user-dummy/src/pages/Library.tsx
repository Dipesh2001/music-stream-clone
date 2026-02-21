import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyPlaylists } from "@/hooks/useHomeData";
import { PlaylistCard } from "@/components/cards/PlaylistCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Library() {
  const navigate = useNavigate();
  const { data: playlists, isLoading } = useMyPlaylists();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate("/library/liked")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <Heart className="h-4 w-4 text-primary" />
          Liked Songs
        </button>
      </div>

      {/* Playlists */}
      <section>
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : Array.isArray(playlists) && playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map((pl) => (
              <PlaylistCard key={pl._id} playlist={pl} />
            ))}
          </div>

        ) : (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
            <p className="italic">No playlists found. Create your first one!</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
