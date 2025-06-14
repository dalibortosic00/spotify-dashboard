from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    CLIENT_ID: str
    CLIENT_SECRET: str
    REDIRECT_URI: str
    SPOTIFY_API_BASE_URL: str
    SPOTIFY_ACCOUNTS_BASE_URL: str
    FRONTEND_URL: str

    model_config = SettingsConfigDict(
        env_file="../.env", case_sensitive=True, extra="ignore"
    )


settings = Settings()  # type: ignore
