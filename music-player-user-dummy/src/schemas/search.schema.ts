import { z } from "zod";
import { trackSchema, albumSchema, artistSchema } from "./track.schema";

export const searchResultsSchema = z.object({
  tracks: z.array(trackSchema).default([]),
  albums: z.array(albumSchema).default([]),
  artists: z.array(artistSchema).default([]),
  playlists: z.array(z.any()).default([]),
});
