import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLibrary } from "@/context/LibraryContext";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreatePlaylistDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const { createPlaylist } = useLibrary();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            setLoading(true);
            await createPlaylist(name.trim());
            toast.success("Playlist created");
            setOpen(false);
            setName("");
        } catch (error) {
            toast.error("Failed to create playlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="p-1 rounded hover:bg-secondary text-muted-foreground flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <Input
                        placeholder="My awesome playlist"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={!name.trim() || loading}>
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
