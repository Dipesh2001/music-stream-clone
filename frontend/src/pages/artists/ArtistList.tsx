import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetArtistsQuery, useDeleteArtistMutation } from "../../store/api/artistApi"; // Removed useGetUniqueGenresQuery
import type { Artist } from "../../types/artist.types";
import {  ArtistStatus } from "../../types/artist.types";
import type { ColumnDefinition, TableAction } from "../../components/table/Table.types";
import { DataTable } from "../../components/table/DataTable";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify"; // Assuming react-toastify is used for notifications
import { ConfirmModal } from "../../components/modals/ConfirmModal"; // Will create this later

const ArtistList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<ArtistStatus | "all">(
    (searchParams.get("status") as ArtistStatus) || "all"
  );
  // Removed selectedGenres state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  // Removed useGetUniqueGenresQuery call

  const { data, isLoading, isFetching, error } = useGetArtistsQuery({
    page,
    limit,
    search,
    status: status === "all" ? undefined : status,
    // Removed genres parameter
  });

  const [deleteArtist, { isLoading: isDeleting }] = useDeleteArtistMutation();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page !== 1) params.page = String(page);
    if (limit !== 10) params.limit = String(limit);
    if (search) params.search = search;
    if (status !== "all") params.status = status;
    // Removed genres from search params
    setSearchParams(params, { replace: true });
  }, [page, limit, search, status, setSearchParams]); // Removed selectedGenres from dependencies

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as ArtistStatus | "all");
    setPage(1); // Reset to first page when status changes
  };

  // Removed handleGenreSelectChange function

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
      { header: "ID", accessor: "_id", className: "w-1/6" },
      { header: "Name", accessor: "name", className: "w-1/6" },
      { header: "Genres", accessor: (artist) => artist.genres?.join(', ') || 'N/A', className: "w-1/6" },
      { header: "Status", accessor: "status", className: "w-1/6" },
      {
        header: "Created At",
        accessor: (artist) => new Date(artist.createdAt).toLocaleDateString(),
        className: "w-1/6",
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
    <>
      <PageMeta title="Artists" description="Manage music artists" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Artists</h2>
        <Link
          to="/artists/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Artist
        </Link>
      </div>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by name or genre..."
          value={search}
          onChange={handleSearchChange}
          className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {/* Removed genre multi-select */}
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value={ArtistStatus.ACTIVE}>Active</option>
          <option value={ArtistStatus.INACTIVE}>Inactive</option>
        </select>
      </div>

      {error ? (
        <div className="text-red-500">Failed to load artists.</div>
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

      {artistToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete artist "${artistToDelete.name}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          isConfirming={isDeleting}
        />
      )}
    </>
  );
};

export default ArtistList;
