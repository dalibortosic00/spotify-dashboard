from typing import List

import httpx
from models import Artist, Track, User

SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"


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
        response = await client.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)

    response.raise_for_status()
    return response.json()


async def get_top_artists(token: str, limit: int = 10) -> List[Artist]:
    """
    Fetches the user's top artists from Spotify.

    Args:
        token (str): The OAuth token for Spotify API access.
        limit (int): The number of top artists to retrieve. Default is 10.

    Returns:
        List[dict]: A list of dictionaries containing artist information.
    """
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_BASE_URL}/me/top/artists",
            headers=headers,
            params={"limit": limit},
        )

    response.raise_for_status()
    return response.json().get("items", [])


async def get_top_tracks(token: str, limit: int = 10) -> List[Track]:
    """
    Fetches the user's top tracks from Spotify.

    Args:
        token (str): The OAuth token for Spotify API access.
        limit (int): The number of top tracks to retrieve. Default is 10.

    Returns:
        List[dict]: A list of dictionaries containing track information.
    """
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPOTIFY_API_BASE_URL}/me/top/tracks",
            headers=headers,
            params={"limit": limit},
        )

    response.raise_for_status()
    return response.json().get("items", [])
