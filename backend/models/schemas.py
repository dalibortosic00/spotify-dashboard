from typing import Generic, List, Literal, Optional, TypeVar

from pydantic import BaseModel, Field, HttpUrl


class Followers(BaseModel):
    href: Optional[str] = None
    total: int


class Image(BaseModel):
    url: HttpUrl
    height: Optional[int]
    width: Optional[int]


class Restriction(BaseModel):
    reason: Literal["market", "product", "explicit"]


# This model represents the artist object when it's nested (e.g., within a Track or Album).
class SimplifiedArtist(BaseModel):
    href: str
    id: str
    name: str
    type: Literal["artist"]
    uri: str
    external_urls: Optional[dict[str, str]] = None


class Artist(SimplifiedArtist):
    followers: Optional[Followers] = None
    genres: Optional[List[str]] = None
    images: Optional[List[Image]] = None
    popularity: Optional[int] = None


# This model represents an album object when it's nested within a track.
class SimplifiedAlbum(BaseModel):
    album_type: Literal["album", "single", "compilation"]
    artists: List[SimplifiedArtist]
    available_markets: Optional[List[str]] = None
    external_urls: Optional[dict[str, str]] = None
    href: str
    id: str
    images: List[Image]
    name: str
    release_date: str
    release_date_precision: Literal["year", "month", "day"]
    total_tracks: int
    type: Literal["album"]
    uri: str
    is_playable: Optional[bool] = None
    restrictions: Optional[Restriction] = None


class Track(BaseModel):
    album: SimplifiedAlbum
    artists: List[SimplifiedArtist]
    available_markets: List[str]
    disc_number: int
    duration_ms: int
    explicit: bool
    external_urls: dict[str, str]
    href: str
    id: str
    is_local: bool
    is_playable: bool
    name: str
    popularity: int
    preview_url: Optional[str]
    track_number: int
    type: Literal["track"]
    uri: str
    restrictions: Optional[Restriction] = None


class User(BaseModel):
    country: str
    display_name: str
    email: str
    followers: Followers
    href: str
    id: str
    images: List[Image]
    type: Literal["user"]
    uri: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    scope: str
    expires_in: int
    refresh_token: Optional[str] = None


class TopItemsParams(BaseModel):
    limit: int = Field(20, ge=1, le=50)
    time_range: Literal["long_term", "medium_term", "short_term"] = "medium_term"
    offset: int = Field(0, ge=0)


T = TypeVar("T", Artist, Track)


class TopItemsResponse(BaseModel, Generic[T]):
    href: str
    limit: int
    next: Optional[str]
    offset: int
    previous: Optional[str]
    total: int
    items: List[T]


class TopItems(BaseModel):
    top_artists: TopItemsResponse[Artist]
    top_tracks: TopItemsResponse[Track]
