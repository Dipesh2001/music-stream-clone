import type React from 'react';
import {
    useGetDashboardStatsQuery,
    useGetTopTracksQuery,
    useGetTopArtistsQuery,
} from '../../store/api/analyticsApi';
import StatCard from '../../components/stats/StatCard';
import PlayCountBarChart from '../../components/dashboard/PlayCountBarChart';
import ArtistStatsChart from '../../components/dashboard/ArtistStatsChart';
import TopTracksTable from '../../components/dashboard/TopTracksTable';
import TopArtistsCard from '../../components/dashboard/TopArtistsCard';
import PageMeta from '../../components/common/PageMeta';

const Dashboard: React.FC = () => {
    const { data: statsData, isLoading: isLoadingStats } = useGetDashboardStatsQuery();
    const { data: topTracksData, isLoading: isLoadingTracks } = useGetTopTracksQuery({ limit: 10 });
    const { data: topArtistsData, isLoading: isLoadingArtists } = useGetTopArtistsQuery({ limit: 8 });

    const stats = statsData?.data;
    const topTracks = topTracksData?.data ?? [];
    const topArtists = topArtistsData?.data ?? [];

    return (
        <>
            <PageMeta title="Dashboard" description="Admin dashboard overview" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Header */}
                <div className="col-span-12 mb-2">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back! Here&apos;s an overview of your music platform.
                    </p>
                </div>

                {/* Stat Cards - 6 across on xl, 3 on md, 2 on sm, 1 on mobile */}
                <div className="col-span-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6">
                        <StatCard
                            title="Artists"
                            value={stats?.totalArtists ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="brand"
                            navigateTo="/artists"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Albums"
                            value={stats?.totalAlbums ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="blue"
                            navigateTo="/albums"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Tracks"
                            value={stats?.totalTracks ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="purple"
                            navigateTo="/tracks"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Users"
                            value={stats?.totalUsers ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="orange"
                            navigateTo="/users"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Playlists"
                            value={stats?.totalPlaylists ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="green"
                            navigateTo="/playlists"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Total Plays"
                            value={stats?.totalPlays ?? 0}
                            isLoading={isLoadingStats}
                            accentColor="red"
                            navigateTo="/tracks"
                            icon={
                                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                {/* Bar Chart + Top Artists */}
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <PlayCountBarChart tracks={topTracks} isLoading={isLoadingTracks} />
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <TopArtistsCard artists={topArtists} isLoading={isLoadingArtists} />
                </div>

                {/* Artist Performance Area Chart */}
                <div className="col-span-12">
                    <ArtistStatsChart artists={topArtists} isLoading={isLoadingArtists} />
                </div>

                {/* Top Tracks Table */}
                <div className="col-span-12">
                    <TopTracksTable tracks={topTracks} isLoading={isLoadingTracks} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
