import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetArtistByIdQuery } from '../../store/api/artistApi';
import { useGetTracksQuery } from '../../store/api/trackApi';
import { useGetAlbumsQuery } from '../../store/api/albumApi';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatDuration } from '../../utils/audio';
import { getImageUrl } from '../../utils/url';
import PageMeta from '../../components/common/PageMeta';
import type { Track } from '../../types/track.types';
import type { Album } from '../../types/album.types';

const ArtistDetails: React.FC = () => {
    const { id: artistId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: artistData, isLoading: isLoadingArtist } = useGetArtistByIdQuery(artistId ?? skipToken);
    const { data: tracksData, isLoading: isLoadingTracks } = useGetTracksQuery(
        artistId ? { artistId, limit: 10 } : skipToken
    );
    const { data: albumsData, isLoading: isLoadingAlbums } = useGetAlbumsQuery(
        artistId ? { artistId, limit: 10 } : skipToken
    );

    const artist = artistData?.data;
    const tracks = tracksData?.data?.tracks || [];
    const albums = albumsData?.data?.albums || [];

    const [previewTrack, setPreviewTrack] = useState<Track | null>(null);

    const trackColumns: ColumnDefinition<Track>[] = useMemo(
        () => [
            {
                header: 'Title',
                accessor: 'title',
                className: 'font-medium text-gray-900 dark:text-white',
                render: (track) => (
                    <div className="flex items-center gap-3">
                        <img
                            src={getImageUrl(track.album?.coverImage)}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                        />
                        <span>{track.title}</span>
                    </div>
                )
            },
            {
                header: 'Album',
                accessor: (track) => track.album?.title || 'N/A',
                render: (track) => (
                    <Link to={`/albums/${track.album?._id}`} className="text-brand-600 hover:underline">
                        {track.album?.title}
                    </Link>
                )
            },
            {
                header: 'Duration',
                accessor: (track) => formatDuration(track.duration),
            },
        ],
        []
    );

    const trackActions: TableAction<Track>[] = useMemo(
        () => [
            {
                label: 'Preview',
                onClick: (track) => setPreviewTrack(track),
                className: 'text-brand-600',
            },
        ],
        []
    );

    if (isLoadingArtist) return <div className="p-6 text-center">Loading artist...</div>;
    if (!artist) return <div className="p-6 text-center text-red-500">Artist not found.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageMeta title={`Artist: ${artist.name}`} description={`View details for ${artist.name}`} />

            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Artist Image */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="aspect-square rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border-4 border-white dark:border-gray-900">
                        {artist.image ? (
                            <img src={getImageUrl(artist.image)} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-6xl uppercase">
                                {artist.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Artist Info */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600">
                            Verified Artist
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4">{artist.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {artist.genres?.map((genre: string) => (
                            <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                                {genre}
                            </span>
                        ))}
                    </div>
                    {artist.bio && (
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 line-clamp-3 max-w-2xl">{artist.bio}</p>
                    )}
                    <button
                        onClick={() => navigate(`/artists/${artistId}/edit`)}
                        className="w-fit px-6 py-2 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 transition-all"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Popular Tracks */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular Tracks</h2>
                        </div>
                        <DataTable
                            data={tracks}
                            columns={trackColumns}
                            actions={trackActions}
                            loading={isLoadingTracks}
                            emptyMessage="No tracks found for this artist."
                            keyAccessor="_id"
                        />
                    </div>
                </div>

                {/* Discography / Albums */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Discography</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {albums.map((album: Album) => (
                            <Link
                                key={album._id}
                                to={`/albums/${album._id}`}
                                className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-500/50 hover:shadow-lg transition-all"
                            >
                                <img
                                    src={getImageUrl(album.coverImage)}
                                    className="w-16 h-16 rounded-lg object-cover shadow-sm"
                                    alt={album.title}
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-gray-900 dark:text-white truncate">{album.title}</span>
                                    <span className="text-xs text-gray-500">
                                        {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'N/A'} • Album
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {albums.length === 0 && !isLoadingAlbums && (
                            <p className="text-sm text-gray-500 italic">No albums listed yet.</p>
                        )}
                    </div>
                </div>
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
                                    <p className="text-sm text-gray-500 truncate">{previewTrack.artists?.map(a => a.name).join(', ')}</p>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistDetails;
