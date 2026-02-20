import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    useGetPlaylistByIdQuery,
    useRemoveTrackFromPlaylistMutation,
    useAddTrackToPlaylistMutation,
} from '../../store/api/playlistApi';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatDuration } from '../../utils/audio';
import { toast } from 'react-toastify';
import PageMeta from '../../components/common/PageMeta';
import { PlaylistVisibility, type PlaylistTrack } from '../../types/playlist.types';
import TrackSelect from '../../components/select/TrackSelect';
import { getImageUrl } from '../../utils/url';

// Interface for table display
interface PlaylistTrackTableItem extends PlaylistTrack {
    _id: string; // Added for DataTable compatibility
}

const PlaylistDetails: React.FC = () => {
    const { id: playlistId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedTrackIdsToAdd, setSelectedTrackIdsToAdd] = useState<string[]>([]);
    const [isAddingTracks, setIsAddingTracks] = useState(false);
    const [previewTrack, setPreviewTrack] = useState<any>(null);

    const { data: playlistData, isLoading, isError } = useGetPlaylistByIdQuery(playlistId ?? skipToken);
    const [removeTrack] = useRemoveTrackFromPlaylistMutation();
    const [addTrack] = useAddTrackToPlaylistMutation();

    const playlist = playlistData?.data;

    const tracksForTable: PlaylistTrackTableItem[] = useMemo(() => {
        return (playlist?.tracks || []).map((item: any, index: number) => {
            // If item has a track property, it's already in PlaylistTrack format
            if (item.track) {
                return {
                    ...item,
                    _id: item.track._id
                };
            }
            // If item is the track itself, wrap it
            return {
                track: item,
                addedAt: item.createdAt || new Date().toISOString(),
                order: index + 1,
                _id: item._id
            };
        });
    }, [playlist?.tracks]);

    const handleRemoveTrack = async (trackId: string) => {
        if (!playlistId) return;
        try {
            await removeTrack({ playlistId, trackId }).unwrap();
            toast.success('Track removed from playlist');
        } catch (err) {
            toast.error('Failed to remove track');
        }
    };

    const handleAddSelectedTracks = async () => {
        if (!playlistId || selectedTrackIdsToAdd.length === 0) return;

        setIsAddingTracks(true);
        try {
            // Add tracks sequentially or use a batch endpoint if available (assuming sequential for now based on prompt)
            for (const trackId of selectedTrackIdsToAdd) {
                await addTrack({ playlistId, trackId }).unwrap();
            }
            toast.success('Tracks added to playlist');
            setSelectedTrackIdsToAdd([]);
        } catch (err) {
            toast.error('Some tracks failed to add');
        } finally {
            setIsAddingTracks(false);
        }
    };

    const columns: ColumnDefinition<PlaylistTrackTableItem>[] = useMemo(
        () => [
            {
                header: '#',
                accessor: 'order',
                className: 'w-10 text-gray-400',
            },
            {
                header: 'Title',
                accessor: (item) => item.track?.title || '',
                className: 'font-medium text-gray-900 dark:text-white',
                render: (item) => (
                    <div className="flex flex-col">
                        <span>{item.track?.title}</span>
                        <div className="flex flex-wrap gap-1">
                            {item.track?.artists?.map((a: any, idx: number) => (
                                <React.Fragment key={a._id || idx}>
                                    <Link to={`/artists/${a._id}`} className="text-xs text-brand-600 hover:underline">
                                        {a.name}
                                    </Link>
                                    {idx < (item.track?.artists?.length || 0) - 1 && <span className="text-xs text-gray-400">,</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )
            },
            {
                header: 'Album',
                accessor: (item) => item.track?.album?.title || 'N/A',
                render: (item) => (
                    <div className="flex items-center gap-2">
                        {item.track?.album?.coverImage && (
                            <img src={getImageUrl(item.track.album.coverImage)} className="w-8 h-8 rounded object-cover" alt="" />
                        )}
                        <Link to={`/albums/${item.track?.album?._id}`} className="hover:underline text-brand-600">
                            {item.track?.album?.title}
                        </Link>
                    </div>
                )
            },
            {
                header: 'Duration',
                accessor: (item) => formatDuration(item.track?.duration || 0),
            },
            {
                header: 'AddedAt',
                accessor: (item) => new Date(item.addedAt).toLocaleDateString(),
                className: 'text-gray-400 text-xs',
            },
        ],
        []
    );

    const actions: TableAction<PlaylistTrackTableItem>[] = useMemo(
        () => [
            {
                label: 'Preview',
                onClick: (item) => setPreviewTrack(item.track),
                className: 'text-brand-600',
            },
            {
                label: 'Remove',
                onClick: (item) => handleRemoveTrack(item.track._id),
                className: 'text-red-600',
            },
        ],
        [playlistId]
    );

    if (isLoading) return <div className="p-6 text-center">Loading playlist details...</div>;
    if (isError || !playlist) return <div className="p-6 text-center text-red-500">Error loading playlist.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageMeta title={`Playlist: ${playlist.name}`} description="View playlist details and tracks" />

            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Playlist Cover */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-800">
                        {playlist.coverImage ? (
                            <img src={getImageUrl(playlist.coverImage)} alt={playlist.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-500/20">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Playlist Info */}
                <div className="flex-grow flex flex-col justify-end pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${playlist.visibility === PlaylistVisibility.PUBLIC ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'
                            }`}>
                            {playlist.visibility}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">{playlist.name}</h1>
                    {playlist.description && (
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 line-clamp-2 max-w-2xl">{playlist.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <span className="font-bold text-gray-900 dark:text-white mr-1.5">{playlist.owner?.name}</span>
                            <span>• {playlist.trackCount} Tracks</span>
                        </div>
                        <button
                            onClick={() => navigate(`/playlists/${playlistId}/edit`)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-brand-600"
                        >
                            Edit Details
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tracks</h2>

                    <div className="flex items-center gap-2 max-w-md w-full">
                        <TrackSelect
                            selectedTrackIds={selectedTrackIdsToAdd}
                            onTrackChange={setSelectedTrackIdsToAdd}
                            isMulti={true}
                            placeholder="Find tracks to add..."
                            className="flex-grow"
                            label=""
                        />
                        <button
                            onClick={handleAddSelectedTracks}
                            disabled={selectedTrackIdsToAdd.length === 0 || isAddingTracks}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 transition-all disabled:opacity-50 h-[44px]"
                        >
                            {isAddingTracks ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>

                <DataTable
                    data={tracksForTable}
                    columns={columns}
                    actions={actions}
                    loading={isLoading}
                    emptyMessage="No tracks in this playlist yet. Use the search above to add some!"
                    keyAccessor="_id"
                />
            </div>

            {/* Preview Player Modal */}
            {previewTrack && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={getImageUrl(previewTrack.album?.coverImage)}
                                        alt={previewTrack.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{previewTrack.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{previewTrack.artists?.map((a: any) => a.name).join(', ')}</p>
                                </div>
                            </div>
                            <button onClick={() => setPreviewTrack(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <audio
                            controls
                            autoPlay
                            className="w-full"
                            src={getImageUrl(previewTrack.audioUrl)}
                        >
                            Your browser does not support the audio element.
                        </audio>

                        <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                            Preview Mode
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistDetails;
