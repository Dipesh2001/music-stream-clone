import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetAlbumsQuery, useDeleteAlbumMutation } from '../../store/api/albumApi';
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
  const [artistId, setArtistId] = useState<string | undefined>(searchParams.get('artistId') || undefined);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  const { data, isLoading, isFetching } = useGetAlbumsQuery({
    page,
    limit,
    search,
    artistId,
  });

  const [deleteAlbum, { isLoading: isDeleting }] = useDeleteAlbumMutation();

  // Update URL search params whenever state changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (search) params.set('search', search);
    if (artistId) params.set('artistId', artistId);
    setSearchParams(params);
  }, [page, limit, search, artistId, setSearchParams]);

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
    setArtistId(ids.length > 0 ? ids[0] : undefined); // Get the first ID if available
    setPage(1); // Reset to first page on new filter
  };

  const handleDeleteClick = (album: Album) => {
    setAlbumToDelete(album);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (albumToDelete) {
      await deleteAlbum(albumToDelete._id);
      setShowDeleteModal(false);
      setAlbumToDelete(null);
    }
  };

  const columns: ColumnDefinition<Album>[] = useMemo(
    () => [
      {
        header: 'Cover',
        accessor: 'coverImage',
        render: (album) => (
          <img src={getImageUrl(album.coverImage)} alt={album.title} className="h-10 w-10 object-cover rounded-md border border-gray-100 dark:border-gray-800" />
        ),
        className: 'w-16',
      },
      { header: 'Title', accessor: 'title' },
      { header: 'Artists', accessor: (album) => album.artists.map(artist => artist.name).join(', ') },
      { header: 'Genre', accessor: 'genre' },
      { header: 'Release Date', accessor: (album) => album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : 'N/A' },
      {
        header: 'Status',
        accessor: 'status',
        render: (album) => (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${album.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {album.status.charAt(0).toUpperCase() + album.status.slice(1)}
          </span>
        )
      },
    ],
    []
  );

  const actions: TableAction<Album>[] = useMemo(
    () => [
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
            selectedArtistIds={artistId ? [artistId] : []}
            onArtistChange={handleArtistSelectChange}
            placeholder="Filter by artist"
            className="min-w-[200px]"
            label=""
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
