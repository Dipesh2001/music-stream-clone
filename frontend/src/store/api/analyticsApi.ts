import { baseApi } from './baseApi';
import type {
    DashboardStatsResponse,
    TopArtistsResponse,
    TopTracksResponse,
    TopAlbumsResponse,
    TopListQueryParams,
} from '../../types/analytics.types';

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStatsResponse, void>({
            query: () => '/analytics/stats',
            providesTags: [{ type: 'Analytics', id: 'STATS' }],
        }),
        getTopTracks: builder.query<TopTracksResponse, TopListQueryParams | void>({
            query: (params) => ({
                url: '/analytics/top-tracks',
                params: params ?? undefined,
            }),
            providesTags: [{ type: 'Analytics', id: 'TOP_TRACKS' }],
        }),
        getTopArtists: builder.query<TopArtistsResponse, TopListQueryParams | void>({
            query: (params) => ({
                url: '/analytics/top-artists',
                params: params ?? undefined,
            }),
            providesTags: [{ type: 'Analytics', id: 'TOP_ARTISTS' }],
        }),
        getTopAlbums: builder.query<TopAlbumsResponse, TopListQueryParams | void>({
            query: (params) => ({
                url: '/analytics/top-albums',
                params: params ?? undefined,
            }),
            providesTags: [{ type: 'Analytics', id: 'TOP_ALBUMS' }],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetTopTracksQuery,
    useGetTopArtistsQuery,
    useGetTopAlbumsQuery,
} = analyticsApi;
