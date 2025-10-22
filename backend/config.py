from pathlib import Path
from typing import ClassVar

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    CLIENT_ID: str
    CLIENT_SECRET: str
    REDIRECT_URI: str
    SPOTIFY_API_BASE_URL: str
    SPOTIFY_ACCOUNTS_BASE_URL: str
    FRONTEND_URL: str

    # Resolve the .env file relative to the repository root (two levels up from this file)
    env_path: ClassVar[Path] = Path(__file__).resolve().parent.parent / ".env"
    model_config = SettingsConfigDict(
        env_file=str(env_path), case_sensitive=True, extra="ignore"
    )


settings = Settings()  # type: ignore
