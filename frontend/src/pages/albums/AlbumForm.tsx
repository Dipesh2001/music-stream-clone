import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateAlbumMutation,
  useGetAlbumByIdQuery,
  useUpdateAlbumMutation,
} from '../../store/api/albumApi';
import type { AlbumCreateRequest, AlbumUpdateRequest } from '../../types/album.types';
import { AlbumStatus } from '../../types/album.types';
import ArtistSelect from '../../components/select/ArtistSelect';
import { skipToken } from '@reduxjs/toolkit/query';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import DatePicker from '../../components/form/DatePicker';
import { getImageUrl } from '../../utils/url';
import PageMeta from '../../components/common/PageMeta';

const AlbumForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: albumId } = useParams<{ id: string }>(); // Get album ID from URL for edit mode

  // Form state
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('');
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const [status, setStatus] = useState<AlbumStatus>(AlbumStatus.ACTIVE);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null); // For image preview

  // API calls
  const { data: albumData, isLoading: isLoadingAlbum } = useGetAlbumByIdQuery(albumId ?? skipToken);
  const [createAlbum, { isLoading: isCreating, error: createError }] = useCreateAlbumMutation();
  const [updateAlbum, { isLoading: isUpdating, error: updateError }] = useUpdateAlbumMutation();

  const isEditMode = Boolean(albumId);
  const isLoading = isLoadingAlbum || isCreating || isUpdating;
  const apiError = createError || updateError;

  // Populate form for edit mode
  useEffect(() => {
    if (isEditMode && albumData && albumData.data) {
      const album = albumData.data;
      setTitle(album.title);
      if (album.releaseDate) {
        setReleaseDate(album.releaseDate.split('T')[0] || '');
      }
      setGenre(album.genre);
      setSelectedArtistIds(album.artists.map(artist => artist._id)); // Map to array of IDs
      setStatus(album.status);
      if (album.coverImage) {
        setCoverImagePreview(getImageUrl(album.coverImage)); // Set existing image for preview with full URL
      }
    }
  }, [albumId, albumData, isEditMode]);

  // Handle cover image file selection and preview
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    } else {
      setCoverImageFile(null);
      setCoverImagePreview(null);
    }
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      // Only revoke if it's a blob/object URL (it starts with blob:)
      if (coverImagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !releaseDate.trim() || !genre.trim() || selectedArtistIds.length === 0) {
      alert('Please fill in all required fields, including selecting at least one artist.');
      return;
    }

    if (!isEditMode && !coverImageFile) {
      alert('Please select a cover image for the new album.');
      return;
    }

    try {
      if (isEditMode && albumId) {
        const updateBody: AlbumUpdateRequest = {
          title,
          releaseDate,
          genre,
          artists: selectedArtistIds, // Pass the array of artist IDs
          status,
        };
        if (coverImageFile) {
          updateBody.coverImage = coverImageFile;
        }
        await updateAlbum({ id: albumId, body: updateBody }).unwrap();
      } else {
        const createBody: AlbumCreateRequest = {
          title,
          releaseDate,
          genre,
          artists: selectedArtistIds, // Pass the array of artist IDs
          status,
          coverImage: coverImageFile,
        };
        await createAlbum(createBody).unwrap();
      }
      navigate('/albums'); // Redirect to album list on success
    } catch (err) {
      console.error('Failed to save album:', err);
    }
  };

  const formTitle = isEditMode ? 'Edit Album' : 'Add New Album';

  if (isLoadingAlbum && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading album data...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={formTitle} description={`${formTitle} form`} />
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formTitle}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditMode ? "Manage album details, artists, and release information." : "Add a new album to your collection."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {apiError && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-1"> {apiError && 'data' in apiError ? (apiError.data as { message: string }).message : 'Something went wrong.'}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Album Title"
                id="title"
                placeholder="Enter album title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />

              <DatePicker
                id="releaseDate"
                label="Release Date"
                placeholder="Select release date"
                value={releaseDate}
                onChange={(dates) => {
                  if (dates && dates.length > 0 && dates[0]) {
                    const date = dates[0];
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    setReleaseDate(localDate.toISOString().split("T")[0] || "");
                  } else {
                    setReleaseDate("");
                  }
                }}
              />

              <Input
                label="Genre"
                id="genre"
                placeholder="Pop, Jazz, Classical"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                disabled={isLoading}
              />

              <Select
                label="Status"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AlbumStatus)}
                disabled={isLoading}
                options={Object.values(AlbumStatus).map((s) => ({
                  label: s.charAt(0).toUpperCase() + s.slice(1),
                  value: s,
                }))}
              />
            </div>

            <ArtistSelect
              selectedArtistIds={selectedArtistIds}
              onArtistChange={setSelectedArtistIds}
              initialArtists={albumData?.data?.artists}
              label="Artists"
              placeholder="Search and select artists"
              isMulti={true}
              disabled={isLoading}
              className="w-full"
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white/90">
                Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-brand-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="coverImage" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="coverImage" name="coverImage" type="file" className="sr-only" accept="image/*" onChange={handleCoverImageChange} disabled={isLoading} />
                    </label>
                    <p className="pl-1 text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>

              {coverImagePreview && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative w-24 h-24 group">
                    <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImageFile(null);
                        setCoverImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Current Selection</p>
                    <p className="text-gray-500">Click the X to remove</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => navigate('/albums')}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isEditMode ? 'Update Album' : 'Create Album'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AlbumForm;
