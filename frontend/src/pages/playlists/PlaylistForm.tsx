import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreatePlaylistMutation,
    useGetPlaylistByIdQuery,
    useUpdatePlaylistMutation,
} from '../../store/api/playlistApi';
import { PlaylistVisibility } from '../../types/playlist.types';
import { skipToken } from '@reduxjs/toolkit/query';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import { toast } from 'react-toastify';
import PageMeta from '../../components/common/PageMeta';
import { getImageUrl } from '../../utils/url';

const PlaylistForm: React.FC = () => {
    const navigate = useNavigate();
    const { id: playlistId } = useParams<{ id: string }>();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<PlaylistVisibility>(PlaylistVisibility.PUBLIC);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // API calls
    const { data: playlistData, isLoading: isLoadingPlaylist } = useGetPlaylistByIdQuery(playlistId ?? skipToken);
    const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();
    const [updatePlaylist, { isLoading: isUpdating }] = useUpdatePlaylistMutation();

    const isEditMode = Boolean(playlistId);
    const isLoading = isLoadingPlaylist || isCreating || isUpdating;

    // Populate form for edit mode
    useEffect(() => {
        if (isEditMode && playlistData && playlistData.data) {
            const playlist = playlistData.data;
            setName(playlist.name || '');
            setDescription(playlist.description || '');
            setVisibility(playlist.visibility || PlaylistVisibility.PUBLIC);
            if (playlist.coverImage) {
                setPreviewUrl(getImageUrl(playlist.coverImage));
            }
        }
    }, [playlistId, playlistData, isEditMode]);

    // Clean up object URL when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Playlist name is required');
            return;
        }

        try {
            if (isEditMode && playlistId) {
                await updatePlaylist({
                    id: playlistId,
                    body: {
                        name,
                        description,
                        visibility,
                        coverImage,
                    },
                }).unwrap();
                toast.success('Playlist updated successfully');
            } else {
                await createPlaylist({
                    name,
                    description,
                    visibility,
                    coverImage,
                }).unwrap();
                toast.success('Playlist created successfully');
            }
            navigate('/playlists');
        } catch (err: any) {
            toast.error(err.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <PageMeta title={isEditMode ? 'Edit Playlist' : 'Create Playlist'} description="Manage playlist details" />

            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate('/playlists')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Edit Playlist' : 'Create New Playlist'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Image Upload */}
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                        <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 transition-all cursor-pointer">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-medium uppercase tracking-wider">Upload Cover</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {previewUrl && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 text-center">JPG, PNG up to 5MB</p>
                    </div>

                    {/* Right Column: Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        <Input
                            label="Playlist Name"
                            id="name"
                            placeholder="Enter playlist name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:text-white"
                                placeholder="Describe your playlist..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Visibility"
                                options={[
                                    { label: 'Public - Anyone can see', value: PlaylistVisibility.PUBLIC },
                                    { label: 'Private - Only you can see', value: PlaylistVisibility.PRIVATE },
                                ]}
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as PlaylistVisibility)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/playlists')}
                        className="mr-4 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-2.5 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </div>
                        ) : (
                            isEditMode ? 'Update Playlist' : 'Create Playlist'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlaylistForm;
