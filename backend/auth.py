import os
import urllib.parse
from typing import Sequence

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from models import Item, User
from spotify import get_top_artists, get_top_tracks, get_user_profile

load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")


@router.get("/login")
def login() -> RedirectResponse:
    """
    Redirects the user to Spotify's authorization page to log in and authorize the app.
    The user will be redirected back to the specified REDIRECT_URI after authorization.
    """
    scopes = "user-top-read"
    if REDIRECT_URI is None:
        raise ValueError("REDIRECT_URI environment variable is not set")
    url = (
        "https://accounts.spotify.com/authorize?"
        f"client_id={CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(REDIRECT_URI)}&"
        f"scope={urllib.parse.quote(scopes)}"
    )
    return RedirectResponse(url)


@router.get("/callback")
async def callback(request: Request) -> dict[str, object]:
    """
    Handles the callback from Spotify after the user has authorized the app.
    Exchanges the authorization code for an access token.

    Args:
        request (Request): The incoming request containing the authorization code.

    Returns:
        dict: A dictionary containing the access token and other token information.
    """
    code = request.query_params.get("code")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": REDIRECT_URI,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    token_data = response.json()
    return token_data


@router.get("/me")
async def get_user(request: Request) -> User:
    """
    Fetches the user's Spotify profile information.

    Args:
        request (Request): The incoming request containing the access token.

    Returns:
        dict: A dictionary containing the user's profile information.
    """
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Access token required")

    user_profile = await get_user_profile(token)
    return user_profile


@router.get("/me/top")
async def get_user_top_items(
    request: Request,
) -> dict[str, Sequence[Item]]:
    """
    Fetches the user's top tracks and artists from Spotify.

    Args:
        request (Request): The incoming request containing the access token.

    Returns:
        dict: A dictionary containing the user's top artists and tracks.
    """
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Access token required")

    top_artists = await get_top_artists(token)
    top_tracks = await get_top_tracks(token)
    return {"top_artists": top_artists, "top_tracks": top_tracks}
