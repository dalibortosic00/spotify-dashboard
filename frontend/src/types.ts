export interface Followers {
  href?: string;
  total: number;
}

export interface Image {
  url: string;
  height?: number;
  width?: number;
}

export type RestrictionReason = "market" | "product" | "explicit";

export interface Restriction {
  reason: RestrictionReason;
}

// This model represents the artist object when it's nested (e.g., within a Track or Album).
export interface SimplifiedArtist {
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
  external_urls?: { spotify: string };
}

export interface Artist extends SimplifiedArtist {
  followers?: Followers;
  genres?: string[];
  images?: Image[];
  popularity?: number;
}

export type AlbumType = "album" | "single" | "compilation";
export type ReleaseDatePrecision = "year" | "month" | "day";

// This model represents an album object when it's nested within a track.
export interface SimplifiedAlbum {
  album_type: AlbumType;
  artists: SimplifiedArtist[];
  available_markets?: string[];
  external_urls?: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  total_tracks: number;
  type: "album";
  uri: string;
  is_playable?: boolean;
  restrictions?: Restriction;
}

export interface Track {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: "track";
  uri: string;
  restrictions?: Restriction;
}

export interface User {
  display_name: string;
  external_urls: { spotify: string };
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  type: "user";
  uri: string;
}

export type TimeRange = "long_term" | "medium_term" | "short_term";

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
