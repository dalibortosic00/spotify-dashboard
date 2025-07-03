import urllib.parse

import httpx
from config import settings
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.get("/login")
def login() -> RedirectResponse:
    """
    Redirects the user to Spotify's authorization page to log in and authorize the app.
    The user will be redirected back to the specified REDIRECT_URI after authorization.

    Returns:
        RedirectResponse: Redirects the user to Spotify's authorization page.
    """
    scopes = "user-top-read"
    url = (
        f"{settings.SPOTIFY_ACCOUNTS_BASE_URL}/authorize?"
        f"client_id={settings.CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={urllib.parse.quote(settings.REDIRECT_URI)}&"
        f"scope={urllib.parse.quote(scopes)}"
    )
    return RedirectResponse(url)


@router.get("/callback")
async def callback(request: Request) -> RedirectResponse:
    """
    Handles the callback from Spotify after the user has authorized the app.
    Exchanges the authorization code for an access token and redirects the user
    back to the frontend with the access token in the query parameters.

    Args:
        request (Request): The incoming request containing the authorization code.

    Returns:
        RedirectResponse: Redirects the user to the frontend with the access token.

    Raises:
        HTTPException: If the authorization code is missing or the token exchange fails.
    """
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.SPOTIFY_ACCOUNTS_BASE_URL}/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.REDIRECT_URI,
                "client_id": settings.CLIENT_ID,
                "client_secret": settings.CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500, detail=f"Token exchange failed: {response.text}"
        )

    token_data = response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=500, detail="No access token returned")

    redirect_url = f"{settings.FRONTEND_URL}/?access_token={access_token}"
    return RedirectResponse(url=redirect_url)
