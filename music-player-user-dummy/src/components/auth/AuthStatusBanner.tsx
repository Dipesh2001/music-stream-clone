import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTrendingTracks, useLatestAlbums, useFeaturedArtists } from "@/hooks/useHomeData";
import { usePlayer } from "@/hooks/usePlayer";

// TEMP: remove after player verification
export function AuthStatusBanner() {
    const { isAuthenticated, user } = useAuth();
    const [tokenPresent, setTokenPresent] = useState(false);
    const location = useLocation();

    // Data trace
    const { data: trendingTracks } = useTrendingTracks();
    const { data: latestAlbums } = useLatestAlbums();
    const { data: featuredArtists } = useFeaturedArtists();

    // Player debug
    const { currentTrack, isPlaying, queue, currentIndex } = usePlayer();

    // Update live
    useEffect(() => {
        const checkToken = () => {
            setTokenPresent(!!getAccessToken());
        };
        checkToken();
        const interval = setInterval(checkToken, 1000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const isAppLayoutRendered = isAuthenticated;

    return (
        <div className="fixed top-0 left-0 z-[9999] w-full bg-black/90 text-white text-[10px] md:text-xs p-1 px-2 md:px-4 flex flex-col md:flex-row gap-2 md:justify-between items-center font-mono border-b border-primary/20">
            <div className="flex gap-2 items-center flex-wrap">
                <span className="font-bold text-yellow-500">TEMP STATUS:</span>
                <span>Route: <span className="text-cyan-400">{location.pathname}</span></span>

                <div className="flex gap-3 border-x border-white/10 px-3">
                    <span className="text-green-500 underline">Seed Status: DONE</span>
                    <span>Tracks: <span className="text-cyan-400">{trendingTracks?.length || 0}</span></span>
                    <span>Albums: <span className="text-cyan-400">{latestAlbums?.length || 0}</span></span>
                    <span>Artists: <span className="text-cyan-400">{featuredArtists?.length || 0}</span></span>
                </div>

                <div className="flex gap-2 border-r border-white/10 pr-3">
                    <span>Track: <span className="text-[#a855f7] font-bold">{currentTrack?.title || "NONE"}</span></span>
                    <span>Queue: <span className="text-[#a855f7]">{queue.length}</span></span>
                    <span>Idx: <span className="text-[#a855f7]">{currentIndex}</span></span>
                    <span>Play: <span className={isPlaying ? "text-green-400" : "text-red-400"}>{isPlaying ? "YES" : "NO"}</span></span>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <span className={isAppLayoutRendered ? "text-green-400" : "text-red-400"}>
                    Layout: {isAppLayoutRendered ? "YES" : "NO"}
                </span>
                <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
                    Auth: {isAuthenticated ? "YES" : "NO"}
                </span>
                <span className={tokenPresent ? "text-green-400" : "text-red-400"}>
                    Token: {tokenPresent ? "YES" : "NO"}
                </span>
                <span className="hidden lg:inline text-white/50">{user?.email || "N/A"}</span>
            </div>
        </div>
    );
}
