import React, { useState, useEffect, useRef } from 'react';
import { useGetTracksQuery } from '../../store/api/trackApi';
import Label from '../form/Label';
import type { Track } from '../../types/track.types';

interface TrackSelectProps {
    selectedTrackIds: string[];
    onTrackChange: (trackIds: string[]) => void;
    label?: string;
    placeholder?: string;
    isMulti?: boolean;
    className?: string;
    disabled?: boolean;
    initialTracks?: Track[];
}

const TrackSelect: React.FC<TrackSelectProps> = ({
    selectedTrackIds = [],
    onTrackChange,
    label = 'Select Track(s)',
    placeholder = 'Type to search and select track(s)...',
    isMulti = false,
    className = '',
    disabled = false,
    initialTracks = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading, isError } = useGetTracksQuery({
        search: searchTerm,
        limit: 100
    });
    const tracks = data?.data?.tracks || [];

    const filteredTracks = tracks.filter((track) => {
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        const matchesSearch = searchWords.length === 0 || searchWords.some(word =>
            track.title.toLowerCase().includes(word) ||
            track.artists.some(artist => artist.name.toLowerCase().includes(word))
        );
        return matchesSearch && !selectedTrackIds.includes(track._id);
    });

    const [tracksCache, setTracksCache] = useState<Record<string, Track>>(() => {
        const initialCache: Record<string, Track> = {};
        initialTracks.forEach(track => {
            initialCache[track._id] = track;
        });
        return initialCache;
    });

    useEffect(() => {
        if (initialTracks.length > 0) {
            setTracksCache((prev) => {
                const newCache = { ...prev };
                initialTracks.forEach((track) => {
                    newCache[track._id] = track;
                });
                return newCache;
            });
        }
    }, [initialTracks]);

    useEffect(() => {
        if (tracks.length > 0) {
            setTracksCache((prev) => {
                const newCache = { ...prev };
                tracks.forEach((track) => {
                    newCache[track._id] = track;
                });
                return newCache;
            });
        }
    }, [tracks]);

    const selectedTrackObjects = selectedTrackIds
        .map((id) => tracksCache[id])
        .filter((t): t is Track => !!t);

    const handleSelect = (trackId: string) => {
        if (isMulti) {
            if (!selectedTrackIds.includes(trackId)) {
                onTrackChange([...selectedTrackIds, trackId]);
            }
        } else {
            onTrackChange([trackId]);
            setIsOpen(false);
        }
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleRemoveTrack = (trackId: string) => {
        onTrackChange(selectedTrackIds.filter((id) => id !== trackId));
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
                {selectedTrackObjects.map((track) => (
                    <span
                        key={track._id}
                        className="flex items-center bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium mr-1.5 mb-1 pl-2.5 py-1 rounded-md"
                    >
                        <span className="max-w-[150px] truncate">{track.title}</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTrack(track._id);
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
                    placeholder={selectedTrackIds.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                />
            </div>

            {isOpen && (isLoading || isError || filteredTracks.length > 0 || searchTerm.length > 0) && (
                <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                    {isLoading && <div className="p-3 text-sm text-gray-500">Loading tracks...</div>}
                    {isError && <div className="p-3 text-sm text-red-500">Error loading tracks.</div>}
                    {!isLoading && !isError && filteredTracks.length === 0 && searchTerm.length > 0 && (
                        <div className="p-3 text-sm text-gray-500">No tracks found for "{searchTerm}"</div>
                    )}
                    {!isLoading && !isError && filteredTracks.map((track) => (
                        <div
                            key={track._id}
                            className="p-3 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 last:border-0"
                            onClick={() => handleSelect(track._id)}
                        >
                            <div className="font-medium">{track.title}</div>
                            <div className="text-xs text-gray-500">{track.artists.map(a => a.name).join(', ')} • {track.album?.title}</div>
                        </div>
                    ))}
                    {!isLoading && !isError && filteredTracks.length === 0 && searchTerm.length === 0 && (
                        <div className="p-3 text-sm text-gray-500">Start typing to search tracks</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackSelect;
