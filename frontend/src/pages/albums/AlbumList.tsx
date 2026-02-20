import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetAlbumsQuery, useDeleteAlbumMutation, useUpdateAlbumMutation } from '../../store/api/albumApi';
import { AlbumStatus } from '../../types/album.types';
import { toast } from 'react-toastify';
import { DataTable } from '../../components/table/DataTable';
import type { ColumnDefinition, TableAction } from '../../components/table/Table.types';
import type { Album } from '../../types/album.types';
import ArtistSelect from '../../components/select/ArtistSelect';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { getImageUrl } from '../../utils/url';
import PageMeta from '../../components/common/PageMeta';

const AlbumList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [artistIds, setArtistIds] = useState<string[]>(searchParams.get('artistIds')?.split(',').filter(Boolean) || []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  const { data, isLoading, isFetching } = useGetAlbumsQuery({
    page,
    limit,
    search,
    artistId: artistIds.length > 0 ? artistIds : undefined,
  });

  const [deleteAlbum, { isLoading: isDeleting }] = useDeleteAlbumMutation();
  const [updateAlbum] = useUpdateAlbumMutation();

  // Update URL search params whenever state changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (search) params.set('search', search);
    if (artistIds.length > 0) params.set('artistIds', artistIds.join(','));
    setSearchParams(params);
  }, [page, limit, search, artistIds, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleArtistSelectChange = (ids: string[]) => {
    setArtistIds(ids);
    setPage(1); // Reset to first page on new filter
  };

  const handleDeleteClick = (album: Album) => {
    setAlbumToDelete(album);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (albumToDelete) {
      try {
        await deleteAlbum(albumToDelete._id).unwrap();
        toast.success('Album permanently deleted');
        setShowDeleteModal(false);
        setAlbumToDelete(null);
      } catch (error) {
        toast.error('Failed to delete album');
      }
    }
  };

  const handleStatusToggle = async (album: Album) => {
    const newStatus = album.status === AlbumStatus.ACTIVE ? AlbumStatus.INACTIVE : AlbumStatus.ACTIVE;
    try {
      await updateAlbum({
        id: album._id,
        body: { status: newStatus }
      }).unwrap();
      toast.success(`Album status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const columns: ColumnDefinition<Album>[] = useMemo(
    () => [
      {
        header: 'Cover',
        accessor: 'coverImage',
        render: (album) => (
          <Link to={`/albums/${album._id}`}>
            <img src={getImageUrl(album.coverImage)} alt={album.title} className="h-10 w-10 object-cover rounded-md border border-gray-100 dark:border-gray-800 hover:opacity-80 transition-opacity" />
          </Link>
        ),
        className: 'w-16',
      },
      {
        header: 'Title',
        accessor: 'title',
        render: (album) => (
          <Link to={`/albums/${album._id}`} className="font-medium text-brand-600 hover:underline">
            {album.title}
          </Link>
        )
      },
      { header: 'Artists', accessor: (album) => album.artists.map(artist => artist.name).join(', ') },
      { header: 'Genre', accessor: 'genre' },
      { header: 'Release Date', accessor: (album) => album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A' },
      {
        header: 'Status',
        accessor: 'status',
        render: (album) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusToggle(album)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${album.status === 'active' ? 'bg-brand-500' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${album.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className={`text-xs font-medium ${album.status === 'active' ? 'text-green-700' : 'text-gray-500'}`}>
              {album.status.charAt(0).toUpperCase() + album.status.slice(1)}
            </span>
          </div>
        )
      },
    ],
    []
  );

  const actions: TableAction<Album>[] = useMemo(
    () => [
      { label: 'View', onClick: (album) => navigate(`/albums/${album._id}`) },
      { label: 'Edit', onClick: (album) => navigate(`/albums/${album._id}/edit`) },
      { label: 'Delete', onClick: handleDeleteClick, className: 'text-red-600' },
    ],
    [navigate]
  );

  const albumsData = data?.data?.albums || [];
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
      <PageMeta title="Albums" description="Manage your music albums" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Albums</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage all music albums.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search albums..."
              className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:text-white"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <ArtistSelect
            selectedArtistIds={artistIds}
            onArtistChange={handleArtistSelectChange}
            placeholder="Filter by artist"
            className="min-w-[200px]"
            label=""
            isMulti={true}
          />

          <button
            onClick={() => navigate('/albums/new')}
            className="inline-flex items-center px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Album
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <DataTable
          data={albumsData}
          columns={columns}
          actions={actions}
          loading={isLoading || isFetching}
          emptyMessage="No albums found."
          keyAccessor="_id"
          pagination={paginationData}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {showDeleteModal && albumToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Delete Album"
          message={`Are you sure you want to delete the album "${albumToDelete.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
          confirmButtonText="Delete"
          isConfirming={isDeleting}
        />
      )}
    </div>
  );
};

export default AlbumList;
