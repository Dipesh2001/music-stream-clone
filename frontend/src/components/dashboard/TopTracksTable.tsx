import type React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/url';
import { formatDuration } from '../../utils/audio';
import type { TopTrack } from '../../types/analytics.types';

interface TopTracksTableProps {
    tracks: TopTrack[];
    isLoading?: boolean;
}

const TopTracksTable: React.FC<TopTracksTableProps> = ({ tracks, isLoading = false }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 animate-pulse">
                <div className="flex justify-between mb-4">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-5 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="h-3.5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Top Tracks
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Most played tracks across the platform
                    </p>
                </div>
                <Link
                    to="/tracks"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors"
                >
                    View All
                </Link>
            </div>

            <div className="max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-y border-gray-100 dark:border-gray-800">
                            <th className="py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 w-8">
                                #
                            </th>
                            <th className="py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">
                                Track
                            </th>
                            <th className="py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 hidden md:table-cell">
                                Album
                            </th>
                            <th className="py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400">
                                Duration
                            </th>
                            <th className="py-3 font-medium text-gray-500 text-end text-xs dark:text-gray-400">
                                Plays
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {tracks.map((track, index) => (
                            <tr
                                key={track._id}
                                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                onClick={() => navigate(`/tracks/${track._id}/edit`)}
                            >
                                <td className="py-3 text-sm text-gray-400 tabular-nums font-medium">
                                    {index + 1}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[44px] w-[44px] overflow-hidden rounded-md flex-shrink-0">
                                            {track.coverImage ? (
                                                <img
                                                    src={getImageUrl(track.coverImage)}
                                                    className="h-[44px] w-[44px] object-cover"
                                                    alt={track.title}
                                                />
                                            ) : (
                                                <div className="h-[44px] w-[44px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-brand-500/30 text-lg">
                                                    ♪
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 text-sm dark:text-white/90 truncate max-w-[180px]">
                                                {track.title}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/artists/${track.artistId}`);
                                                }}
                                                className="text-gray-500 text-xs dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors"
                                            >
                                                {track.artistName}
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-gray-500 text-sm dark:text-gray-400 hidden md:table-cell">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/albums/${track.albumId}`);
                                        }}
                                        className="hover:text-brand-600 dark:hover:text-brand-500 transition-colors truncate max-w-[140px] block"
                                    >
                                        {track.albumTitle}
                                    </button>
                                </td>
                                <td className="py-3 text-gray-500 text-sm dark:text-gray-400 tabular-nums">
                                    {formatDuration(track.duration)}
                                </td>
                                <td className="py-3 text-end">
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800 dark:text-white/90 tabular-nums">
                                        <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        </svg>
                                        {track.playCount.toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tracks.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">No track data available yet</p>
                </div>
            )}
        </div>
    );
};

export default TopTracksTable;
