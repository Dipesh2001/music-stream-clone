import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Playlist } from "@/types/playlist";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const navigate = useNavigate();

  const imageUrl = playlist.coverImage?.startsWith('http')
    ? playlist.coverImage
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${playlist.coverImage || '/placeholder.svg'}`;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer rounded-lg bg-card/50 p-3 hover:bg-card transition-colors"
      onClick={() => navigate(`/playlist/${playlist._id || (playlist as any).id}`)}
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-3">
        <img src={imageUrl} alt={playlist.name} className="w-full h-full object-cover bg-muted" loading="lazy" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold truncate">{playlist.name}</p>
      <p className="text-xs text-muted-foreground truncate">{playlist.description || `Playlist · ${Array.isArray(playlist.tracks) ? playlist.tracks.length : 0} tracks`}</p>
    </motion.div>
  );
}
