import { useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLibrary } from "@/context/LibraryContext";
import { toast } from "sonner";
import type { Track } from "@/types/track";

export function TrackRowActions({ track, playlistId }: { track: Track; playlistId?: string }) {
    const { playlists, addTrackToPlaylist, removeTrackFromPlaylist } = useLibrary();
    const [opening, setOpening] = useState(false);

    const handleAdd = async (e: React.MouseEvent, pId: string) => {
        e.stopPropagation();
        try {
            await addTrackToPlaylist(pId, track._id);
            toast.success("Added to playlist");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add track");
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!playlistId) return;
        try {
            await removeTrackFromPlaylist(playlistId, track._id);
            toast.success("Removed from playlist");
        } catch (err) {
            toast.error("Failed to remove track");
        }
    };

    const userPlaylists = playlists.filter(p => !p.isPublic || p.owner); // simple filter, might need robust ownership check if 'owner' isn't available

    return (
        <DropdownMenu onOpenChange={setOpening}>
            <DropdownMenuTrigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">

                {playlistId && (
                    <DropdownMenuItem onClick={handleRemove} className="text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove from this playlist
                    </DropdownMenuItem>
                )}

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                        {userPlaylists.length === 0 && (
                            <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
                        )}
                        {userPlaylists.map(pl => {
                            const inPlaylist = pl.tracks.some(t => {
                                if (typeof t === "string") return t === track._id;
                                return t._id === track._id;
                            });

                            return (
                                <DropdownMenuItem
                                    key={pl._id}
                                    disabled={inPlaylist}
                                    onClick={(e) => handleAdd(e as any, pl._id)}
                                    className="cursor-pointer"
                                >
                                    <span className="truncate">{pl.name}</span>
                                    {inPlaylist && <span className="ml-auto text-xs text-muted-foreground">Added</span>}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
