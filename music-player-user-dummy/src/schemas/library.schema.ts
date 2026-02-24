import { z } from "zod";

export const trackResponseSchema = z.object({
    _id: z.string(),
    title: z.string(),
    audioUrl: z.string().optional(),
    duration: z.number().optional(),
    isLiked: z.boolean().optional()
}).passthrough();

export const playlistResponseSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    owner: z.any().optional(),
    tracks: z.array(z.any()).optional(),
    isPublic: z.boolean().optional(),
    coverImage: z.string().optional().nullable(),
    status: z.string().optional()
}).passthrough();

export const playlistListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(playlistResponseSchema)
});

export const singlePlaylistResponseSchema = z.object({
    success: z.boolean(),
    data: playlistResponseSchema
});

export const favoriteResponseSchema = z.object({
    _id: z.string(),
    user: z.string().or(z.object({ _id: z.string() })),
    track: trackResponseSchema.optional().nullable(),
    album: z.any().optional().nullable(),
}).passthrough();

export const favoriteListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(favoriteResponseSchema)
});

export const toggleFavoriteResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: favoriteResponseSchema.optional().nullable()
}).passthrough();

export const playHistoryItemSchema = z.object({
    _id: z.string(),
    user: z.string().or(z.object({ _id: z.string() })),
    track: trackResponseSchema,
    playedAt: z.string().optional(),
    lastPosition: z.number().optional(),
    completed: z.boolean().optional()
}).passthrough();

export const playHistoryListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(playHistoryItemSchema)
});
