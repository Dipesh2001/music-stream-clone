import { baseApi } from './baseApi';
import type {
    GlobalSearchResponse,
    GlobalSearchQueryParams,
} from '../../types/search.types';

export const searchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        globalSearch: builder.query<GlobalSearchResponse, GlobalSearchQueryParams>({
            query: (params) => ({
                url: '/search',
                params,
            }),
            providesTags: [{ type: 'Search', id: 'GLOBAL' }],
        }),
    }),
});

export const {
    useGlobalSearchQuery,
    useLazyGlobalSearchQuery,
} = searchApi;
