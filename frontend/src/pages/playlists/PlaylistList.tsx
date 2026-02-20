import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetPlaylistsQuery, useDeletePlaylistMutation } from '../../store/api/playlistApi';
import type { Playlist } from '../../types/playlist.types';
import { PlaylistVisibility } from '../../types/playlist.types';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { toast } from 'react-toastify';
import PageMeta from '../../components/common/PageMeta';
import Select from '../../components/form/Select';
import { getImageUrl } from '../../utils/url';

const PlaylistList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [visibility, setVisibility] = useState<string>(searchParams.get('visibility') || 'all');
    const [userId, setUserId] = useState(searchParams.get('userId') || '');

    const { data, isLoading, isFetching } = useGetPlaylistsQuery({
        page,
        limit,
        search,
        visibility: visibility === 'all' ? undefined : visibility,
        userId: userId || undefined,
    });

    const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (page !== 1) params.set('page', page.toString());
        if (limit !== 10) params.set('limit', limit.toString());
        if (search) params.set('search', search);
        if (visibility !== 'all') params.set('visibility', visibility);
        if (userId) params.set('userId', userId);
        setSearchParams(params);
    }, [page, limit, search, visibility, userId, setSearchParams]);

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibility(e.target.value);
        setPage(1);
    };

    const handleDeleteClick = (playlist: Playlist) => {
        setPlaylistToDelete(playlist);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (playlistToDelete) {
            try {
                await deletePlaylist(playlistToDelete._id).unwrap();
                toast.success('Playlist deleted successfully');
                setShowDeleteModal(false);
                setPlaylistToDelete(null);
            } catch (err) {
                toast.error('Failed to delete playlist');
            }
        }
    };

    const columns: ColumnDefinition<Playlist>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessor: 'name',
                className: 'font-medium text-gray-900 dark:text-white',
                render: (playlist) => (
                    <div className="flex items-center space-x-3">
                        <Link to={`/playlists/${playlist._id}`}>
                            {playlist.coverImage ? (
                                <img src={getImageUrl(playlist.coverImage)} alt={playlist.name} className="w-10 h-10 rounded-lg object-cover hover:opacity-80 transition-opacity" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 hover:bg-brand-500/20 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            )}
                        </Link>
                        <Link to={`/playlists/${playlist._id}`} className="truncate max-w-[200px] font-medium text-brand-600 hover:underline">
                            {playlist.name}
                        </Link>
                    </div>
                )
            },
            {
                header: 'Owner',
                accessor: (playlist) => playlist.owner?.name || 'Unknown',
            },
            {
                header: 'Visibility',
                accessor: 'visibility',
                render: (playlist) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${playlist.visibility === PlaylistVisibility.PUBLIC
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {playlist?.visibility?.toUpperCase()}
                    </span>
                )
            },
            {
                header: 'Tracks',
                accessor: (playlist) => playlist.trackCount || 0,
            },
            {
                header: 'Created At',
                accessor: (playlist) => new Date(playlist.createdAt).toLocaleDateString(),
            },
        ],
        []
    );

    const actions: TableAction<Playlist>[] = useMemo(
        () => [
            { label: 'View', onClick: (playlist) => navigate(`/playlists/${playlist._id}`) },
            { label: 'Edit', onClick: (playlist) => navigate(`/playlists/${playlist._id}/edit`) },
            { label: 'Delete', onClick: handleDeleteClick, className: 'text-red-600' },
        ],
        [navigate]
    );

    const playlistsData = data?.data?.playlists || [];
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
            <PageMeta title="Playlists" description="Manage user playlists" />

            <div className="flex flex-col space-y-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Playlists</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage public and private playlists.</p>
                    </div>

                    <button
                        onClick={() => navigate('/playlists/new')}
                        className="inline-flex items-center px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Playlist
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Search</label>
                        <input
                            type="text"
                            placeholder="Playlist name..."
                            className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-3 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Visibility</label>
                        <Select
                            options={[
                                { label: 'All', value: 'all' },
                                { label: 'Public', value: PlaylistVisibility.PUBLIC },
                                { label: 'Private', value: PlaylistVisibility.PRIVATE },
                            ]}
                            value={visibility}
                            onChange={handleVisibilityChange}
                        />
                    </div>

                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">User ID</label>
                        <input
                            type="text"
                            placeholder="Filter by user ID..."
                            className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-3 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
                            value={userId}
                            onChange={(e) => {
                                setUserId(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <DataTable
                    data={playlistsData}
                    columns={columns}
                    actions={actions}
                    loading={isLoading || isFetching}
                    emptyMessage="No playlists found."
                    keyAccessor="_id"
                    pagination={paginationData}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>

            {showDeleteModal && playlistToDelete && (
                <ConfirmModal
                    isOpen={true}
                    title="Delete Playlist"
                    message={`Are you sure you want to delete the playlist "${playlistToDelete.name}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onClose={() => setShowDeleteModal(false)}
                    confirmButtonText="Delete"
                    isConfirming={isDeleting}
                />
            )}
        </div>
    );
};

export default PlaylistList;
