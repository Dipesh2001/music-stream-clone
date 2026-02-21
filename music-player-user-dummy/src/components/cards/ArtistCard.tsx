import { motion } from "framer-motion";
import type { Artist } from "@/types/artist";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer rounded-lg bg-card/50 p-3 hover:bg-card transition-colors text-center"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative aspect-square rounded-full overflow-hidden mb-3 mx-auto w-full max-w-[160px]">
        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className="text-sm font-semibold truncate">{artist.name}</p>
      <p className="text-xs text-muted-foreground">Artist</p>
    </motion.div>
  );
}
