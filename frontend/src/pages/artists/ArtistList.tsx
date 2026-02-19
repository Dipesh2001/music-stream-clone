import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetArtistsQuery, useDeleteArtistMutation } from "../../store/api/artistApi";
import type { Artist } from "../../types/artist.types";
import { ArtistStatus } from "../../types/artist.types";
import type { ColumnDefinition, TableAction } from "../../components/table/Table.types";
import { DataTable } from "../../components/table/DataTable";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/modals/ConfirmModal";
import { getImageUrl } from "../../utils/url";

const ArtistList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<ArtistStatus | "all">(
    (searchParams.get("status") as ArtistStatus) || "all"
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  const { data, isLoading, isFetching, error } = useGetArtistsQuery({
    page,
    limit,
    search,
    status: status === "all" ? undefined : status,
  });

  const [deleteArtist, { isLoading: isDeleting }] = useDeleteArtistMutation();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page !== 1) params.page = String(page);
    if (limit !== 10) params.limit = String(limit);
    if (search) params.search = search;
    if (status !== "all") params.status = status;
    setSearchParams(params, { replace: true });
  }, [page, limit, search, status, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ArtistStatus | "all");
    setPage(1);
  };

  const handleDeleteClick = (artist: Artist) => {
    setArtistToDelete(artist);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (artistToDelete) {
      try {
        await deleteArtist(artistToDelete._id).unwrap();
        toast.success(`Artist "${artistToDelete.name}" deleted successfully.`);
        setShowDeleteModal(false);
        setArtistToDelete(null);
      } catch (err) {
        toast.error("Failed to delete artist.");
        console.error("Failed to delete artist:", err);
      }
    }
  };

  const columns: ColumnDefinition<Artist>[] = useMemo(
    () => [
      {
        header: "Avatar",
        accessor: "image",
        render: (artist) => (
          <div className="flex items-center">
            {artist.image ? (
              <img
                src={getImageUrl(artist.image)}
                alt={artist.name}
                className="h-10 w-10 object-cover rounded-full border border-gray-100 dark:border-gray-800"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 font-bold uppercase">
                {artist.name.charAt(0)}
              </div>
            )}
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{artist.name}</div>
            </div>
          </div>
        ),
      },
      { header: "Genres", accessor: (artist) => artist.genres?.join(', ') || 'N/A' },
      {
        header: "Status",
        accessor: "status",
        render: (artist) => (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${artist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
          </span>
        )
      },
      {
        header: "Debut",
        accessor: (artist) => artist.debutDate ? new Date(artist.debutDate).toLocaleDateString() : 'N/A',
      },
    ],
    []
  );

  const actions: TableAction<Artist>[] = useMemo(
    () => [
      { label: "Edit", onClick: (artist) => navigate(`/artists/${artist._id}/edit`) },
      { label: "Delete", onClick: handleDeleteClick, className: "text-red-600 hover:text-red-800" },
    ],
    [navigate]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageMeta title="Artists" description="Manage music artists" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Artists</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage all music artists.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search artists..."
              className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:text-white"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <select
            value={status}
            onChange={handleStatusChange}
            className="h-11 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value={ArtistStatus.ACTIVE}>Active</option>
            <option value={ArtistStatus.INACTIVE}>Inactive</option>
          </select>
          <button
            onClick={() => navigate("/artists/new")}
            className="inline-flex items-center px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Artist
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {error ? (
          <div className="p-12 text-center text-red-500">Failed to load artists.</div>
        ) : (
          <DataTable
            data={data?.data?.artists || []}
            columns={columns}
            actions={actions}
            loading={isLoading || isFetching}
            keyAccessor="_id"
            pagination={data?.data}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {showDeleteModal && artistToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete artist "${artistToDelete.name}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          isConfirming={isDeleting}
        />
      )}
    </div>
  );
};

export default ArtistList;
