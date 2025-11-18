import type { Artist, Track } from "../types/index.ts";

export function isArtist(item: Artist | Track): item is Artist {
  return item.type === "artist";
}

export function isTrack(item: Artist | Track): item is Track {
  return item.type === "track";
}
