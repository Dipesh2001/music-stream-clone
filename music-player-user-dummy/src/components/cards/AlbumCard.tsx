import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Album } from "@/types/album";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer rounded-lg bg-card/50 p-3 hover:bg-card transition-colors"
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-3">
        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold truncate">{album.title}</p>
      <p className="text-xs text-muted-foreground truncate">{album.artist.name} · {album.releaseYear}</p>
    </motion.div>
  );
}
