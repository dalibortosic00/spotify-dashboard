from typing import List, Literal, Optional, Union

from pydantic import BaseModel, HttpUrl


class Followers(BaseModel):
    href: Optional[str]
    total: int


class Image(BaseModel):
    url: HttpUrl
    height: Optional[int]
    width: Optional[int]


class Restriction(BaseModel):
    reason: Literal["market", "product", "explicit"]


class Artist(BaseModel):
    followers: Followers
    genres: List[str]
    href: str
    id: str
    images: List[Image]
    name: str
    popularity: int
    type: Literal["artist"]
    uri: str


class Album(BaseModel):
    album_type: Literal["album", "single", "compilation"]
    total_tracks: int
    href: str
    id: str
    images: List[Image]
    name: str
    release_date: str
    release_date_precision: Literal["year", "month", "day"]
    restrictions: Optional[Restriction]
    type: Literal["album"]
    uri: str
    artists: List[Artist]


class Track(BaseModel):
    album: Album
    artists: List[Artist]
    available_markets: List[str]
    disc_number: int
    duration_ms: int
    explicit: bool
    href: str
    id: str
    is_playable: bool
    restrictions: Optional[Restriction]
    name: str
    popularity: int
    preview_url: Optional[str]
    track_number: int
    type: Literal["track"]
    uri: str


Item = Union[Artist, Track]


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
