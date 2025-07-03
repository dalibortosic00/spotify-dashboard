from fastapi import APIRouter, Depends, HTTPException, Request
from models.schemas import TopItems, TopItemsParams, User
from services.spotify import get_top_items, get_user_profile

router = APIRouter()


@router.get("/me")
async def get_user(request: Request) -> User:
    """
    Fetches the user's Spotify profile information.

    Args:
        request (Request): The incoming request containing the access token.

    Returns:
        dict: A dictionary containing the user's profile information.

    Raises:
        HTTPException: If the access token is missing or the request fails.
    """
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Access token required")

    user_profile = await get_user_profile(token)
    return user_profile


@router.get("/me/top", response_model=TopItems)
async def get_user_top_items(
    request: Request, params: TopItemsParams = Depends()
) -> TopItems:
    """
    Fetches the user's top tracks and artists from Spotify.

    Args:
        request (Request): The incoming request containing the access token.
        params (TopItemsParams): Parameters for fetching top items, including limit, time range, and offset.

    Returns:
        TopItems: An object containing the user's top artists and tracks.

    Raises:
        HTTPException: If the access token is missing or the request fails.
    """
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Access token required")

    top_artists = await get_top_items(token, "artists", params)
    top_tracks = await get_top_items(token, "tracks", params)
    return TopItems(top_artists=top_artists, top_tracks=top_tracks)
