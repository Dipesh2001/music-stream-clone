import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { MiniPlayer } from "./MiniPlayer";
import { FullscreenPlayer } from "@/components/player/FullscreenPlayer";
import { usePlayer } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function AppLayout() {
  const { currentTrack } = usePlayer();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <motion.main
          className={`flex-1 overflow-y-auto ${currentTrack ? "pb-24 md:pb-20" : "pb-16 md:pb-0"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Outlet />
        </motion.main>
      </div>
      <MiniPlayer />
      <FullscreenPlayer />
      <BottomNav />
    </div>
  );
}
