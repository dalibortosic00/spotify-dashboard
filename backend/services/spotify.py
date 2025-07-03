from typing import Literal

import httpx
from config import settings
from models.schemas import Artist, TopItemsParams, TopItemsResponse, Track, User


async def get_user_profile(token: str) -> User:
    """
    Fetches the user's Spotify profile information.

    Args:
        token (str): The OAuth token for Spotify API access.

    Returns:
        dict: A dictionary containing user profile information.
    """
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.SPOTIFY_API_BASE_URL}/me", headers=headers
        )

    response.raise_for_status()
    return User.model_validate(response.json())


async def get_top_items(
    token: str,
    type: Literal["artists", "tracks"],
    params: TopItemsParams,
) -> TopItemsResponse[Artist] | TopItemsResponse[Track]:
    """
    Fetches the user's top items (artists or tracks) from Spotify.

    Args:
        token (str): The OAuth token for Spotify API access.
        type (str): The type of items to fetch, either 'artists' or 'tracks'.
        params (TopItemsParams): Parameters for fetching top items, including limit, time range, and offset.

    Returns:
        TopItemsResponse[Artist] | TopItemsResponse[Track]: An object containing the user's top artists or tracks.
    """
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.SPOTIFY_API_BASE_URL}/me/top/{type}",
            headers=headers,
            params=params.model_dump(),
        )
    response.raise_for_status()
    if type == "artists":
        return TopItemsResponse[Artist].model_validate(response.json())
    else:
        return TopItemsResponse[Track].model_validate(response.json())
