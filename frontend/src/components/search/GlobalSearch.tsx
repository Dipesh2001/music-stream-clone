import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGlobalSearchQuery } from '../../store/api/searchApi';
import { getImageUrl } from '../../utils/url';
import type { SearchResultArtist, SearchResultAlbum, SearchResultTrack } from '../../types/search.types';
import type React from 'react';

type SearchTab = 'all' | 'artists' | 'albums' | 'tracks';

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<SearchTab>('all');
    const [triggerSearch, { data, isLoading, isFetching }] = useLazyGlobalSearchQuery();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();

    const results = data?.data;
    const hasResults =
        (results?.artists?.length ?? 0) > 0 ||
        (results?.albums?.length ?? 0) > 0 ||
        (results?.tracks?.length ?? 0) > 0;

    // Debounced search
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            if (value.trim().length >= 2) {
                debounceTimerRef.current = setTimeout(() => {
                    triggerSearch({ q: value.trim(), limit: 8 });
                }, 300);
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        },
        [triggerSearch],
    );

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut ⌘K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const navigateAndClose = (path: string) => {
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    const tabs: { key: SearchTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'artists', label: `Artists (${results?.artists?.length ?? 0})` },
        { key: 'albums', label: `Albums (${results?.albums?.length ?? 0})` },
        { key: 'tracks', label: `Tracks (${results?.tracks?.length ?? 0})` },
    ];

    const renderArtists = (artists: SearchResultArtist[]) => (
        <div className="space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Artists
            </p>
            {artists.map((artist) => (
                <button
                    key={artist._id}
                    onClick={() => navigateAndClose(`/artists/${artist._id}`)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                    {artist.image ? (
                        <img
                            src={getImageUrl(artist.image)}
                            alt={artist.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 text-xs font-bold">
                            {artist.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {artist.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {artist.genres?.join(', ') || 'Artist'}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );

    const renderAlbums = (albums: SearchResultAlbum[]) => (
        <div className="space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Albums
            </p>
            {albums.map((album) => (
                <button
                    key={album._id}
                    onClick={() => navigateAndClose(`/albums/${album._id}`)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                    {album.coverImage ? (
                        <img
                            src={getImageUrl(album.coverImage)}
                            alt={album.title}
                            className="w-8 h-8 rounded-md object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-md bg-brand-500/10 flex items-center justify-center text-brand-600 text-xs font-bold">
                            ♫
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {album.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {album.artist?.name || 'Album'}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );

    const renderTracks = (tracks: SearchResultTrack[]) => (
        <div className="space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Tracks
            </p>
            {tracks.map((track) => (
                <button
                    key={track._id}
                    onClick={() => navigateAndClose(`/tracks/${track._id}/edit`)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                    {track.album?.coverImage ? (
                        <img
                            src={getImageUrl(track.album.coverImage)}
                            alt={track.title}
                            className="w-8 h-8 rounded-md object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-md bg-brand-500/10 flex items-center justify-center text-brand-600 text-xs font-bold">
                            ♪
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {track.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {track.artist?.name || 'Track'} • {track.album?.title || ''}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                    <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        />
                    </svg>
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    placeholder="Search artists, albums, tracks..."
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                    <span> ⌘ </span>
                    <span> K </span>
                </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl z-[9999] max-h-[420px] overflow-hidden">
                    {/* Tabs */}
                    {hasResults && (
                        <div className="flex border-b border-gray-100 dark:border-gray-800 px-2 pt-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors ${activeTab === tab.key
                                            ? 'text-brand-600 bg-brand-500/10 border-b-2 border-brand-500'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="overflow-y-auto max-h-[350px] p-2 space-y-2">
                        {(isLoading || isFetching) && (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                <span className="ml-2 text-sm text-gray-400">Searching...</span>
                            </div>
                        )}

                        {!isLoading && !isFetching && !hasResults && query.trim().length >= 2 && (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-sm font-medium">No results found</p>
                                <p className="text-xs mt-0.5">Try a different search term</p>
                            </div>
                        )}

                        {!isLoading &&
                            !isFetching &&
                            hasResults && (
                                <>
                                    {(activeTab === 'all' || activeTab === 'artists') &&
                                        results?.artists &&
                                        results.artists.length > 0 &&
                                        renderArtists(results.artists)}
                                    {(activeTab === 'all' || activeTab === 'albums') &&
                                        results?.albums &&
                                        results.albums.length > 0 &&
                                        renderAlbums(results.albums)}
                                    {(activeTab === 'all' || activeTab === 'tracks') &&
                                        results?.tracks &&
                                        results.tracks.length > 0 &&
                                        renderTracks(results.tracks)}
                                </>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
