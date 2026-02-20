import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAlbumByIdQuery } from '../../store/api/albumApi';
import { useGetTracksQuery } from '../../store/api/trackApi';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatDuration } from '../../utils/audio';
import { getImageUrl } from '../../utils/url';
import PageMeta from '../../components/common/PageMeta';
import type { Track } from '../../types/track.types';

const AlbumDetails: React.FC = () => {
    const { id: albumId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: albumData, isLoading: isLoadingAlbum } = useGetAlbumByIdQuery(albumId ?? skipToken);
    const { data: tracksData, isLoading: isLoadingTracks } = useGetTracksQuery(
        albumId ? { albumId, limit: 100 } : skipToken
    );

    const album = albumData?.data;
    const tracks = tracksData?.data?.tracks || [];

    const [previewTrack, setPreviewTrack] = useState<Track | null>(null);

    const columns: ColumnDefinition<Track>[] = useMemo(
        () => [
            {
                header: '#',
                accessor: 'order',
                className: 'w-10 text-gray-400',
            },
            {
                header: 'Title',
                accessor: 'title',
                className: 'font-medium text-gray-900 dark:text-white',
                render: (track) => (
                    <div className="flex flex-col">
                        <span>{track.title}</span>
                        <div className="flex flex-wrap gap-1">
                            {track.artists.map((artist, idx) => (
                                <React.Fragment key={artist._id}>
                                    <Link
                                        to={`/artists/${artist._id}`}
                                        className="text-xs text-brand-600 hover:underline"
                                    >
                                        {artist.name}
                                    </Link>
                                    {idx < track.artists.length - 1 && <span className="text-xs text-gray-400">,</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )
            },
            {
                header: 'Status',
                accessor: 'status',
                render: (track) => (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${track.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {track.status}
                    </span>
                )
            },
            {
                header: 'Plays',
                accessor: (track) => track.playCount?.toLocaleString() || '0',
            },
            {
                header: 'Duration',
                accessor: (track) => formatDuration(track.duration),
            },
        ],
        []
    );

    const actions: TableAction<Track>[] = useMemo(
        () => [
            {
                label: 'Preview',
                onClick: (track) => setPreviewTrack(track),
                className: 'text-brand-600',
            },
            {
                label: 'Edit',
                onClick: (track) => navigate(`/tracks/${track._id}/edit`),
            },
        ],
        [navigate]
    );

    if (isLoadingAlbum) return <div className="p-6 text-center">Loading album...</div>;
    if (!album) return <div className="p-6 text-center text-red-500">Album not found.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageMeta title={`Album: ${album.title}`} description={`View tracks for ${album.title}`} />

            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Album Cover */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-800">
                        {album.coverImage ? (
                            <img src={getImageUrl(album.coverImage)} alt={album.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-500/20">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                    <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Album Info */}
                <div className="flex-grow flex flex-col justify-end pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600">
                            Album
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${album.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'
                            }`}>
                            {album.status}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">{album.title}</h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            {album.artists.map((artist, idx) => (
                                <React.Fragment key={artist._id}>
                                    <Link to={`/artists/${artist._id}`} className="font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors">
                                        {artist.name}
                                    </Link>
                                    {idx < album.artists.length - 1 && <span className="mx-1">•</span>}
                                </React.Fragment>
                            ))}
                        </div>
                        {album.releaseDate && (
                            <span>{new Date(album.releaseDate).getFullYear()}</span>
                        )}
                        <span>{tracks.length} Songs</span>
                        <button
                            onClick={() => navigate(`/albums/${albumId}/edit`)}
                            className="text-brand-600 hover:underline"
                        >
                            Edit Album
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tracks</h2>
                </div>

                <DataTable
                    data={tracks}
                    columns={columns}
                    actions={actions}
                    loading={isLoadingTracks}
                    emptyMessage="No tracks in this album yet."
                    keyAccessor="_id"
                />
            </div>

            {/* Preview Player Modal (Simplified) */}
            {previewTrack && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={getImageUrl(album.coverImage)}
                                        alt={previewTrack.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{previewTrack.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{previewTrack.artists.map(a => a.name).join(', ')}</p>
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

export default AlbumDetails;
