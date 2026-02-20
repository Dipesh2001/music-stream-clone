import React, { useEffect } from 'react';
import { getImageUrl } from '../../utils/url';
import { formatDuration } from '../../utils/audio';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    audioUrl: string;
    duration?: number;
    artists?: { name: string }[];
    albumTitle?: string;
    albumCover?: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    isOpen,
    onClose,
    title,
    audioUrl,
    duration,
    artists,
    albumTitle,
    albumCover,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const fullAudioUrl = getImageUrl(audioUrl);
    const fullCoverUrl = getImageUrl(albumCover);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                        <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                            {albumCover ? (
                                <img src={fullCoverUrl} alt={albumTitle} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-brand-500/10 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{title}</h3>
                            <p className="text-brand-600 dark:text-brand-400 font-medium">
                                {artists?.map(a => a.name).join(', ')}
                            </p>
                            {albumTitle && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">From {albumTitle}</p>
                            )}
                        </div>

                        <div className="w-full pt-4">
                            <audio
                                src={fullAudioUrl}
                                controls
                                autoPlay
                                className="w-full h-12"
                            />
                        </div>

                        <div className="flex items-center justify-between w-full text-xs text-gray-500 mt-2">
                            <span>Type: Audio/MPEG</span>
                            {duration && <span>Duration: {formatDuration(duration)}</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};
