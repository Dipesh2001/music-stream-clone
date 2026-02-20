import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateTrackMutation,
    useGetTrackByIdQuery,
    useUpdateTrackMutation,
} from '../../store/api/trackApi';
import { TrackStatus } from '../../types/track.types';
import ArtistSelect from '../../components/select/ArtistSelect';
import AlbumSelect from '../../components/select/AlbumSelect';
import { skipToken } from '@reduxjs/toolkit/query';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import { extractAudioDuration, validateAudioFile, formatDuration } from '../../utils/audio';
import { toast } from 'react-toastify';
import PageMeta from '../../components/common/PageMeta';

import { getImageUrl } from '../../utils/url';

const TrackForm: React.FC = () => {
    const navigate = useNavigate();
    const { id: trackId } = useParams<{ id: string }>();

    // Form state
    const [title, setTitle] = useState('');
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
    const [albumId, setAlbumId] = useState<string>('');
    const [language, setLanguage] = useState('');
    const [isExplicit, setIsExplicit] = useState(false);
    const [order, setOrder] = useState<number>(0);
    const [status, setStatus] = useState<TrackStatus>(TrackStatus.ACTIVE);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [isValidatingAudio, setIsValidatingAudio] = useState(false);

    // API calls
    const { data: trackData, isLoading: isLoadingTrack } = useGetTrackByIdQuery(trackId ?? skipToken);
    const [createTrack, { isLoading: isCreating }] = useCreateTrackMutation();
    const [updateTrack, { isLoading: isUpdating }] = useUpdateTrackMutation();

    const isEditMode = Boolean(trackId);
    const isLoading = isLoadingTrack || isCreating || isUpdating || isValidatingAudio;

    // Populate form for edit mode
    useEffect(() => {
        if (isEditMode && trackData && trackData.data) {
            const track = trackData.data;
            setTitle(track.title || '');
            setSelectedArtistIds(track.artists?.map(a => a._id) || []);
            setAlbumId(track.album?._id || '');
            setLanguage(track.language || '');
            setIsExplicit(!!track.isExplicit);
            setOrder(track.order || 0);
            setStatus(track.status || TrackStatus.ACTIVE);
            setDuration(track.duration || 0);

            if (track.audioUrl) {
                setAudioPreviewUrl(getImageUrl(track.audioUrl));
            }
        }
    }, [trackId, trackData, isEditMode]);

    // Clean up object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (audioPreviewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(audioPreviewUrl);
            }
        };
    }, [audioPreviewUrl]);

    // Handle artist change
    const handleArtistChange = (ids: string[]) => {
        const primaryArtistId = selectedArtistIds[0];
        const resetAlbum = ids.length === 0 || (primaryArtistId !== undefined && !ids.includes(primaryArtistId));
        setSelectedArtistIds(ids);
        if (resetAlbum) {
            setAlbumId(''); // Reset album if the primary artist changes or is removed
        }
    };

    const handleAlbumChange = (ids: string[]) => {
        setAlbumId(ids[0] || '');
    };

    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!validateAudioFile(file)) {
                toast.error('Invalid audio file format. Please upload MP3, WAV, or OGG.');
                e.target.value = '';
                return;
            }

            setIsValidatingAudio(true);
            try {
                const dur = await extractAudioDuration(file);
                setDuration(dur);
                setAudioFile(file);

                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setAudioPreviewUrl(previewUrl);

                toast.success(`Audio detected: ${formatDuration(dur)}`);
            } catch (err) {
                toast.error('Could not extract audio metadata.');
                e.target.value = '';
                console.error(err);
            } finally {
                setIsValidatingAudio(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || selectedArtistIds.length === 0 || !albumId) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if (!isEditMode && !audioFile) {
            toast.error('Please upload an audio file for the new track.');
            return;
        }

        try {
            if (isEditMode && trackId) {
                await updateTrack({
                    id: trackId,
                    body: {
                        title,
                        artists: selectedArtistIds,
                        album: albumId,
                        language,
                        isExplicit,
                        order,
                        status,
                        audioFile: audioFile || undefined,
                        duration: duration,
                    }
                }).unwrap();
                toast.success('Track updated successfully');
            } else {
                await createTrack({
                    title,
                    artists: selectedArtistIds,
                    album: albumId,
                    language,
                    isExplicit,
                    order,
                    status,
                    audioFile: audioFile!,
                    duration: duration,
                }).unwrap();
                toast.success('Track created successfully');
            }
            navigate('/tracks');
        } catch (err) {
            console.error('Failed to save track:', err);
            toast.error('Failed to save track. Please check your input.');
        }
    };

    const formTitle = isEditMode ? 'Edit Track' : 'Add New Track';

    if (isLoadingTrack && isEditMode) {
        return <div className="flex justify-center items-center h-64 font-medium text-gray-500">Loading track data...</div>;
    }

    return (
        <>
            <PageMeta title={formTitle} description={`${formTitle} form`} />
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formTitle}</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isEditMode ? "Manage track details, audio, and album mapping." : "Add a new track to your music library."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Track Title"
                                id="title"
                                placeholder="Enter track title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <Input
                                label="Language"
                                id="language"
                                placeholder="English, Spanish, etc."
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                disabled={isLoading}
                            />
                            <Input
                                label="Track Order"
                                id="order"
                                type="number"
                                placeholder="0"
                                value={order}
                                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                disabled={isLoading}
                            />
                            <Select
                                label="Status"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TrackStatus)}
                                disabled={isLoading}
                                options={Object.values(TrackStatus).map(s => ({
                                    label: s.charAt(0).toUpperCase() + s.slice(1),
                                    value: s
                                }))}
                            />
                            <div className="flex items-center space-x-3 h-full pt-6">
                                <input
                                    id="isExplicit"
                                    type="checkbox"
                                    checked={isExplicit}
                                    onChange={(e) => setIsExplicit(e.target.checked)}
                                    className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded transition-colors"
                                    disabled={isLoading}
                                />
                                <label htmlFor="isExplicit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Explicit Content
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ArtistSelect
                                selectedArtistIds={selectedArtistIds}
                                onArtistChange={handleArtistChange}
                                label="Artists"
                                placeholder="Select artists"
                                isMulti={true}
                                disabled={isLoading}
                                initialArtists={trackData?.data?.artists || []}
                            />
                            <AlbumSelect
                                selectedAlbumIds={albumId ? [albumId] : []}
                                onAlbumChange={handleAlbumChange}
                                artistId={selectedArtistIds[0]} // Filter by primary artist
                                label="Album"
                                placeholder={selectedArtistIds.length > 0 ? "Select an album" : "Select an artist first"}
                                isMulti={false}
                                disabled={isLoading || selectedArtistIds.length === 0}
                                initialAlbums={trackData?.data?.album ? [trackData.data.album] : []}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/90">
                                Audio File {isEditMode && <span className="text-gray-400 font-normal">(Leave empty to keep current)</span>}
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-brand-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M9 18v18h30V18L24 6 9 18z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M24 15v12M18 21h12" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="audioFile" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none">
                                            <span>Upload audio</span>
                                            <input id="audioFile" name="audioFile" type="file" className="sr-only" accept="audio/*" onChange={handleAudioChange} disabled={isLoading} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">MP3, WAV, OGG, AAC up to 20MB</p>
                                </div>
                            </div>
                            {audioPreviewUrl && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Track Preview</p>
                                        {duration > 0 && (
                                            <div className="flex items-center space-x-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="text-xs font-medium text-brand-600">{formatDuration(duration)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <audio
                                        src={audioPreviewUrl}
                                        controls
                                        className="w-full h-10"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={() => navigate('/tracks')}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : isEditMode ? 'Update Track' : 'Create Track'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TrackForm;
