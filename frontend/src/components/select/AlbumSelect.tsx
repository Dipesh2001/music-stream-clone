import React, { useState, useEffect, useRef } from 'react';
import { useGetAlbumsQuery } from '../../store/api/albumApi';
import Label from '../form/Label';

interface AlbumSelectProps {
    selectedAlbumIds: string[];
    onAlbumChange: (albumIds: string[]) => void;
    artistId?: string; // Optional filter by artist
    label?: string;
    placeholder?: string;
    isMulti?: boolean;
    className?: string;
    disabled?: boolean;
    initialAlbums?: { _id: string; title: string }[];
}

const AlbumSelect: React.FC<AlbumSelectProps> = ({
    selectedAlbumIds = [],
    onAlbumChange,
    artistId,
    label = 'Select Album(s)',
    placeholder = 'Type to search and select album(s)...',
    isMulti = false,
    className = '',
    disabled = false,
    initialAlbums = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading, isError } = useGetAlbumsQuery({
        search: searchTerm,
        limit: 100,
        artistId: artistId ? [artistId] : undefined
    });
    const albums = data?.data?.albums || [];

    const filteredAlbums = albums.filter((album) => {
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const matchesSearch = searchWords.length === 0 || searchWords.some(word => album.title.toLowerCase().includes(word));
        return matchesSearch && !selectedAlbumIds.includes(album._id);
    });

    const [albumsCache, setAlbumsCache] = useState<Record<string, { _id: string; title: string }>>(() => {
        const initialCache: Record<string, { _id: string; title: string }> = {};
        initialAlbums.forEach(album => {
            initialCache[album._id] = album;
        });
        return initialCache;
    });

    useEffect(() => {
        if (initialAlbums.length > 0) {
            setAlbumsCache((prev) => {
                const newCache = { ...prev };
                initialAlbums.forEach((album) => {
                    newCache[album._id] = album;
                });
                return newCache;
            });
        }
    }, [initialAlbums]);

    useEffect(() => {
        if (albums.length > 0) {
            setAlbumsCache((prev) => {
                const newCache = { ...prev };
                albums.forEach((album) => {
                    newCache[album._id] = { _id: album._id, title: album.title };
                });
                return newCache;
            });
        }
    }, [albums]);

    const selectedAlbumObjects = selectedAlbumIds
        .map((id) => albumsCache[id])
        .filter((a): a is { _id: string; title: string } => !!a);

    const handleSelect = (albumId: string) => {
        if (isMulti) {
            if (!selectedAlbumIds.includes(albumId)) {
                onAlbumChange([...selectedAlbumIds, albumId]);
            }
        } else {
            onAlbumChange([albumId]);
            setIsOpen(false);
        }
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleRemoveAlbum = (albumId: string) => {
        onAlbumChange(selectedAlbumIds.filter((id) => id !== albumId));
        inputRef.current?.focus();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            setIsOpen(true);
        }
    }, [searchTerm]);

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {label && <Label>{label}</Label>}
            <div
                className={`relative flex flex-wrap items-center w-full border rounded-lg shadow-theme-xs bg-white min-h-[44px] px-2 py-1.5 focus-within:ring-3 focus-within:border-brand-300 focus-within:ring-brand-500/20 transition-all ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900'
                    }`}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }
                }}
            >
                {selectedAlbumObjects.map((album) => (
                    <span
                        key={album._id}
                        className="flex items-center bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium mr-1.5 mb-1 pl-2.5 py-1 rounded-md"
                    >
                        {album.title}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveAlbum(album._id);
                            }}
                            className="ml-1.5 px-1 hover:text-brand-800 dark:hover:text-brand-300 focus:outline-none"
                            disabled={disabled}
                        >
                            &times;
                        </button>
                    </span>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    className="flex-grow focus:outline-none border-none p-0 text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder:text-white/30 bg-transparent min-w-[50px] text-sm"
                    placeholder={selectedAlbumIds.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                />
            </div>

            {isOpen && (isLoading || isError || filteredAlbums.length > 0 || searchTerm.length > 0) && (
                <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                    {isLoading && <div className="p-3 text-sm text-gray-500">Loading albums...</div>}
                    {isError && <div className="p-3 text-sm text-red-500">Error loading albums.</div>}
                    {!isLoading && !isError && filteredAlbums.length === 0 && searchTerm.length > 0 && (
                        <div className="p-3 text-sm text-gray-500">No albums found for "{searchTerm}"</div>
                    )}
                    {!isLoading && !isError && filteredAlbums.map((album) => (
                        <div
                            key={album._id}
                            className="p-3 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-800 dark:text-white/90"
                            onClick={() => handleSelect(album._id)}
                        >
                            {album.title}
                        </div>
                    ))}
                    {!isLoading && !isError && filteredAlbums.length === 0 && searchTerm.length === 0 && (
                        <div className="p-3 text-sm text-gray-500">Start typing to search albums</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlbumSelect;
