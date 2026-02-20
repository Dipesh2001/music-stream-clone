import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetTracksQuery, useDeleteTrackMutation, useUpdateTrackMutation } from '../../store/api/trackApi';
import type { Track } from '../../types/track.types';
import { TrackStatus } from '../../types/track.types';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import ArtistSelect from '../../components/select/ArtistSelect';
import AlbumSelect from '../../components/select/AlbumSelect';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { PreviewModal } from '../../components/modals/PreviewModal';
import { formatDuration } from '../../utils/audio';
import { getImageUrl } from '../../utils/url';
import { toast } from 'react-toastify';
import PageMeta from '../../components/common/PageMeta';

const TrackList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [artistIds, setArtistIds] = useState<string[]>(searchParams.get('artistIds')?.split(',').filter(Boolean) || []);
    const [albumIds, setAlbumIds] = useState<string[]>(searchParams.get('albumIds')?.split(',').filter(Boolean) || []);

    const { data, isLoading, isFetching } = useGetTracksQuery({
        page,
        limit,
        search,
        artistId: artistIds.length > 0 ? artistIds : undefined,
        albumId: albumIds.length > 0 ? albumIds : undefined,
    });

    const [deleteTrack, { isLoading: isDeleting }] = useDeleteTrackMutation();
    const [updateTrack] = useUpdateTrackMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
    const [previewTrack, setPreviewTrack] = useState<Track | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (page !== 1) params.set('page', page.toString());
        if (limit !== 10) params.set('limit', limit.toString());
        if (search) params.set('search', search);
        if (artistIds.length > 0) params.set('artistIds', artistIds.join(','));
        if (albumIds.length > 0) params.set('albumIds', albumIds.join(','));
        setSearchParams(params);
    }, [page, limit, search, artistIds, albumIds, setSearchParams]);

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleArtistSelectChange = (ids: string[]) => {
        setArtistIds(ids);
        setPage(1);
    };

    const handleAlbumSelectChange = (ids: string[]) => {
        setAlbumIds(ids);
        setPage(1);
    };

    const handleDeleteClick = (track: Track) => {
        setTrackToDelete(track);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (trackToDelete) {
            try {
                await deleteTrack(trackToDelete._id).unwrap();
                toast.success('Track permanently deleted');
                setShowDeleteModal(false);
                setTrackToDelete(null);
            } catch (err) {
                toast.error('Failed to delete track');
            }
        }
    };

    const handleStatusToggle = async (track: Track) => {
        const newStatus = track.status === TrackStatus.ACTIVE ? TrackStatus.INACTIVE : TrackStatus.ACTIVE;
        try {
            await updateTrack({
                id: track._id,
                body: { status: newStatus }
            }).unwrap();
            toast.success(`Track status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const columns: ColumnDefinition<Track>[] = useMemo(
        () => [
            {
                header: 'Preview',
                accessor: '_id',
                render: (track) => (
                    <button
                        onClick={() => setPreviewTrack(track)}
                        className="p-2 bg-brand-500/10 text-brand-600 rounded-full hover:bg-brand-500 hover:text-white transition-all transform hover:scale-110"
                        title="Preview Track"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )
            },
            {
                header: 'Track',
                accessor: 'title',
                className: 'font-medium text-gray-900 dark:text-white',
                render: (track) => (
                    <div className="flex items-center space-x-3">
                        <img
                            src={getImageUrl(track.album?.coverImage)}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold">{track.title}</span>
                            <div className="flex flex-wrap gap-1">
                                {track.artists?.map((a, idx) => (
                                    <Link key={a._id} to={`/artists/${a._id}`} className="text-xs text-brand-600 hover:underline">
                                        {a.name}{idx < track.artists.length - 1 ? ',' : ''}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            },
            {
                header: 'Album',
                accessor: (track) => track.album?.title || 'N/A',
                render: (track) => (
                    <Link to={`/albums/${track.album?._id}`} className="hover:underline text-brand-600 font-medium">
                        {track.album?.title || 'Unknown Album'}
                    </Link>
                )
            },
            {
                header: 'Artists',
                accessor: (track) => track.artists?.map(a => a.name).join(', ') || 'N/A'
            },
            {
                header: 'Duration',
                accessor: 'duration',
                render: (track) => formatDuration(track.duration)
            },
            { header: 'Order', accessor: 'order' },
            {
                header: 'Status',
                accessor: 'status',
                render: (track) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleStatusToggle(track)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${track.status === 'active' ? 'bg-brand-500' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${track.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                )
            },
        ],
        []
    );

    const actions: TableAction<Track>[] = useMemo(
        () => [
            { label: 'Edit', onClick: (track) => navigate(`/tracks/${track._id}/edit`) },
            { label: 'Delete', onClick: handleDeleteClick, className: 'text-red-600' },
        ],
        [navigate]
    );

    const tracksData = data?.data?.tracks || [];
    const paginationData = data?.data
        ? {
            page: data.data.page,
            limit: data.data.limit,
            totalPages: data.data.totalPages,
            total: data.data.total,
        }
        : undefined;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <PageMeta title="Tracks" description="Manage your music tracks" />

            <div className="flex flex-col space-y-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tracks</h1>
                        <p className="text-gray-500 dark:text-gray-400">View and manage all music tracks.</p>
                    </div>

                    <button
                        onClick={() => navigate('/tracks/new')}
                        className="inline-flex items-center px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Track
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Search</label>
                        <input
                            type="text"
                            placeholder="Track title..."
                            className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-3 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div>
                        <LabelText text="Artists" />
                        <ArtistSelect
                            selectedArtistIds={artistIds}
                            onArtistChange={handleArtistSelectChange}
                            isMulti={true}
                            placeholder="Filter artists"
                            label=""
                        />
                    </div>

                    <div>
                        <LabelText text="Album" />
                        <AlbumSelect
                            selectedAlbumIds={albumIds}
                            onAlbumChange={handleAlbumSelectChange}
                            isMulti={true}
                            placeholder="Filter albums"
                            label=""
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <DataTable
                    data={tracksData}
                    columns={columns}
                    actions={actions}
                    loading={isLoading || isFetching}
                    emptyMessage="No tracks found matching your filters."
                    keyAccessor="_id"
                    pagination={paginationData}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>

            {showDeleteModal && trackToDelete && (
                <ConfirmModal
                    isOpen={true}
                    title="Delete Track"
                    message={`Are you sure you want to delete the track "${trackToDelete.title}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onClose={() => setShowDeleteModal(false)}
                    confirmButtonText="Delete"
                    isConfirming={isDeleting}
                />
            )}

            {previewTrack && (
                <PreviewModal
                    isOpen={!!previewTrack}
                    onClose={() => setPreviewTrack(null)}
                    title={previewTrack.title}
                    audioUrl={previewTrack.audioUrl}
                    duration={previewTrack.duration}
                    artists={previewTrack.artists}
                    albumTitle={previewTrack.album?.title}
                    albumCover={previewTrack.album?.coverImage}
                />
            )}
        </div>
    );
};

const LabelText = ({ text }: { text: string }) => (
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{text}</label>
);

export default TrackList;
