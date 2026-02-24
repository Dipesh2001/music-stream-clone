import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { libraryService } from "@/services/library.service";
import { useAuth } from "@/hooks/useAuth";
import type { Favorite, Playlist, PlayHistoryItem } from "@/types/library";

interface LibraryContextValue {
    favorites: Favorite[];
    playlists: Playlist[];
    recentlyPlayed: PlayHistoryItem[];
    isLoading: boolean;
    refreshLibrary: () => Promise<void>;
    toggleLike: (trackId: string) => Promise<void>;
    isTrackLiked: (trackId?: string) => boolean;
    recordPlayHistory: (trackId: string) => Promise<void>;
    createPlaylist: (name: string, desc?: string, isPublic?: boolean) => Promise<void>;
    addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

/**
 * JUSTIFICATION:
 * User library states (likes, playlists, history) are housed in LibraryContext rather than PlayerContext.
 * This ensures strict separation of concerns where PlayerContext focuses solely on audio streaming and 
 * playback queue, while LibraryContext handles remote DB sync, caching, and optimistic UI mutations across
 * the app. This prevents the Player engine from re-rendering whenever the user likes a random track in a list.
 */
export function LibraryProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState<PlayHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshLibrary = useCallback(async () => {
        if (!isAuthenticated) {
            setFavorites([]);
            setPlaylists([]);
            setRecentlyPlayed([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const [fav, pl, hist] = await Promise.all([
                libraryService.getFavorites(),
                libraryService.getPlaylists(),
                libraryService.getRecentlyPlayed(),
            ]);

            setFavorites(fav.data as any); // Types match structurally
            setPlaylists(pl.data as any);
            setRecentlyPlayed(hist.data as any);
        } catch (error) {
            console.error("Failed to load library:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Initial fetch
    useEffect(() => {
        refreshLibrary();
    }, [refreshLibrary]);

    const isTrackLiked = useCallback((trackId?: string) => {
        if (!trackId) return false;
        return favorites.some(f => f.track?._id === trackId);
    }, [favorites]);

    const toggleLike = useCallback(async (trackId: string) => {
        const currentlyLiked = isTrackLiked(trackId);

        // Optimistic UI update
        if (currentlyLiked) {
            setFavorites(prev => prev.filter(f => f.track?._id !== trackId));
        } else {
            // Fake favorite to immediately reflect UI
            const fakeFav = { _id: "temp", user: "me", track: { _id: trackId } } as any;
            setFavorites(prev => [...prev, fakeFav]);
        }

        try {
            await libraryService.toggleFavorite(trackId, currentlyLiked);
            // We could refresh silently after success to get exact IDs but optimistic is fine for now
            if (!currentlyLiked) {
                // Background refresh ensures we replace 'temp' ID with real _id later
                libraryService.getFavorites().then(res => setFavorites(res.data as any));
            }
        } catch (err) {
            // Rollback
            console.error("Failed to toggle like:", err);
            libraryService.getFavorites().then(res => setFavorites(res.data as any));
        }
    }, [isTrackLiked]);

    const recordPlayHistory = useCallback(async (trackId: string) => {
        try {
            await libraryService.recordPlay(trackId);
            const hist = await libraryService.getRecentlyPlayed();
            setRecentlyPlayed(hist.data as any);
        } catch (err) {
            console.error("Failed to record play:", err);
        }
    }, []);

    const createPlaylist = useCallback(async (name: string, desc?: string, isPublic = false) => {
        const res = await libraryService.createPlaylist({ name, description: desc, isPublic });
        setPlaylists(prev => [...prev, res.data as any]);
    }, []);

    const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
        const res = await libraryService.addTrackToPlaylist(playlistId, trackId);
        setPlaylists(prev => prev.map(p => p._id === playlistId ? res.data as any : p));
    }, []);

    const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
        const res = await libraryService.removeTrackFromPlaylist(playlistId, trackId);
        setPlaylists(prev => prev.map(p => p._id === playlistId ? res.data as any : p));
    }, []);

    return (
        <LibraryContext.Provider value={{
            favorites, playlists, recentlyPlayed, isLoading,
            refreshLibrary, toggleLike, isTrackLiked, recordPlayHistory,
            createPlaylist, addTrackToPlaylist, removeTrackFromPlaylist
        }}>
            {children}
        </LibraryContext.Provider>
    );
}

export function useLibrary() {
    const ctx = useContext(LibraryContext);
    if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
    return ctx;
}
