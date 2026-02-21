import { motion } from "framer-motion";
import { Heart, Clock, ListMusic, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPlaylists } from "@/hooks/useFetchHomeData";
import { PlaylistCard } from "@/components/cards/PlaylistCard";

export default function Library() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Library</h1>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Liked Songs", icon: Heart, to: "/library/liked" },
        ].map(({ label, icon: Icon, to }) => (
          <button key={to} onClick={() => navigate(to)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </button>
        ))}
      </div>

      {/* Playlists */}
      <section>
        <h2 className="text-xl font-bold mb-3">Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockPlaylists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
