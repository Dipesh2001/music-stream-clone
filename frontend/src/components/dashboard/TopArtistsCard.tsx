import type React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/url';
import type { TopArtist } from '../../types/analytics.types';

interface TopArtistsCardProps {
    artists: TopArtist[];
    isLoading?: boolean;
}

const TopArtistsCard: React.FC<TopArtistsCardProps> = ({ artists, isLoading = false }) => {
    const maxPlays = artists.length > 0 ? Math.max(...artists.map((a) => a.totalPlays)) : 1;

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 animate-pulse">
                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-44 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
                <div className="space-y-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                <div className="space-y-1.5">
                                    <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-2.5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-[140px]">
                                <div className="h-2 w-[100px] bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3.5 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <div className="flex justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Top Artists
                </h3>
                <Link
                    to="/artists"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                    View All →
                </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Artists ranked by total play count
            </p>

            <div className="space-y-5">
                {artists.map((artist, index) => {
                    const playPercentage = maxPlays > 0 ? Math.round((artist.totalPlays / maxPlays) * 100) : 0;

                    return (
                        <Link
                            key={artist._id}
                            to={`/artists/${artist._id}`}
                            className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-3 px-3 py-2 rounded-xl transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="items-center w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-brand-100 dark:group-hover:ring-brand-900 transition-colors">
                                        {artist.image ? (
                                            <img
                                                src={getImageUrl(artist.image)}
                                                alt={artist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-brand-500 font-bold text-sm">
                                                {artist.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm dark:text-white/90 group-hover:text-brand-600 transition-colors">
                                        {artist.name}
                                    </p>
                                    <span className="block text-gray-500 text-xs dark:text-gray-400">
                                        {artist.trackCount} tracks • {artist.totalPlays.toLocaleString()} plays
                                    </span>
                                </div>
                            </div>

                            <div className="flex w-full max-w-[140px] items-center gap-3">
                                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                    <div
                                        className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white transition-all duration-500"
                                        style={{ width: `${playPercentage}%` }}
                                    />
                                </div>
                                <p className="font-medium text-gray-800 text-sm dark:text-white/90 tabular-nums w-9 text-right">
                                    {playPercentage}%
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {artists.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                    <p className="text-sm font-medium">No artist data yet</p>
                </div>
            )}
        </div>
    );
};

export default TopArtistsCard;
