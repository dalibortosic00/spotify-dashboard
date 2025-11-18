import type { Artist, Track } from "./spotify.ts";

export const TimeRanges = ["long_term", "medium_term", "short_term"] as const;
export type TimeRange = (typeof TimeRanges)[number];

export const ItemTypes = ["artists", "tracks"] as const;

export interface TopItemsParams {
  type?: "artists" | "tracks";
  limit?: number;
  offset?: number;
  time_range?: TimeRange;
}

export interface TopItemsResponse<T extends Artist | Track> {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: T[];
}

export interface TopItems {
  top_artists?: TopItemsResponse<Artist>;
  top_tracks?: TopItemsResponse<Track>;
}
